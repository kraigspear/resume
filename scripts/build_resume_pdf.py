#!/usr/bin/env python3
"""Render resume.md to assets/resume.pdf with headless Chrome.

resume.md is the source of truth. Site-only lines (front matter, the download
button, the inline-styled subtitle) are dropped or translated so the PDF reads
as a standalone document.
"""
import html
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "resume.md"
OUTPUT = ROOT / "assets" / "resume.pdf"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

NAME = "Kraig Spear"
CONTACT = "kraigspear@gmail.com · github.com/kraigspear"

CSS = """
@page { size: Letter; margin: 0.6in 0.7in; }
body { font: 10.5pt/1.35 Helvetica, Arial, sans-serif; color: #222; }
h1 { font-size: 22pt; margin: 0; letter-spacing: 0.5px; }
.contact { color: #555; margin: 2pt 0 4pt; }
.headline { font-size: 13pt; font-weight: bold; margin: 8pt 0 0; letter-spacing: 0.5px; }
.subtitle { font-weight: bold; color: #555; margin: 0 0 10pt; }
h2 { font-size: 11.5pt; border-bottom: 1px solid #999; padding-bottom: 2pt;
     margin: 14pt 0 6pt; letter-spacing: 0.5px; }
h3 { font-size: 10.5pt; margin: 9pt 0 0; }
p { margin: 2pt 0 4pt; }
ul { margin: 2pt 0 4pt; padding-left: 16pt; }
li { margin: 0 0 2pt; }
a { color: #1a4d8f; text-decoration: none; }
h3, h3 + p { page-break-after: avoid; }
li, p { page-break-inside: avoid; }
"""


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return text


def body_lines(markdown: str) -> list[str]:
    lines = markdown.split("\n")
    if lines[0] == "---":
        lines = lines[lines.index("---", 1) + 1 :]
    return lines


def render(markdown: str) -> str:
    out = [f"<h1>{NAME}</h1>", f'<p class="contact">{CONTACT}</p>']
    in_list = False
    for raw in body_lines(markdown):
        line = raw.rstrip()
        if in_list and not line.startswith("- "):
            out.append("</ul>")
            in_list = False
        if not line or "Download Resume" in line:
            continue
        if line.startswith("# "):
            out.append(f'<p class="headline">{inline(line[2:])}</p>')
        elif line.startswith("<p "):
            out.append(f'<p class="subtitle">{re.sub(r"<[^>]+>", "", line)}</p>')
        elif line.startswith("## "):
            out.append(f"<h2>{inline(line[3:])}</h2>")
        elif line.startswith("### "):
            out.append(f"<h3>{inline(line[4:])}</h3>")
        elif line.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{inline(line[2:])}</li>")
        else:
            out.append(f"<p>{inline(line)}</p>")
    if in_list:
        out.append("</ul>")
    return (
        f"<!doctype html><html><head><meta charset='utf-8'><title>{NAME} Resume</title>"
        f"<style>{CSS}</style></head><body>{''.join(out)}</body></html>"
    )


def main() -> None:
    page = render(SOURCE.read_text())
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as tmp:
        tmp.write(page)
    subprocess.run(
        [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={OUTPUT}", f"file://{tmp.name}"],
        check=True, capture_output=True,
    )
    print(f"wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)", file=sys.stderr)


if __name__ == "__main__":
    main()
