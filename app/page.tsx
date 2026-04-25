"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Item, Status } from "@/lib/types";

const STATUSES: { key: Status | "all"; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "reading", label: "Reading" },
  { key: "finished", label: "Finished" },
  { key: "all", label: "All" },
];

export default function Home() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [status, setStatus] = useState<Status | "all">("inbox");
  const [tag, setTag] = useState<string>("");
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/items");
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const d = (await r.json()) as { items: Item[] };
        setItems(d.items);
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
        setItems([]);
      }
    })();
  }, []);

  const allTags = useMemo(() => {
    if (!items) return [];
    const counts = new Map<string, number>();
    for (const it of items) {
      if (status !== "all" && it.status !== status) continue;
      for (const t of it.tags || []) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [items, status]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const ql = q.trim().toLowerCase();
    return items.filter((it) => {
      if (status !== "all" && it.status !== status) return false;
      if (tag && !(it.tags || []).includes(tag)) return false;
      if (ql) {
        const hay = `${it.title} ${(it.tags || []).join(" ")} ${it.author || ""}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [items, status, tag, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { inbox: 0, reading: 0, finished: 0, all: 0 };
    for (const it of items || []) {
      c[it.status] = (c[it.status] ?? 0) + 1;
      c.all += 1;
    }
    return c;
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 overflow-x-auto -mx-4 px-4 pb-1">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap border ${
              status === s.key
                ? "bg-ink text-paper border-ink"
                : "bg-white text-ink border-black/10"
            }`}
          >
            {s.label}{" "}
            <span className="opacity-60 text-xs">{counts[s.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, tag, author"
          className="flex-1 border border-black/10 rounded-lg px-3 py-2 bg-white"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border border-black/10 rounded-lg px-2 bg-white max-w-[40%]"
        >
          <option value="">All tags</option>
          {allTags.map(([t, n]) => (
            <option key={t} value={t}>
              {t} ({n})
            </option>
          ))}
        </select>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {items === null ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-sm py-8 text-center">
          {items.length === 0 ? (
            <>
              No items yet.{" "}
              <Link href="/capture" className="underline">
                Add your first link
              </Link>
              .
            </>
          ) : (
            <>No items match.</>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-black/5 bg-white border border-black/10 rounded-lg overflow-hidden">
          {filtered.map((it) => (
            <li key={it.id}>
              <Link href={`/item/${it.id}`} className="block px-3 py-3 hover:bg-black/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wide text-muted">
                      {sourceLabel(it.source_type)}
                      {it.author ? ` · ${it.author}` : ""}
                    </div>
                    <div className="font-medium truncate">{it.title}</div>
                    {(it.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {it.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-black/[0.04] rounded px-1.5 py-0.5 text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted whitespace-nowrap">{it.date_added}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function sourceLabel(s: string): string {
  return { paper: "paper", article: "article", youtube: "youtube", tweet: "tweet", other: "link" }[
    s
  ] || "link";
}
