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

const GOOGLE_INFRA_HOSTS = [
  "google.com",
  "gstatic.com",
  "googleapis.com",
  "googletagmanager.com",
  "googleusercontent.com",
  "ggpht.com",
  "googlesyndication.com",
  "googleadservices.com",
  "doubleclick.net",
  "youtube.com",
  "ytimg.com",
  "schema.org",
  "w3.org",
];

function isInfraHost(host: string): boolean {
  return GOOGLE_INFRA_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

function isUsefulDestination(u: string, baseHost: string): boolean {
  const h = hostnameOf(u);
  if (!h || h === baseHost) return false;
  if (isShortlink(u)) return false;
  if (isInfraHost(h)) return false;
  return true;
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

  // share.google embeds the destination as an escaped string inside JSON in
  // a script tag. Scan every absolute URL in the document (including scripts,
  // both raw and JSON-escaped \/) and pick the first one that points
  // somewhere useful.
  const all = html.matchAll(/https?:(?:\\\/|\/){2}(?:[^\s"'<>\\]|\\\/)+/g);
  const seen = new Set<string>();
  for (const m of all) {
    let u = m[0].replace(/\\\//g, "/");
    // Trim trailing punctuation that often gets glued onto matches.
    u = u.replace(/[)\],.;]+$/, "");
    if (seen.has(u)) continue;
    seen.add(u);
    if (isUsefulDestination(u, baseHost)) return u;
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

function cleanByline(byline: string | null | undefined): string | undefined {
  if (!byline) return undefined;
  const trimmed = byline.trim();
  // arxiv abstract pages put "[Submitted on ... (v1), last revised ...]"
  // in the byline. That's a date range, not an author.
  if (/^\[?submitted on/i.test(trimmed)) return undefined;
  return trimmed;
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
      author = cleanByline(parsed.byline) || author;
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

const REDDIT_UA = "web:migiq:1.0 (by /u/migiq)";

interface RedditListingChild {
  kind?: string;
  data?: {
    title?: string;
    selftext?: string;
    author?: string;
    subreddit_name_prefixed?: string;
    permalink?: string;
    url?: string;
    created_utc?: number;
    body?: string;
  };
}

interface RedditListing {
  data?: { children?: RedditListingChild[] };
}

function isRedditUrl(url: string): boolean {
  const h = hostnameOf(url).toLowerCase();
  return h === "reddit.com" || h === "www.reddit.com" || h === "old.reddit.com" || h === "redd.it";
}

async function resolveRedditUrl(input: string): Promise<string> {
  // Reddit's /s/<token> mobile share URLs 30x to /r/<sub>/comments/<id>/<slug>.
  // Reddit blocks generic UAs; use a descriptive one that their CDN accepts.
  if (!/\/s\//.test(input) && hostnameOf(input).toLowerCase() !== "redd.it") return input;
  try {
    const r = await fetch(input, {
      headers: { "User-Agent": REDDIT_UA, Accept: "text/html,*/*" },
      redirect: "follow",
    });
    r.body?.cancel().catch(() => {});
    if (r.url && r.url !== input) return r.url;
  } catch {
    /* fall through */
  }
  return input;
}

async function extractReddit(url: string): Promise<ExtractResult> {
  const resolved = await resolveRedditUrl(url);
  // Drop any query / fragment, force www.reddit.com, then ask for JSON.
  let jsonUrl: string | null = null;
  try {
    const u = new URL(resolved);
    u.hostname = "www.reddit.com";
    u.search = "";
    u.hash = "";
    let path = u.pathname.replace(/\/+$/, "");
    if (!/\.json$/.test(path)) path += ".json";
    u.pathname = path;
    jsonUrl = u.toString();
  } catch {
    /* fall through to link-only */
  }

  if (jsonUrl) {
    try {
      const r = await fetch(jsonUrl, {
        headers: { "User-Agent": REDDIT_UA, Accept: "application/json" },
        redirect: "follow",
      });
      if (r.ok) {
        const data = (await r.json()) as RedditListing | RedditListing[];
        const post = (Array.isArray(data) ? data[0] : data)?.data?.children?.[0]?.data;
        if (post && (post.title || post.body)) {
          const body = (post.selftext || post.body || "").trim();
          const result: ExtractResult = {
            title: (post.title || hostnameOf(resolved) || resolved).trim(),
            author: post.author ? `u/${post.author}` : undefined,
            date_published: post.created_utc
              ? new Date(post.created_utc * 1000).toISOString().slice(0, 10)
              : undefined,
            source_type: "article",
            body,
            local_content: body.length > 0,
          };
          if (resolved !== url) result.resolved_url = resolved;
          return result;
        }
      }
    } catch {
      /* fall through to link-only */
    }
  }

  const result = linkOnly(url, "article", "Reddit blocked the request");
  if (resolved !== url) result.resolved_url = resolved;
  return result;
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
  else if (isRedditUrl(resolved)) result = await extractReddit(resolved);
  else result = await extractArticle(resolved, source_type);
  // Prefer the deepest resolved URL: article fetch may catch a redirect that
  // the shortlink unwrap missed (share.google → arxiv via HTTP 3xx).
  const finalResolved = result.resolved_url || (resolved !== url ? resolved : undefined);
  result.resolved_url = finalResolved;
  return result;
}
