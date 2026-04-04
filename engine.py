"""Content generation engine. Parses strategy.md and calls Claude API."""

import os
import random
from pathlib import Path

DEMO_MODE = not os.environ.get("ANTHROPIC_API_KEY")


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


DEMO_RESPONSES = [
    "Wake up and smell the extraordinary. Life's too short for ordinary coffee.",
    "Where every cup tells a story — and every sip writes the next chapter.",
    "Brewed with passion. Served with soul. Your daily escape starts here.",
    "Not just coffee. A moment of calm in a world that won't stop spinning.",
    "Good mornings start here. Great mornings never leave.",
]


def generate_content(strategy: dict, user_request: str) -> str:
    """Call Claude API with the strategy's system prompt + user request."""
    if DEMO_MODE:
        return random.choice(DEMO_RESPONSES)

    import anthropic

    client = anthropic.Anthropic()

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
