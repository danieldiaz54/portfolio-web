"""Sincroniza el hub estático de GitHub Pages (public/index.html y public/preview.html).

Fuente única de verdad:
  - Estilos: src/app/globals.css (sin directivas de Tailwind).
  - Datos:   src/data/projects.ts (arreglo PROJECTS convertido a JSON).

Uso: python scripts/sync_static_hub.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "static_hub.template.html"
CSS_SOURCE = ROOT / "src" / "app" / "globals.css"
DATA_SOURCE = ROOT / "src" / "data" / "projects.ts"
OUTPUTS = (ROOT / "public" / "index.html", ROOT / "public" / "preview.html")


def extract_css() -> str:
    css = CSS_SOURCE.read_text(encoding="utf-8")
    return "\n".join(line for line in css.splitlines() if not line.startswith("@tailwind")).strip()


def extract_projects() -> list[dict[str, object]]:
    source = DATA_SOURCE.read_text(encoding="utf-8")
    start_marker = "export const PROJECTS: readonly Project[] = "
    start = source.index(start_marker) + len(start_marker)
    end = source.index("\n];", start) + 2
    literal = source[start:end]
    literal = re.sub(r"(^|\n)(\s*)([A-Za-z_][A-Za-z0-9_]*):", r'\1\2"\3":', literal)
    literal = re.sub(r",(\s*[\]}])", r"\1", literal)
    projects = json.loads(literal)
    if not isinstance(projects, list):
        raise ValueError("PROJECTS debe ser un arreglo")
    return projects


def build() -> str:
    template = TEMPLATE.read_text(encoding="utf-8")
    payload = json.dumps(extract_projects(), ensure_ascii=False, indent=2).replace("</", "<\\/")
    html = template.replace("/*@@CSS@@*/", extract_css()).replace("/*@@PROJECTS@@*/", payload)
    if "@@" in html:
        raise ValueError("Quedaron marcadores sin reemplazar en la plantilla")
    return html


def main() -> None:
    html = build()
    for output in OUTPUTS:
        output.write_text(html, encoding="utf-8", newline="\n")
        print(f"escrito {output.relative_to(ROOT)} ({len(html)} bytes)")


if __name__ == "__main__":
    main()
