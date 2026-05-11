/* Migiq service worker — offline cache for app shell + proxied content. */
const APP_CACHE = "migiq-app-v2";
const OFFLINE_CACHE = "migiq-offline-v1";
const KNOWN_CACHES = new Set([APP_CACHE, OFFLINE_CACHE]);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Migrate any entries from older caches into the current ones before
      // dropping them. Without this step, a cache-version bump silently
      // erases the user's offline state — any offline page load right
      // after the bump fails with ERR_FAILED.
      const keys = await caches.keys();
      const oldKeys = keys.filter((k) => !KNOWN_CACHES.has(k));
      const appCache = await caches.open(APP_CACHE);
      const offlineCache = await caches.open(OFFLINE_CACHE);
      for (const oldKey of oldKeys) {
        const old = await caches.open(oldKey);
        const requests = await old.keys();
        // Heuristic: anything under /api/proxy belongs to the offline cache;
        // everything else is app shell.
        for (const req of requests) {
          const target = new URL(req.url).pathname === "/api/proxy" ? offlineCache : appCache;
          if (!(await target.match(req))) {
            const hit = await old.match(req);
            if (hit) await target.put(req, hit.clone());
          }
        }
        await caches.delete(oldKey);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Dry-run preview requests must always hit the network (and never be
  // cached) — the whole point of a dry-run is a fresh resolution.
  if (url.pathname === "/api/proxy" && url.searchParams.get("dry") === "1") return;

  // Saved-offline content goes to its own cache and is cache-first forever.
  if (url.pathname === "/api/proxy") {
    event.respondWith(cacheFirst(req, OFFLINE_CACHE));
    return;
  }

  // The list of items + tags should be available offline (network when we can,
  // cache when we can't).
  if (
    url.pathname === "/api/items" ||
    url.pathname.startsWith("/api/items/") ||
    url.pathname === "/" ||
    url.pathname === "/tags" ||
    url.pathname.startsWith("/item/")
  ) {
    event.respondWith(networkFirst(req, APP_CACHE));
    return;
  }

  // Static Next.js assets — cache-first, fall back to network.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/manifest.json" ||
    url.pathname === "/icon.svg"
  ) {
    event.respondWith(cacheFirst(req, APP_CACHE));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  // Await the cache write so callers can verify the entry exists
  // immediately after the fetch resolves (the item page checks
  // cache.match() right after the save).
  if (res.ok) await cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) await cache.put(request, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(request);
    if (hit) return hit;
    throw e;
  }
}

// Handle "save for offline" requests from the app: pre-warm the cache.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "PREFETCH") return;
  const url = data.url;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      try {
        const res = await fetch(url, { credentials: "include" });
        if (res.ok) {
          await cache.put(url, res.clone());
          event.source && event.source.postMessage({ type: "PREFETCH_OK", url });
        } else {
          event.source &&
            event.source.postMessage({ type: "PREFETCH_FAIL", url, status: res.status });
        }
      } catch (e) {
        event.source &&
          event.source.postMessage({ type: "PREFETCH_FAIL", url, error: String(e) });
      }
    })(),
  );
});
