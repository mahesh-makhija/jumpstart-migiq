"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Item, Status } from "@/lib/types";

const STATUSES: Status[] = ["inbox", "reading", "finished"];

type OfflineState = "checking" | "online" | "saving" | "saved" | "failed";

function proxyUrl(originalUrl: string): string {
  return `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
}

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [offline, setOffline] = useState<OfflineState>("checking");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/items/${id}`);
        if (r.ok) {
          const d = (await r.json()) as { item: Item };
          setItem(d.item);
          return;
        }
        if (r.status !== 404) {
          setErr(`HTTP ${r.status}`);
          return;
        }
      } catch {
        /* fall through to list-cache fallback */
      }
      // Either offline with no cached detail, or a transient 404 from
      // GitHub right after creation. Fall back to the list response
      // (which the SW caches and which already contains the frontmatter).
      try {
        const lr = await fetch("/api/items");
        if (!lr.ok) {
          setErr(`HTTP ${lr.status}`);
          return;
        }
        const ld = (await lr.json()) as { items: Item[] };
        const found = ld.items.find((i) => i.id === id);
        if (found) setItem(found);
        else setErr("Item not found");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [id]);

  // Once we know the item, check whether its proxy URL is already in the
  // service worker offline cache.
  useEffect(() => {
    if (!item) return;
    if (typeof caches === "undefined") {
      setOffline("online");
      return;
    }
    (async () => {
      const cache = await caches.open("migiq-offline-v1");
      const hit = await cache.match(proxyUrl(item.url));
      setOffline(hit ? "saved" : "online");
    })();
  }, [item]);

  async function patch(next: Partial<Pick<Item, "status" | "tags">>) {
    if (!item) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(e.error || `HTTP ${r.status}`);
      }
      const d = (await r.json()) as { item: Item };
      setItem(d.item);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!confirm("Archive this item?")) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      router.push("/");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  function addTag() {
    if (!item) return;
    const v = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!v || item.tags.includes(v)) return;
    patch({ tags: [...item.tags, v] });
    setTagInput("");
  }

  function removeTag(t: string) {
    if (!item) return;
    patch({ tags: item.tags.filter((x) => x !== t) });
  }

  async function saveOffline() {
    if (!item) return;
    setOffline("saving");
    const target = proxyUrl(item.url);
    try {
      const res = await fetch(target, { credentials: "include" });
      if (!res.ok) {
        setOffline("failed");
        return;
      }
      // Reading the body forces the SW to cache it.
      await res.blob();
      const cache = await caches.open("migiq-offline-v1");
      const hit = await cache.match(target);
      setOffline(hit ? "saved" : "online");
    } catch {
      setOffline("failed");
    }
  }

  async function removeOffline() {
    if (!item) return;
    const cache = await caches.open("migiq-offline-v1");
    await cache.delete(proxyUrl(item.url));
    setOffline("online");
  }

  if (err) return <p className="text-sm text-red-600">{err}</p>;
  if (!item) return <p className="text-sm text-muted">Loading…</p>;

  const openHref = offline === "saved" ? proxyUrl(item.url) : item.url;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted">
          {item.source_type}
          {item.author ? ` · ${item.author}` : ""}
        </div>
        <h1 className="text-xl font-semibold mt-1">{item.title}</h1>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent break-all underline"
        >
          {item.url}
        </a>
      </div>

      <a
        href={openHref}
        target="_blank"
        rel="noreferrer"
        className="block w-full text-center bg-ink text-paper rounded-lg py-3"
      >
        Open original →
      </a>

      <div>
        <div className="text-sm font-medium mb-2">Offline</div>
        {offline === "checking" && <p className="text-sm text-muted">Checking…</p>}
        {offline === "online" && (
          <button
            onClick={saveOffline}
            className="w-full rounded-lg py-2 text-sm border border-black/10 bg-white"
          >
            Save for offline reading
          </button>
        )}
        {offline === "saving" && (
          <button
            disabled
            className="w-full rounded-lg py-2 text-sm border border-black/10 bg-white opacity-60"
          >
            Saving…
          </button>
        )}
        {offline === "saved" && (
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg py-2 text-sm text-center bg-emerald-50 border border-emerald-200 text-emerald-800">
              Available offline ✓
            </div>
            <button
              onClick={removeOffline}
              className="rounded-lg px-3 text-sm border border-black/10 bg-white"
            >
              Remove
            </button>
          </div>
        )}
        {offline === "failed" && (
          <div className="space-y-1">
            <button
              onClick={saveOffline}
              className="w-full rounded-lg py-2 text-sm border border-amber-300 bg-amber-50 text-amber-900"
            >
              Retry save
            </button>
            <p className="text-xs text-muted">
              Some sites block cross-origin downloads (paywalls, login walls). The link
              still opens online.
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Status</div>
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={busy}
              onClick={() => patch({ status: s })}
              className={`flex-1 rounded-lg py-2 text-sm border ${
                item.status === s
                  ? "bg-ink text-paper border-ink"
                  : "bg-white text-ink border-black/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Tags</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags.map((t) => (
            <button
              key={t}
              onClick={() => removeTag(t)}
              disabled={busy}
              className="rounded-full px-3 py-1 text-sm bg-white border border-black/15"
              title="Click to remove"
            >
              {t} ✕
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag"
            className="flex-1 border border-black/10 rounded-lg px-3 py-2 bg-white"
          />
          <button
            type="button"
            onClick={addTag}
            disabled={busy || !tagInput}
            className="px-3 rounded-lg border border-black/10 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-muted">Saved excerpt</summary>
        <pre className="whitespace-pre-wrap mt-2 text-sm text-ink/80 bg-white border border-black/10 rounded p-3 max-h-80 overflow-auto">
          {item.body || "(no body saved — link only)"}
        </pre>
      </details>

      <button
        onClick={archive}
        disabled={busy}
        className="w-full text-sm text-red-600 border border-red-200 rounded-lg py-2 disabled:opacity-50"
      >
        Archive
      </button>
    </div>
  );
}
