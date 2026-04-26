"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Item, Status } from "@/lib/types";

const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_TOLERANCE = 15;

const STATUSES: { key: Status | "all"; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "reading", label: "Reading" },
  { key: "finished", label: "Finished" },
  { key: "all", label: "All" },
];

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState<Item[] | null>(null);
  const [status, setStatus] = useState<Status | "all">("inbox");
  const [tag, setTag] = useState<string>("");
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [archiveBusy, setArchiveBusy] = useState(false);

  const selectionMode = selected.size > 0;

  function toggleSelect(id: string) {
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function archiveSelected() {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    setArchiveBusy(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`/api/items/${id}`, { method: "DELETE" })),
      );
      const archived = new Set<string>();
      const failures: string[] = [];
      results.forEach((res, i) => {
        if (res.status === "fulfilled" && res.value.ok) archived.add(ids[i]);
        else failures.push(ids[i]);
      });
      setItems((cur) => (cur ? cur.filter((it) => !archived.has(it.id)) : cur));
      setSelected(new Set(failures));
      if (failures.length > 0) setErr(`Failed to archive ${failures.length} item(s)`);
    } finally {
      setArchiveBusy(false);
    }
  }

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
    <div className={`space-y-4 ${selectionMode ? "pb-20" : ""}`}>
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
            <ItemRow
              key={it.id}
              item={it}
              selectionMode={selectionMode}
              selected={selected.has(it.id)}
              onOpen={() =>
                selectionMode ? toggleSelect(it.id) : router.push(`/item/${it.id}`)
              }
              onLongPress={() => toggleSelect(it.id)}
            />
          ))}
        </ul>
      )}

      {selectionMode && (
        <div className="fixed inset-x-0 bottom-0 z-20 bg-white border-t border-black/10 p-3 flex items-center gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex-1 text-sm">
            <span className="font-medium">{selected.size}</span>
            <span className="text-muted"> selected</span>
          </div>
          <button
            onClick={clearSelection}
            disabled={archiveBusy}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={archiveSelected}
            disabled={archiveBusy}
            className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm disabled:opacity-50"
          >
            {archiveBusy ? "Archiving…" : "Archive"}
          </button>
        </div>
      )}
    </div>
  );
}

function sourceLabel(s: string): string {
  return { paper: "paper", article: "article", youtube: "youtube", tweet: "tweet", other: "link" }[
    s
  ] || "link";
}

function ItemRow({
  item,
  selectionMode,
  selected,
  onOpen,
  onLongPress,
}: {
  item: Item;
  selectionMode: boolean;
  selected: boolean;
  onOpen: () => void;
  onLongPress: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const longPressed = useRef(false);
  const [pressing, setPressing] = useState(false);

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setPressing(false);
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== undefined && e.button !== 0) return;
    longPressed.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    // While already in selection mode, taps toggle selection — no need to
    // wait out the long-press timer.
    if (selectionMode) return;
    setPressing(true);
    timer.current = setTimeout(() => {
      longPressed.current = true;
      timer.current = null;
      setPressing(false);
      onLongPress();
    }, LONG_PRESS_MS);
  }

  function onPointerMove(e: PointerEvent) {
    if (!startPos.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE) clearTimer();
  }

  function onPointerUp(e: PointerEvent) {
    clearTimer();
    startPos.current = null;
    if (longPressed.current) {
      e.preventDefault();
      return;
    }
    onOpen();
  }

  function onPointerCancel() {
    clearTimer();
    startPos.current = null;
  }

  function onContextMenu(e: MouseEvent) {
    // Suppress the OS callout that fires alongside touch long-press.
    e.preventDefault();
  }

  const bg = selected
    ? "bg-red-50"
    : pressing
    ? "bg-black/[0.04]"
    : "hover:bg-black/[0.02]";

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onContextMenu={onContextMenu}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        className={`flex items-start gap-3 px-3 py-3 cursor-pointer select-none touch-pan-y transition-colors ${bg}`}
        style={{ WebkitTouchCallout: "none" }}
      >
        {selectionMode && (
          <div
            aria-hidden
            className={`mt-1 h-5 w-5 rounded border flex items-center justify-center text-xs ${
              selected ? "bg-red-600 border-red-600 text-white" : "border-black/30 bg-white"
            }`}
          >
            {selected ? "✓" : ""}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted">
            {sourceLabel(item.source_type)}
            {item.author ? ` · ${item.author}` : ""}
          </div>
          <div className="font-medium truncate">{item.title}</div>
          {(item.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.map((t) => (
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
        <div className="text-xs text-muted whitespace-nowrap">{item.date_added}</div>
      </div>
    </li>
  );
}
