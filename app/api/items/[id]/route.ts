import { NextRequest, NextResponse } from "next/server";
import { archiveItem, getItem, updateItem } from "@/lib/github";
import type { Status } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function jsonError(e: unknown, status = 500): NextResponse {
  const msg = e instanceof Error ? e.message : String(e);
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const item = await getItem(id);
    if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (e) {
    return jsonError(e);
  }
}

interface PatchBody {
  status?: Status;
  tags?: string[];
  title?: string;
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const data = (await req.json()) as PatchBody;
    const item = await updateItem(id, {
      status: data.status,
      tags: data.tags,
      title: data.title,
    });
    return NextResponse.json({ item });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await archiveItem(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}
