export function slugify(s: string, max = 60): string {
  const base = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);
  return base || "untitled";
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function makeId(title: string): string {
  return `${todayISO()}-${slugify(title)}`;
}
