# Migiq

Personal knowledge tracker. Paste a URL on your phone — it extracts the content,
suggests tags via Claude, saves a markdown file in a GitHub repo. Browse,
filter, mark as Finished. That's it.

## Stack

- Next.js 15 (App Router) + Tailwind, deployed on Vercel
- GitHub repo as the database (one `.md` per item in `content/`)
- Claude API for tag suggestions
- Single-user, password-gated

## One-time setup (do this on phone, ~10 min)

### 1. Anthropic API key
- https://console.anthropic.com → API Keys → Create
- Copy. Costs ~$0.30/month at typical use.

### 2. GitHub Personal Access Token
- https://github.com/settings/personal-access-tokens → Generate new token (Fine-grained)
- Resource owner: your account
- Repository access: only `mahesh-makhija/jumpstart-migiq`
- Permissions → Repository → **Contents: Read and write**
- Generate. Copy.

### 3. Pick a password
Any string. You'll type it once per device, then the cookie keeps you in.

### 4. Deploy to Vercel
- https://vercel.com → "Add New Project" → import `mahesh-makhija/jumpstart-migiq`
- **Root Directory: leave empty / `./`** (the Next.js app sits at the repo root)
- Framework: Next.js (auto-detected)
- Production branch: `main`
- Add Environment Variables:
  - `ANTHROPIC_API_KEY` = (from step 1)
  - `GITHUB_TOKEN` = (from step 2)
  - `GITHUB_OWNER` = `mahesh-makhija`
  - `GITHUB_REPO` = `jumpstart-migiq`
  - `GITHUB_BRANCH` = `main`
  - `APP_PASSWORD` = (from step 3)
- Deploy.

### 5. Add to phone home screen
- Open the Vercel URL in Safari
- Share → Add to Home Screen
- Tap the new icon → enter password → done.

## Usage

- **Add link**: tap "+ Add" → paste URL → Fetch → review tag chips (solid =
  reused from your library, dashed = new) → Save. ~5s end-to-end.
- **Browse**: home screen lists Inbox by default. Status tabs, tag dropdown,
  search box on title/author/tags.
- **Open original**: item detail page → "Open original →" button.
- **Mark finished**: item detail → tap "finished".
- **Archive**: item detail → "Archive" (moves the file to `archive/`, kept in
  the repo so nothing is lost).

## Data model

Each item is a markdown file in `content/<id>.md`:

```yaml
---
id: 2026-04-25-attention-is-all-you-need
url: https://arxiv.org/abs/1706.03762
title: Attention Is All You Need
source_type: paper            # paper | article | youtube | tweet | other
author: Vaswani et al.
date_added: 2026-04-25
status: inbox                 # inbox | reading | finished
tags: [transformers, nlp]
local_content: true           # false = link only
---

<extracted body excerpt — used for tag suggestions, also greppable in the repo>
```

Archived items move to `archive/<id>.md` rather than being deleted, so the git
history isn't your only backup.

## Local development

```bash
cp .env.example .env.local
# fill in the 6 env vars
npm install
npm run dev
```

Open http://localhost:3000 → log in → use it. Anything you save commits to the
configured GitHub branch immediately, so don't run dev pointed at production
data unless that's what you want.

## Architecture notes

- **Why GitHub as the DB**: zero hosting cost, free version history, files
  remain readable and portable forever. Trade-off: ~1s write latency per save
  (fine for one user).
- **Why password not OAuth**: simpler. The Personal Access Token does the
  GitHub work server-side; the password just gates the URL.
- **Share target**: declared in `manifest.json` for Android/Chrome. iOS Safari
  doesn't honour Web Share Target, so on iPhone the practical flow is: Copy
  link → open Migiq → paste. Or build an iOS Shortcut that opens
  `https://<your-vercel-url>/capture?url=<the-url>`.
- **No vector search**: title/tag/author substring match only. Add embeddings
  later if the library grows past ~hundreds of items.
