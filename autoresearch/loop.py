"""Autoresearch loop: optimize → generate → rate → log → git commit → repeat."""

import csv
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import anthropic

from engine import load_strategy, generate_content
from evaluate import collect_rating

HISTORY_FILE = "history.tsv"
STRATEGY_FILE = "strategy.md"
PROGRAM_FILE = "program.md"


def read_history() -> str:
    """Read history.tsv contents, or empty string if none."""
    p = Path(HISTORY_FILE)
    return p.read_text() if p.exists() else ""


def get_iteration_number() -> int:
    """Get the next iteration number from history."""
    p = Path(HISTORY_FILE)
    if not p.exists():
        return 1
    lines = [l for l in p.read_text().strip().splitlines() if l and not l.startswith("iteration")]
    return len(lines) + 1


def append_history(iteration: int, rating: int, comment: str, summary: str):
    """Append a row to history.tsv."""
    exists = Path(HISTORY_FILE).exists()
    with open(HISTORY_FILE, "a", newline="") as f:
        writer = csv.writer(f, delimiter="\t")
        if not exists:
            writer.writerow(["iteration", "timestamp", "rating", "comment", "strategy_summary"])
        writer.writerow([
            iteration,
            datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S"),
            rating,
            comment,
            summary,
        ])


def git_commit(message: str):
    """Stage and commit strategy.md + history.tsv."""
    subprocess.run(["git", "add", STRATEGY_FILE, HISTORY_FILE], check=True)
    subprocess.run(["git", "commit", "-m", message], check=True)


def optimize_strategy(user_request: str):
    """Call Claude to analyze history and improve strategy.md."""
    program = Path(PROGRAM_FILE).read_text()
    history = read_history()
    strategy = Path(STRATEGY_FILE).read_text()

    iteration = get_iteration_number()
    if iteration == 1:
        print("  First iteration — using seed strategy as-is.")
        return

    client = anthropic.Anthropic()

    prompt = f"""Here is the current state of the content optimization experiment.

## Program Instructions
{program}

## Current strategy.md
{strategy}

## Experiment History
{history if history else "(No history yet)"}

## Current Task
The user's content request is: "{user_request}"

Based on the history of ratings and comments, modify strategy.md to improve the next
generation's rating. Output ONLY the new contents of strategy.md — nothing else.
Keep the three-section format (## System Prompt, ## Strategy Notes, ## Few-Shot Examples)."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    new_strategy = message.content[0].text.strip()
    Path(STRATEGY_FILE).write_text(new_strategy + "\n")
    print("  Strategy updated by optimizer agent.")


def get_strategy_summary() -> str:
    """One-line summary of the current strategy for logging."""
    strategy = load_strategy()
    prompt = strategy["system_prompt"]
    # Take the first meaningful line as summary
    for line in prompt.splitlines():
        line = line.strip()
        if line and len(line) > 10:
            return line[:80]
    return "no summary"


def run_loop(user_request: str):
    """Main loop: optimize → generate → rate → log → commit."""
    print(f"\n{'='*60}")
    print(f"  AUTORESEARCH — Content Optimization Loop")
    print(f"  Request: {user_request}")
    print(f"{'='*60}\n")

    while True:
        iteration = get_iteration_number()
        print(f"--- Iteration {iteration} ---\n")

        # Step 1: Optimize strategy (skip on first iteration)
        print("  [1/4] Optimizing strategy...")
        optimize_strategy(user_request)

        # Step 2: Generate content
        print("  [2/4] Generating content...")
        strategy = load_strategy()
        content = generate_content(strategy, user_request)
        print(f"\n  Generated content:\n  {'-'*40}")
        for line in content.splitlines():
            print(f"  {line}")
        print(f"  {'-'*40}\n")

        # Step 3: Collect rating via web UI
        print("  [3/4] Opening rating page...")
        result = collect_rating(content)
        rating = result["rating"]
        comment = result["comment"]
        print(f"  Rating: {'★' * rating}{'☆' * (5 - rating)} ({rating}/5)")
        if comment:
            print(f"  Comment: {comment}")

        # Step 4: Log and commit
        print("\n  [4/4] Logging and committing...")
        summary = get_strategy_summary()
        append_history(iteration, rating, comment, summary)
        git_commit(f"iter {iteration}: rating={rating} - {summary}")
        print(f"  Committed iteration {iteration}.\n")

        # Continue?
        try:
            answer = input("  Continue to next iteration? [Y/n] ").strip().lower()
        except (KeyboardInterrupt, EOFError):
            answer = "n"

        if answer in ("n", "no", "q", "quit"):
            print("\n  Done. Run `git log --oneline` to see experiment history.\n")
            break
        print()


def main():
    if len(sys.argv) < 2:
        print("Usage: python loop.py \"<content request>\"")
        print("Example: python loop.py \"write a tagline for a coffee shop\"")
        sys.exit(1)

    user_request = " ".join(sys.argv[1:])
    run_loop(user_request)


if __name__ == "__main__":
    main()
