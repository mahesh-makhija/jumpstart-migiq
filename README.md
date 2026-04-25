# Migiq

Personal knowledge tracker. Paste a URL on your phone, the app extracts the
content, Claude suggests tags from your existing tag library, and the result
is saved as a markdown file in this repo. See [MIGIQ.md](./MIGIQ.md) for full
setup and architecture.

## Layout

- `app/`, `lib/`, `public/`, etc. — Next.js application (Migiq)
- `content/` — saved knowledge items (`.md` per item, written by the app)
- `archive/` — soft-deleted items (created on first archive)
- `autoresearch/` — unrelated Python experiment kept for reference; see
  [autoresearch/README.md](./autoresearch/README.md)

## Deploy

See [MIGIQ.md](./MIGIQ.md) for the phone-only setup (Vercel, GitHub PAT,
Anthropic key, password). Vercel detects Next.js automatically — Root
Directory should be left empty / `./`.
