import { NextRequest, NextResponse } from "next/server";
import { createItem, listItems } from "@/lib/github";
import { todayISO, makeId } from "@/lib/slug";
import type { ItemFrontmatter, SourceType, Status } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const items = await listItems();
  items.sort((a, b) => (a.date_added < b.date_added ? 1 : -1));
  return NextResponse.json({ items });
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
