import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

function arxivPdfTarget(url: string): string | null {
  // arxiv.org/abs/<id> → arxiv.org/pdf/<id>.pdf so the offline cache holds
  // a self-contained PDF instead of the abstract HTML (which references
  // uncached CSS/images). Be permissive about www. prefix, trailing
  // slashes, and version suffixes.
  const m = url.match(
    /^https?:\/\/(?:www\.)?arxiv\.org\/abs\/([^\s?#]+?)(?:v\d+)?\/?(?:[?#].*)?$/i,
  );
  if (!m) return null;
  // Strip any trailing slash that snuck into the captured id (paranoia for
  // odd URL forms).
  const id = m[1].replace(/\/$/, "");
  if (!id) return null;
  return `https://arxiv.org/pdf/${id}.pdf`;
}

function passthrough(upstream: Response): Response {
  const headers = new Headers();
  for (const k of ["content-type", "content-length", "content-disposition"]) {
    const v = upstream.headers.get(k);
    if (v) headers.set(k, v);
  }
  // Long cache so the service worker (and the browser) keep the file around.
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(upstream.body, { status: 200, headers });
}

async function fetchUrl(url: string): Promise<Response> {
  return fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    redirect: "follow",
  });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response("invalid url", { status: 400 });
  }

  // If the input is already an arxiv abs URL, jump straight to the PDF.
  const directPdf = arxivPdfTarget(url);
  if (directPdf) {
    const upstream = await fetchUrl(directPdf);
    if (!upstream.ok || !upstream.body) {
      return new Response(`upstream ${upstream.status}`, { status: upstream.status });
    }
    return passthrough(upstream);
  }

  // Follow whatever redirect chain the input has (e.g. share.google →
  // arxiv.org/abs/...). If we land on an arxiv abstract page, throw away the
  // abstract HTML and re-fetch the PDF instead.
  const upstream = await fetchUrl(url);
  if (!upstream.ok || !upstream.body) {
    return new Response(`upstream ${upstream.status}`, { status: upstream.status });
  }
  const rewritten = arxivPdfTarget(upstream.url);
  if (rewritten) {
    upstream.body.cancel().catch(() => {});
    const pdf = await fetchUrl(rewritten);
    if (!pdf.ok || !pdf.body) {
      return new Response(`upstream ${pdf.status}`, { status: pdf.status });
    }
    return passthrough(pdf);
  }
  return passthrough(upstream);
}
