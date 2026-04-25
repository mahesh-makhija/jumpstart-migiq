import { NextRequest, NextResponse } from "next/server";
import { extract } from "@/lib/extract";
import { suggestTags } from "@/lib/llm";
import { allTags } from "@/lib/github";
import { makeId } from "@/lib/slug";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { url } = (await req.json()) as { url?: string };
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  try {
    const [extracted, existing] = await Promise.all([extract(url), allTags()]);
    const tags = await suggestTags({
      title: extracted.title,
      author: extracted.author,
      body: extracted.body,
      existing,
    });
    return NextResponse.json({
      proposed_id: makeId(extracted.title),
      url,
      extracted,
      existing_tags: existing,
      suggestions: tags,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
