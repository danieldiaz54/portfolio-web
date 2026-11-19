"""Sincroniza el hub estático de GitHub Pages (public/index.html y public/preview.html).

Fuente única de verdad:
  - Estilos: src/app/globals.css (sin directivas de Tailwind).
  - Datos:   src/data/projects.ts (arreglo PROJECTS convertido a JSON).

Uso: python scripts/sync_static_hub.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "static_hub.template.html"
CSS_SOURCE = ROOT / "src" / "app" / "globals.css"
DATA_SOURCE = ROOT / "src" / "data" / "projects.ts"
OUTPUTS = (ROOT / "public" / "index.html", ROOT / "public" / "preview.html")


def extract_css() -> str:
    css = CSS_SOURCE.read_text(encoding="utf-8")
    return "\n".join(line for line in css.splitlines() if not line.startswith("@tailwind")).strip()


def _ts_object_array_to_json(literal: str) -> str:
    """Convierte un arreglo literal de objetos TypeScript a JSON estricto sin tocar strings."""
    out: list[str] = []
    i = 0
    n = len(literal)
    in_string = False

    while i < n:
        ch = literal[i]
        if in_string:
            out.append(ch)
            if ch == "\\" and i + 1 < n:
                out.append(literal[i + 1])
                i += 2
                continue
            if ch == '"':
                in_string = False
            i += 1
            continue

        if ch == '"':
            in_string = True
            out.append(ch)
            i += 1
            continue

        # Ignorar comas finales antes de } o ]
        if ch == ",":
            j = i + 1
            while j < n and literal[j] in " \t\r\n":
                j += 1
            if j < n and literal[j] in "}]":
                i += 1
                continue
            out.append(ch)
            i += 1
            continue

        # Detectar clave sin comillas después de {, [ o ,
        if ch.isalpha() or ch == "_":
            k = len(out) - 1
            while k >= 0 and out[k] in " \t\r\n":
                k -= 1
            if k >= 0 and out[k] in "{,":
                end_key = i
                while end_key < n and (literal[end_key].isalnum() or literal[end_key] == "_"):
                    end_key += 1
                after = end_key
                while after < n and literal[after] in " \t\r\n":
                    after += 1
                if after < n and literal[after] == ":":
                    key = literal[i:end_key]
                    out.append(f'"{key}":')
                    i = after + 1
                    continue

        out.append(ch)
        i += 1

    return "".join(out)


def extract_projects() -> list[dict[str, object]]:
    source = DATA_SOURCE.read_text(encoding="utf-8")
    start_marker = "export const PROJECTS: readonly Project[] = "
    start = source.index(start_marker) + len(start_marker)
    end = source.index("\n];", start) + 2
    literal = source[start:end]
    normalized = _ts_object_array_to_json(literal)
    projects = json.loads(normalized)
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
