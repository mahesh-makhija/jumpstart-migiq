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

const SHORTLINK_HOSTS = new Set([
  "share.google",
  "g.co",
  "t.co",
  "lnkd.in",
  "bit.ly",
  "tinyurl.com",
  "buff.ly",
  "ow.ly",
  "goo.gl",
]);

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function isShortlink(url: string): boolean {
  return SHORTLINK_HOSTS.has(hostnameOf(url));
}

function absolutize(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function findDestinationInHtml(html: string, baseUrl: string): string | null {
  const meta = html.match(
    /<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["'][^"']*url=([^"'>\s]+)/i,
  );
  if (meta && meta[1]) {
    const u = absolutize(meta[1], baseUrl);
    if (!isShortlink(u)) return u;
  }

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonical && canonical[1]) {
    const u = absolutize(canonical[1], baseUrl);
    if (!isShortlink(u) && hostnameOf(u) !== hostnameOf(baseUrl)) return u;
  }

  const og = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i);
  if (og && og[1]) {
    const u = absolutize(og[1], baseUrl);
    if (!isShortlink(u) && hostnameOf(u) !== hostnameOf(baseUrl)) return u;
  }

  const baseHost = hostnameOf(baseUrl);
  const hrefMatches = html.matchAll(/href=["'](https?:\/\/[^"'\s]+)["']/gi);
  for (const m of hrefMatches) {
    const u = m[1];
    const h = hostnameOf(u);
    if (!h || h === baseHost || isShortlink(u)) continue;
    if (h.endsWith(".google.com") || h === "google.com" || h === "support.google.com") continue;
    return u;
  }

  return null;
}

async function unwrapShortlink(url: string): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!r.ok) return null;
    if (!isShortlink(r.url)) return r.url;
    const html = await r.text();
    return findDestinationInHtml(html, r.url);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(
  url: string,
  timeoutMs = 12000,
): Promise<{ text: string; finalUrl: string } | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!r.ok) return null;
    return { text: await r.text(), finalUrl: r.url };
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
  const fetched = await fetchText(fetchUrl);
  if (!fetched) return linkOnly(url, source_type, "Could not fetch page");
  const { text: html, finalUrl } = fetched;

  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => {});
  virtualConsole.on("warn", () => {});
  virtualConsole.on("jsdomError", () => {});

  const dom = new JSDOM(html, { url: finalUrl, virtualConsole });
  const meta = extractOG(dom);

  let title =
    meta["og:title"] || meta["twitter:title"] || meta["title"] || hostnameOf(finalUrl) || url;
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
    resolved_url: finalUrl !== url ? finalUrl : undefined,
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
    title: hostnameOf(url) || url,
    source_type,
    body: `(${reason})`,
    local_content: false,
  };
}

export async function extract(url: string): Promise<ExtractResult> {
  let resolved = url;
  if (isShortlink(url)) {
    const unwrapped = await unwrapShortlink(url);
    if (unwrapped && unwrapped !== url) resolved = unwrapped;
  }
  const source_type = classify(resolved);
  let result: ExtractResult;
  if (source_type === "youtube") result = await extractYouTube(resolved);
  else if (source_type === "tweet") result = await extractTweet(resolved);
  else result = await extractArticle(resolved, source_type);
  // Prefer the deepest resolved URL: article fetch may catch a redirect that
  // the shortlink unwrap missed (share.google → arxiv via HTTP 3xx).
  const finalResolved = result.resolved_url || (resolved !== url ? resolved : undefined);
  result.resolved_url = finalResolved;
  return result;
}
