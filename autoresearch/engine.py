"""Content generation engine. Parses strategy.md and calls Claude API."""

import os
from pathlib import Path

import anthropic


def load_strategy(path: str = "strategy.md") -> dict:
    """Parse strategy.md into sections."""
    text = Path(path).read_text()
    sections = {"system_prompt": "", "notes": "", "examples": ""}
    current = None

    for line in text.splitlines():
        stripped = line.strip().lower()
        if stripped == "## system prompt":
            current = "system_prompt"
            continue
        elif stripped == "## strategy notes":
            current = "notes"
            continue
        elif stripped == "## few-shot examples":
            current = "examples"
            continue

        if current:
            sections[current] += line + "\n"

    # Strip trailing whitespace from each section
    return {k: v.strip() for k, v in sections.items()}


def generate_content(strategy: dict, user_request: str) -> str:
    """Call Claude API with the strategy's system prompt + user request."""
    client = anthropic.Anthropic()  # uses ANTHROPIC_API_KEY env var

    system_prompt = strategy["system_prompt"]
    if strategy["examples"]:
        system_prompt += "\n\nReference examples:\n" + strategy["examples"]

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_request}],
        temperature=0.8,
    )

    return message.content[0].text
