import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";
import type { ExtractResult, SourceType } from "./types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
  "(KHTML, like Gecko) Version/17.0 Safari/605.1.15";

function classify(url: string): SourceType {
  const u = url.toLowerCase();
  if (u.includes("arxiv.org") || u.endsWith(".pdf")) return "paper";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("twitter.com") || u.includes("x.com")) return "tweet";
  return "article";
}

async function fetchText(url: string, timeoutMs = 12000): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchJSON<T>(url: string, timeoutMs = 8000): Promise<T | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function extractOG(dom: JSDOM): Record<string, string> {
  const meta: Record<string, string> = {};
  const tags = dom.window.document.querySelectorAll(
    'meta[property^="og:"], meta[name^="twitter:"], meta[name="author"], meta[name="description"]',
  );
  tags.forEach((el) => {
    const key = el.getAttribute("property") || el.getAttribute("name") || "";
    const val = el.getAttribute("content") || "";
    if (key && val) meta[key] = val;
  });
  const title = dom.window.document.querySelector("title");
  if (title) meta["title"] = title.textContent ?? "";
  return meta;
}

function arxivAbsUrl(url: string): string | null {
  // Convert arxiv.org/pdf/<id>(.pdf)? → arxiv.org/abs/<id> so Readability
  // can pull title + abstract from the HTML page instead of choking on the PDF.
  const m = url.match(/^https?:\/\/arxiv\.org\/pdf\/([^\s?#]+?)(?:\.pdf)?(?:[?#].*)?$/i);
  if (!m) return null;
  return `https://arxiv.org/abs/${m[1]}`;
}

async function extractArticle(url: string, source_type: SourceType): Promise<ExtractResult> {
  const fetchUrl = arxivAbsUrl(url) || url;
  const html = await fetchText(fetchUrl);
  if (!html) return linkOnly(url, source_type, "Could not fetch page");

  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {});
  virtualConsole.on("warn", () => {});
  virtualConsole.on("jsdomError", () => {});

  const dom = new JSDOM(html, { url: fetchUrl, virtualConsole });
  const meta = extractOG(dom);

  let title = meta["og:title"] || meta["twitter:title"] || meta["title"] || url;
  let author = meta["author"] || meta["article:author"] || undefined;
  const datePublished =
    meta["article:published_time"] ||
    meta["og:article:published_time"] ||
    meta["date"] ||
    undefined;

  let body = "";
  let local = false;

  try {
    const reader = new Readability(dom.window.document);
    const parsed = reader.parse();
    if (parsed && parsed.textContent && parsed.textContent.trim().length > 200) {
      title = parsed.title || title;
      author = parsed.byline || author;
      body = parsed.textContent.trim();
      local = true;
    }
  } catch {
    /* fallthrough to OG-only */
  }

  if (!local) {
    const desc = meta["og:description"] || meta["twitter:description"] || meta["description"] || "";
    body = desc;
  }

  return {
    title: title.trim(),
    author: author?.trim(),
    date_published: datePublished,
    source_type,
    body,
    local_content: local,
  };
}

interface OEmbed {
  title?: string;
  author_name?: string;
  html?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractYouTube(url: string): Promise<ExtractResult> {
  const oe = await fetchJSON<OEmbed>(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  );
  if (!oe) return linkOnly(url, "youtube", "Could not fetch oEmbed");
  return {
    title: oe.title || url,
    author: oe.author_name,
    source_type: "youtube",
    body: "",
    local_content: false,
  };
}

async function extractTweet(url: string): Promise<ExtractResult> {
  // Twitter's public oEmbed still works without auth.
  const oe = await fetchJSON<OEmbed>(
    `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=1`,
  );
  if (!oe) return linkOnly(url, "tweet", "Could not fetch oEmbed");
  const body = oe.html ? stripHtml(oe.html) : "";
  const title = body.length > 0 ? body.slice(0, 120) : oe.author_name || url;
  return {
    title,
    author: oe.author_name,
    source_type: "tweet",
    body,
    local_content: body.length > 0,
  };
}

function linkOnly(url: string, source_type: SourceType, reason: string): ExtractResult {
  return {
    title: url,
    source_type,
    body: `(${reason})`,
    local_content: false,
  };
}

export async function extract(url: string): Promise<ExtractResult> {
  const source_type = classify(url);
  if (source_type === "youtube") return extractYouTube(url);
  if (source_type === "tweet") return extractTweet(url);
  return extractArticle(url, source_type);
}
