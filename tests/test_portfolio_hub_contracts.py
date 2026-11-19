"""Contratos del hub expositivo: catálogo V2, sincronía estática, seguridad del DOM y anti-slop."""

from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM_ROOT = REPO_ROOT.parent
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import sync_static_hub  # noqa: E402

EXPECTED_PROJECTS = {
    "pdfcraft-studio": ("https://danieldiaz54.github.io/pdfcraft-studio/", "Bricolage Grotesque", "#1D4ED8"),
    "merkat-catalog": ("https://merkat-catalog-production.up.railway.app", "Bodoni Moda", "#A16207"),
    "pulseflow-collab": ("https://pulseflow-collab-production.up.railway.app", "Sora", "#10B981"),
    "cortex-rag-agent": ("https://cortex-rag-agent-production.up.railway.app", "Source Serif 4", "#B45309"),
    "ledgercore-distributed": ("https://ledgercore-distributed-production.up.railway.app", "Albert Sans", "#047857"),
    "fieldnotes-mobile": ("https://fieldnotes-mobile-production.up.railway.app", "Bitter", "#9A3412"),
}

BANNED_FONTS = ("Inter", "Roboto", "Open Sans")
BANNED_DOM = ("innerHTML", "outerHTML", "insertAdjacentHTML", "eval(", "document.write")


def read(relative: str) -> str:
    return (REPO_ROOT / relative).read_text(encoding="utf-8")


class TestPortfolioHubContracts(unittest.TestCase):
    def test_package_and_tsconfig_strict_mode(self) -> None:
        pkg = json.loads(read("package.json"))
        tsc = json.loads(read("tsconfig.json"))
        self.assertEqual(pkg["name"], "portfolio-web")
        for script in ("build", "typecheck", "lint"):
            self.assertIn(script, pkg["scripts"])
        self.assertTrue(tsc["compilerOptions"]["strict"])

    def test_typescript_sources_contain_zero_any(self) -> None:
        any_pattern = re.compile(r"(:\s*any\b|\bas\s+any\b|<any>)")
        ts_files = list((REPO_ROOT / "src").rglob("*.ts")) + list((REPO_ROOT / "src").rglob("*.tsx"))
        self.assertGreaterEqual(len(ts_files), 9)
        for path in ts_files:
            content = path.read_text(encoding="utf-8")
            self.assertIsNone(any_pattern.search(content), f"'any' prohibido en {path.name}")
            self.assertNotIn("JSX.Element", content, f"Usar ReactNode en {path.name}")

    def test_catalog_lists_exactly_the_six_v2_products(self) -> None:
        projects = sync_static_hub.extract_projects()
        self.assertEqual([p["slug"] for p in projects], list(EXPECTED_PROJECTS))
        for project in projects:
            live, font, accent = EXPECTED_PROJECTS[str(project["slug"])]
            self.assertEqual(project["liveUrl"], live)
            plate = project["plate"]
            assert isinstance(plate, dict)
            self.assertEqual(plate["displayFont"], font)
            self.assertEqual(plate["accent"], accent)
            for field in ("problem", "outcome", "retrospective", "nextEvolution", "everydayName"):
                self.assertTrue(str(project[field]).strip(), f"{project['slug']} sin {field}")
            trade_offs = project["tradeOffs"]
            assert isinstance(trade_offs, list)
            self.assertGreaterEqual(len(trade_offs), 1)
            for trade in trade_offs:
                for key in ("chosen", "rejected", "because", "failureMode"):
                    self.assertTrue(trade[key].strip())

    def test_each_product_has_a_distinct_visual_identity(self) -> None:
        projects = sync_static_hub.extract_projects()
        plates = [p["plate"] for p in projects]
        for key in ("bg", "accent", "displayFont"):
            values = [plate[key] for plate in plates]  # type: ignore[index]
            self.assertEqual(len(values), len(set(values)), f"'{key}' repetido entre productos")
        paradigms = [p["matrix"]["paradigm"] for p in projects]  # type: ignore[index]
        self.assertEqual(len(paradigms), len(set(paradigms)))

    def test_static_pages_are_in_sync_with_sources(self) -> None:
        expected = sync_static_hub.build()
        for page in ("public/index.html", "public/preview.html"):
            self.assertEqual(read(page), expected, f"{page} desactualizado: ejecutar scripts/sync_static_hub.py")
            for slug, (live, _font, _accent) in EXPECTED_PROJECTS.items():
                self.assertIn(slug, expected)
                self.assertIn(live, expected)

    def test_static_pages_use_safe_dom_only(self) -> None:
        for page in ("public/index.html", "public/preview.html", "scripts/static_hub.template.html"):
            content = read(page)
            for forbidden in BANNED_DOM:
                self.assertNotIn(forbidden, content, f"{forbidden} en {page}")
            self.assertIn("createElement", content)
            self.assertIn("textContent", content)

    def test_hub_typography_and_palette_are_anti_slop(self) -> None:
        css = read("src/app/globals.css")
        layout = read("src/app/layout.tsx")
        self.assertIn("#f7f7f5", css)
        self.assertIn("#0044cc", css)
        self.assertIn("Archivo", layout)
        self.assertIn("Hanken_Grotesk", layout)
        self.assertNotIn("#F7F6F3".lower(), css.lower())
        self.assertNotIn("#8b5cf6", css.lower())
        for font in BANNED_FONTS:
            self.assertIsNone(re.search(rf"\b{font}\b", css + layout), f"Fuente prohibida {font}")

    def test_product_design_docs_dockerfile_and_adrs(self) -> None:
        self.assertIn("Tesis en 10 segundos", read("PRODUCT.md"))
        self.assertIn("Monografía de Galería", read("DESIGN.md"))
        self.assertIn("USER nextjs", read("Dockerfile"))
        for adr in ("001-nextjs-app-router-and-static-case-studies.md", "002-multi-architecture-portfolio-taxonomy.md"):
            self.assertTrue((REPO_ROOT / "docs" / "adr" / adr).is_file())

    def test_sibling_repositories_expose_product_and_design_docs(self) -> None:
        for slug in EXPECTED_PROJECTS:
            sibling = ECOSYSTEM_ROOT / slug
            if sibling.is_dir():
                self.assertTrue((sibling / "PRODUCT.md").is_file(), f"{slug} sin PRODUCT.md")
                self.assertTrue((sibling / "DESIGN.md").is_file(), f"{slug} sin DESIGN.md")


if __name__ == "__main__":
    unittest.main()
