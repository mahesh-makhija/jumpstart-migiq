import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response("invalid url", { status: 400 });
  }

  const upstream = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    redirect: "follow",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(`upstream ${upstream.status}`, { status: upstream.status });
  }

  const headers = new Headers();
  const passthrough = ["content-type", "content-length", "content-disposition"];
  for (const k of passthrough) {
    const v = upstream.headers.get(k);
    if (v) headers.set(k, v);
  }
  // Long cache so the service worker (and the browser) keep the file around.
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, { status: 200, headers });
}
