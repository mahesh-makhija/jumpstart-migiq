import OpenAI from "openai";
import type { TagSuggestion } from "./types";

const MODEL = "gpt-4o-mini";
const MAX_BODY_CHARS = 6000;

const SYSTEM = `You are a tagging assistant for a personal knowledge library. You will be given:
- An article's title (and possibly author + body excerpt)
- A list of existing tags the user has already used, with usage counts

Your job:
1. Suggest 2-6 tags that best describe the article's CORE topics.
2. Prefer EXISTING tags when they fit — even loosely. The user's library stays clean only if tags are reused.
3. Only propose a NEW tag if no existing tag covers a clearly distinct topic.
4. For each new tag, check whether any existing tag overlaps in meaning. If yes, flag it.
5. Use kebab-case for new tags (e.g., "large-language-models").
6. Output VALID JSON ONLY, with this exact shape:

{
  "suggested_existing": ["tag1", "tag2"],
  "suggested_new": ["new-tag"],
  "overlap_warnings": [
    {"new": "new-tag", "similar_existing": ["tag1"], "note": "short reason"}
  ]
}`;

function buildPrompt(args: {
  title: string;
  author?: string;
  body: string;
  existing: { tag: string; count: number }[];
}): string {
  const tagList = args.existing.length
    ? args.existing.map((t) => `${t.tag} (${t.count})`).join(", ")
    : "(none yet)";
  const body = (args.body || "").slice(0, MAX_BODY_CHARS);
  return `EXISTING TAGS:
${tagList}

ARTICLE:
Title: ${args.title}
${args.author ? `Author: ${args.author}\n` : ""}Body excerpt:
${body || "(no body extracted; tag from title alone)"}`;
}

function tryParse(s: string): TagSuggestion | null {
  try {
    const parsed = JSON.parse(s);
    if (
      Array.isArray(parsed.suggested_existing) &&
      Array.isArray(parsed.suggested_new) &&
      Array.isArray(parsed.overlap_warnings)
    ) {
      return parsed as TagSuggestion;
    }
  } catch {
    /* noop */
  }
  return null;
}

export async function suggestTags(args: {
  title: string;
  author?: string;
  body: string;
  existing: { tag: string; count: number }[];
}): Promise<TagSuggestion> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const client = new OpenAI({ apiKey: key });

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    max_tokens: 512,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: buildPrompt(args) },
    ],
  });

  const text = completion.choices[0]?.message?.content || "";
  const parsed = tryParse(text);
  if (parsed) return parsed;

  return { suggested_existing: [], suggested_new: [], overlap_warnings: [] };
}
