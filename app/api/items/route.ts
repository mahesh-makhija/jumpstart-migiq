import { NextRequest, NextResponse } from "next/server";
import { createItem, listItems } from "@/lib/github";
import { todayISO, makeId } from "@/lib/slug";
import type { ItemFrontmatter, SourceType, Status } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function sortKey(it: { created_at?: string; date_added: string }): string {
  const k = it.created_at || it.date_added || "";
  // Normalize a date-only value (older items) to a full timestamp so it
  // compares consistently against full ISO created_at timestamps.
  return /T/.test(k) ? k : `${k}T00:00:00.000Z`;
}

export async function GET() {
  try {
    const items = await listItems();
    items.sort((a, b) => {
      const ka = sortKey(a);
      const kb = sortKey(b);
      if (ka < kb) return 1;
      if (ka > kb) return -1;
      return 0;
    });
    return NextResponse.json({ items });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

interface CreateBody {
  url: string;
  title: string;
  source_type: SourceType;
  author?: string;
  date_published?: string;
  tags: string[];
  body: string;
  local_content: boolean;
  status?: Status;
  id?: string;
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as CreateBody;
  if (!data.url || !data.title) {
    return NextResponse.json({ error: "url and title required" }, { status: 400 });
  }
  const fm: ItemFrontmatter = {
    id: data.id || makeId(data.title),
    url: data.url,
    title: data.title,
    source_type: data.source_type || "article",
    author: data.author,
    date_published: data.date_published,
    date_added: todayISO(),
    created_at: new Date().toISOString(),
    status: data.status || "inbox",
    tags: (data.tags || []).map((t) => t.trim()).filter(Boolean),
    local_content: !!data.local_content,
  };
  try {
    const item = await createItem(fm, data.body || "");
    return NextResponse.json({ item });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
