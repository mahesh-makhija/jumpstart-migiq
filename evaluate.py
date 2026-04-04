"""Human feedback collection via CLI or local web UI."""

import os
import threading
import webbrowser
from flask import Flask, request, Response

USE_WEB = os.environ.get("AUTORESEARCH_WEB", "").lower() in ("1", "true", "yes")


def collect_rating_cli(content: str) -> dict:
    """Collect rating via terminal input."""
    print("\n  ┌─────────────────────────────────────────┐")
    print("  │         GENERATED CONTENT                │")
    print("  └─────────────────────────────────────────┘\n")
    for line in content.splitlines():
        print(f"    {line}")
    print()

    while True:
        try:
            raw = input("  Rate this content (1-5): ").strip()
            rating = int(raw)
            if 1 <= rating <= 5:
                break
            print("  Please enter a number between 1 and 5.")
        except ValueError:
            print("  Please enter a number between 1 and 5.")

    comment = input("  Comment (optional, press Enter to skip): ").strip()
    return {"rating": rating, "comment": comment}


def collect_rating_web(content: str, port: int = 5050) -> dict:
    """Open a browser with the content and star rating UI. Block until rated."""
    result = {}
    ready = threading.Event()

    app = Flask(__name__)
    app.logger.disabled = True

    import logging
    log = logging.getLogger("werkzeug")
    log.setLevel(logging.ERROR)

    escaped = content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    @app.route("/")
    def index():
        return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rate This Content</title>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: -apple-system, system-ui, sans-serif; background:#f5f5f5; padding:2rem; }}
  .card {{ max-width:700px; margin:0 auto; background:#fff; border-radius:12px;
           padding:2rem; box-shadow:0 2px 8px rgba(0,0,0,0.1); }}
  h1 {{ font-size:1.2rem; color:#666; margin-bottom:1rem; }}
  .content {{ background:#fafafa; border:1px solid #eee; border-radius:8px;
              padding:1.5rem; margin-bottom:1.5rem; white-space:pre-wrap;
              line-height:1.6; font-size:1rem; }}
  .stars {{ display:flex; gap:0.5rem; margin-bottom:1rem; justify-content:center; }}
  .star {{ font-size:2.5rem; cursor:pointer; color:#ddd; transition:color 0.15s; }}
  .star:hover, .star.active {{ color:#f5a623; }}
  .star-group:hover .star {{ color:#f5a623; }}
  .star-group:hover .star:hover ~ .star {{ color:#ddd; }}
  textarea {{ width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:8px;
              font-size:0.95rem; resize:vertical; min-height:60px; margin-bottom:1rem; }}
  button {{ width:100%; padding:0.75rem; background:#333; color:#fff; border:none;
            border-radius:8px; font-size:1rem; cursor:pointer; }}
  button:hover {{ background:#555; }}
  button:disabled {{ background:#ccc; cursor:not-allowed; }}
  .label {{ font-size:0.85rem; color:#888; margin-bottom:0.4rem; }}
</style></head>
<body>
<div class="card">
  <h1>Generated Content — Iteration Rating</h1>
  <div class="content">{escaped}</div>
  <div class="label">Your rating</div>
  <div class="stars star-group">
    <span class="star" data-v="1">&#9733;</span>
    <span class="star" data-v="2">&#9733;</span>
    <span class="star" data-v="3">&#9733;</span>
    <span class="star" data-v="4">&#9733;</span>
    <span class="star" data-v="5">&#9733;</span>
  </div>
  <div class="label">Comment (optional)</div>
  <textarea id="comment" placeholder="What worked or didn't?"></textarea>
  <button id="btn" disabled onclick="submit()">Select a rating</button>
</div>
<script>
let rating = 0;
document.querySelectorAll('.star').forEach(s => {{
  s.addEventListener('click', () => {{
    rating = parseInt(s.dataset.v);
    document.querySelectorAll('.star').forEach((x,i) => {{
      x.classList.toggle('active', i < rating);
    }});
    document.getElementById('btn').disabled = false;
    document.getElementById('btn').textContent = 'Submit (' + rating + '/5)';
  }});
}});
function submit() {{
  fetch('/rate', {{
    method:'POST',
    headers:{{'Content-Type':'application/json'}},
    body:JSON.stringify({{rating: rating, comment: document.getElementById('comment').value}})
  }}).then(() => {{
    document.querySelector('.card').innerHTML = '<h1 style="text-align:center;padding:3rem">Rating submitted. You can close this tab.</h1>';
  }});
}}
</script></body></html>"""

    @app.route("/rate", methods=["POST"])
    def rate():
        data = request.get_json()
        result["rating"] = int(data["rating"])
        result["comment"] = data.get("comment", "")
        ready.set()
        return Response("ok", status=200)

    server = threading.Thread(
        target=lambda: app.run(host="0.0.0.0", port=port, use_reloader=False),
        daemon=True,
    )
    server.start()

    print(f"\n  Rating page open at http://localhost:{port}")
    print("  Waiting for your rating...\n")
    webbrowser.open(f"http://localhost:{port}")

    ready.wait()
    return result


def collect_rating(content: str, port: int = 5050) -> dict:
    """Collect rating via CLI (default) or web UI (set AUTORESEARCH_WEB=1)."""
    if USE_WEB:
        return collect_rating_web(content, port)
    return collect_rating_cli(content)
