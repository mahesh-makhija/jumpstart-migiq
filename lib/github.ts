import matter from "gray-matter";
import type { Item, ItemFrontmatter } from "./types";

const API = "https://api.github.com";

function env() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) {
    throw new Error("GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO must be set");
  }
  return { token, owner, repo, branch };
}

function headers() {
  const { token } = env();
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

const CONTENT_DIR = "content";
const ARCHIVE_DIR = "archive";

async function gh(path: string, init?: RequestInit): Promise<Response> {
  const { owner, repo } = env();
  return fetch(`${API}/repos/${owner}/${repo}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers as Record<string, string> | undefined) },
    cache: "no-store",
  });
}

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  type: "file" | "dir";
  download_url: string | null;
}

async function listDir(dir: string): Promise<GitHubFile[]> {
  const { branch } = env();
  const r = await gh(`/contents/${dir}?ref=${encodeURIComponent(branch)}`);
  if (r.status === 404) return [];
  if (!r.ok) throw new Error(`GitHub list ${dir}: ${r.status}`);
  const data = (await r.json()) as GitHubFile[] | GitHubFile;
  return Array.isArray(data) ? data : [data];
}

async function readFile(path: string): Promise<{ content: string; sha: string } | null> {
  const { branch } = env();
  const r = await gh(`/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub read ${path}: ${r.status}`);
  const data = (await r.json()) as { content: string; encoding: string; sha: string };
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

async function putFile(opts: {
  path: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<void> {
  const { branch } = env();
  const body = {
    message: opts.message,
    content: Buffer.from(opts.content, "utf-8").toString("base64"),
    branch,
    sha: opts.sha,
  };
  const r = await gh(`/contents/${encodeURIComponent(opts.path)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`GitHub put ${opts.path}: ${r.status} ${text}`);
  }
}

async function deleteFile(opts: { path: string; sha: string; message: string }): Promise<void> {
  const { branch } = env();
  const r = await gh(`/contents/${encodeURIComponent(opts.path)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: opts.message, sha: opts.sha, branch }),
  });
  if (!r.ok) throw new Error(`GitHub delete ${opts.path}: ${r.status}`);
}

function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

function serialize(fm: ItemFrontmatter, body: string): string {
  return matter.stringify(body, clean(fm as unknown as Record<string, unknown>));
}

function parse(path: string, raw: string, sha: string): Item {
  const { data, content } = matter(raw);
  const fm = data as ItemFrontmatter;
  return { ...fm, body: content, sha, path };
}

export async function listItems(): Promise<Item[]> {
  const files = await listDir(CONTENT_DIR);
  const mds = files.filter((f) => f.type === "file" && f.name.endsWith(".md"));
  // Fetch each file's content to read frontmatter. For up to a few hundred items
  // this is fine; if it grows, switch to git tree + raw fetch.
  const items = await Promise.all(
    mds.map(async (f) => {
      const r = await readFile(f.path);
      if (!r) return null;
      try {
        const item = parse(f.path, r.content, r.sha);
        // Skip files without proper frontmatter (e.g. a stray README.md
        // dropped into content/ by hand).
        if (!item.id || !item.title) return null;
        return item;
      } catch {
        return null;
      }
    }),
  );
  return items.filter((x): x is Item => x !== null);
}

export async function getItem(id: string): Promise<Item | null> {
  const path = `${CONTENT_DIR}/${id}.md`;
  const r = await readFile(path);
  if (!r) return null;
  return parse(path, r.content, r.sha);
}

export async function createItem(fm: ItemFrontmatter, body: string): Promise<Item> {
  const path = `${CONTENT_DIR}/${fm.id}.md`;
  const content = serialize(fm, body);
  await putFile({ path, content, message: `add ${fm.id}` });
  const fresh = await getItem(fm.id);
  if (!fresh) throw new Error("Created but could not re-read item");
  return fresh;
}

export async function updateItem(
  id: string,
  next: Partial<ItemFrontmatter>,
  bodyOverride?: string,
): Promise<Item> {
  const existing = await getItem(id);
  if (!existing) throw new Error(`Item not found: ${id}`);
  const merged: ItemFrontmatter = {
    id: existing.id,
    url: next.url ?? existing.url,
    title: next.title ?? existing.title,
    source_type: next.source_type ?? existing.source_type,
    author: next.author ?? existing.author,
    date_published: next.date_published ?? existing.date_published,
    date_added: existing.date_added,
    status: next.status ?? existing.status,
    tags: next.tags ?? existing.tags,
    local_content: next.local_content ?? existing.local_content,
  };
  const body = bodyOverride ?? existing.body;
  const content = serialize(merged, body);
  await putFile({
    path: existing.path,
    content,
    message: `update ${id}`,
    sha: existing.sha,
  });
  const fresh = await getItem(id);
  if (!fresh) throw new Error("Updated but could not re-read item");
  return fresh;
}

export async function archiveItem(id: string): Promise<void> {
  const existing = await getItem(id);
  if (!existing) throw new Error(`Item not found: ${id}`);
  const archivedPath = `${ARCHIVE_DIR}/${id}.md`;
  const fm: ItemFrontmatter = {
    id: existing.id,
    url: existing.url,
    title: existing.title,
    source_type: existing.source_type,
    author: existing.author,
    date_published: existing.date_published,
    date_added: existing.date_added,
    status: existing.status,
    tags: existing.tags,
    local_content: existing.local_content,
  };
  const content = serialize(fm, existing.body);
  await putFile({
    path: archivedPath,
    content,
    message: `archive ${id}`,
  });
  await deleteFile({
    path: existing.path,
    sha: existing.sha!,
    message: `archive ${id} (remove from content)`,
  });
}

export async function allTags(): Promise<{ tag: string; count: number }[]> {
  const items = await listItems();
  const counts = new Map<string, number>();
  for (const it of items) {
    for (const t of it.tags || []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
