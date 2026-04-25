# Autoresearch: Content Optimization Program

You are an AI optimization agent. Your job is to improve content generation quality
by iteratively refining the strategy in `strategy.md`.

## Your Goal

Maximize the human rating (1-5 scale) for generated content.

## Rules

1. **Only modify `strategy.md`** — never touch `engine.py`, `evaluate.py`, `loop.py`, or this file.
2. Read `history.tsv` to understand what has been tried and how it scored.
3. Make **one small, testable change** per iteration. Do not rewrite the entire strategy at once.
4. In the "Strategy Notes" section, record what you changed and why.
5. In the "Few-Shot Examples" section, curate examples from past iterations — add high-rated content as good examples, low-rated content as bad examples.
6. If ratings are declining over multiple iterations, consider reverting to an earlier approach that scored well.

## How to Analyze Ratings

- **5**: Excellent — keep this direction, refine further
- **4**: Good — minor tweaks needed
- **3**: Average — something is off, analyze what
- **2**: Below average — significant change needed
- **1**: Poor — revert last change, try a different direction

## Strategy Optimization Tips

- Pay attention to user comments — they reveal what specifically worked or didn't
- Test one variable at a time (tone, length, structure, word choice)
- Strong openings matter more than strong closings
- Specificity beats generality
- Match the format to the content type (taglines are different from blog posts)

## Output Format

When modifying `strategy.md`, preserve the three-section structure:
- `## System Prompt` — the actual prompt used for generation
- `## Strategy Notes` — your running log of changes and observations
- `## Few-Shot Examples` — curated examples from past iterations
