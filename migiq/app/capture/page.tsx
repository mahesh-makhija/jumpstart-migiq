"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ExtractResult, TagSuggestion } from "@/lib/types";

interface ExtractResponse {
  proposed_id: string;
  url: string;
  extracted: ExtractResult;
  existing_tags: { tag: string; count: number }[];
  suggestions: TagSuggestion;
}

function CaptureInner() {
  const router = useRouter();
  const params = useSearchParams();

  const sharedUrl = params.get("shared_url") || params.get("url") || "";
  const sharedText = params.get("shared_text") || "";
  const initialUrl = sharedUrl || extractUrlFromText(sharedText) || "";

  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState<ExtractResponse | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const autoRan = useRef(false);

  async function fetchPreview(target: string) {
    if (!target) return;
    setBusy(true);
    setErr(null);
    setData(null);
    try {
      const r = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(e.error || `HTTP ${r.status}`);
      }
      const d = (await r.json()) as ExtractResponse;
      setData(d);
      setTags([...d.suggestions.suggested_existing, ...d.suggestions.suggested_new]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (initialUrl && !autoRan.current) {
      autoRan.current = true;
      fetchPreview(initialUrl);
    }
  }, [initialUrl]);

  function toggleTag(t: string) {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function addNewTag() {
    const v = newTagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!v) return;
    if (!tags.includes(v)) setTags([...tags, v]);
    setNewTagInput("");
  }

  async function save() {
    if (!data) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.proposed_id,
          url: data.url,
          title: data.extracted.title,
          source_type: data.extracted.source_type,
          author: data.extracted.author,
          date_published: data.extracted.date_published,
          tags,
          body: data.extracted.body,
          local_content: data.extracted.local_content,
        }),
      });
      if (!r.ok) {
        const e = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(e.error || `HTTP ${r.status}`);
      }
      router.push("/");
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }

  const existingNames = new Set((data?.existing_tags || []).map((t) => t.tag));
  const suggestedExisting = data?.suggestions.suggested_existing || [];
  const suggestedNew = data?.suggestions.suggested_new || [];
  const overlapWarnings = data?.suggestions.overlap_warnings || [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add link</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchPreview(url);
        }}
        className="flex gap-2"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="flex-1 border border-black/10 rounded-lg px-3 py-3 bg-white"
        />
        <button
          type="submit"
          disabled={busy || !url}
          className="bg-ink text-paper rounded-lg px-4 disabled:opacity-50"
        >
          {busy && !data ? "…" : "Fetch"}
        </button>
      </form>

      {err && <p className="text-sm text-red-600">{err}</p>}

      {data && (
        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <div className="text-xs uppercase tracking-wide text-muted">
              {data.extracted.source_type}
              {data.extracted.local_content ? " · saved" : " · link only"}
            </div>
            <div className="font-medium mt-1">{data.extracted.title}</div>
            {data.extracted.author && (
              <div className="text-sm text-muted">{data.extracted.author}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Suggested tags</div>
            <div className="flex flex-wrap gap-2">
              {suggestedExisting.map((t) => (
                <TagChip
                  key={t}
                  label={t}
                  active={tags.includes(t)}
                  onClick={() => toggleTag(t)}
                  variant="existing"
                />
              ))}
              {suggestedNew.map((t) => (
                <TagChip
                  key={t}
                  label={t}
                  active={tags.includes(t)}
                  onClick={() => toggleTag(t)}
                  variant="new"
                />
              ))}
              {suggestedExisting.length === 0 && suggestedNew.length === 0 && (
                <div className="text-sm text-muted">No suggestions — add your own below.</div>
              )}
            </div>

            {overlapWarnings.length > 0 && (
              <div className="mt-3 space-y-1">
                {overlapWarnings.map((w) => (
                  <div
                    key={w.new}
                    className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1"
                  >
                    <b>{w.new}</b> overlaps with{" "}
                    {w.similar_existing.map((s) => `"${s}"`).join(", ")} — {w.note}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Add tag</div>
            <div className="flex gap-2">
              <input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
                placeholder="kebab-case"
                className="flex-1 border border-black/10 rounded-lg px-3 py-2 bg-white"
              />
              <button
                type="button"
                onClick={addNewTag}
                className="px-3 rounded-lg border border-black/10"
              >
                Add
              </button>
            </div>
            {tags.filter((t) => !suggestedExisting.includes(t) && !suggestedNew.includes(t))
              .length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags
                  .filter((t) => !suggestedExisting.includes(t) && !suggestedNew.includes(t))
                  .map((t) => (
                    <TagChip
                      key={t}
                      label={t}
                      active
                      onClick={() => toggleTag(t)}
                      variant={existingNames.has(t) ? "existing" : "new"}
                    />
                  ))}
              </div>
            )}
          </div>

          <button
            onClick={save}
            disabled={busy || tags.length === 0}
            className="w-full bg-ink text-paper rounded-lg py-3 disabled:opacity-50"
          >
            {busy ? "Saving…" : `Save with ${tags.length} tag${tags.length === 1 ? "" : "s"}`}
          </button>
        </div>
      )}
    </div>
  );
}

function TagChip({
  label,
  active,
  variant,
  onClick,
}: {
  label: string;
  active: boolean;
  variant: "existing" | "new";
  onClick: () => void;
}) {
  const base = "rounded-full px-3 py-1 text-sm transition-colors cursor-pointer select-none";
  const dashed = variant === "new" ? "border-dashed" : "border-solid";
  const cls = active
    ? `${base} bg-ink text-paper border ${dashed} border-ink`
    : `${base} bg-white text-ink border ${dashed} border-black/20`;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {label}
    </button>
  );
}

function extractUrlFromText(text: string): string | null {
  const m = text.match(/https?:\/\/\S+/);
  return m ? m[0] : null;
}

export default function CapturePage() {
  return (
    <Suspense fallback={null}>
      <CaptureInner />
    </Suspense>
  );
}
