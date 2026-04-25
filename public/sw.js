/* Migiq service worker — offline cache for app shell + proxied content. */
const APP_CACHE = "migiq-app-v1";
const OFFLINE_CACHE = "migiq-offline-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== APP_CACHE && k !== OFFLINE_CACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

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
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch (e) {
    // No cache, no network. Browser shows its own offline page.
    throw e;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
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
