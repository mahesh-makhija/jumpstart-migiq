"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Item } from "@/lib/types";

export default function TagsPage() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/items");
      if (r.ok) {
        const d = (await r.json()) as { items: Item[] };
        setItems(d.items);
      } else {
        setItems([]);
      }
    })();
  }, []);

  if (items === null) return <p className="text-sm text-muted">Loading…</p>;

  const counts = new Map<string, number>();
  for (const it of items) {
    for (const t of it.tags || []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  const entries = Array.from(counts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Tags</h1>
      {entries.length === 0 ? (
        <p className="text-sm text-muted">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {entries.map(([tag, n]) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}`}
              className="rounded-full px-3 py-1 text-sm bg-white border border-black/10"
            >
              {tag} <span className="text-muted">{n}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
