# Autoresearch: Content Optimization with Human Feedback

Inspired by [Karpathy's autoresearch](https://github.com/karpathy/autoresearch). Instead of optimizing ML training code, the AI agent optimizes a **prompt strategy** based on **your ratings (1-5)** via a local web UI.

```
Agent edits strategy.md → Claude generates content → You rate it (1-5) → Agent learns → Repeat
```

## Quick Start

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your-key-here
python loop.py "write a tagline for a coffee shop"
```

A browser tab opens at `http://localhost:5050` — click stars to rate, add a comment, hit submit. The agent learns from your feedback and optimizes the strategy for the next iteration.

## How It Works

| File | Role | Who edits it |
|---|---|---|
| `strategy.md` | Prompt template + strategy notes | AI agent (every iteration) |
| `program.md` | Instructions for the optimizer agent | You (set once) |
| `engine.py` | Parses strategy, calls Claude API | Nobody (fixed) |
| `evaluate.py` | Web UI for collecting ratings | Nobody (fixed) |
| `loop.py` | Main orchestrator | Nobody (fixed) |
| `history.tsv` | Experiment log | Auto-generated |

Each iteration is a git commit: `git log --oneline` reads like an experiment notebook.

## Requirements

- Python 3.10+
- Anthropic API key
- A browser (for the rating UI)
