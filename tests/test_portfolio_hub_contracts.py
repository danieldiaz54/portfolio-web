"""Contratos V4 del hub: arquitectura de información en 3 capas, cero duplicación, seguridad DOM y anti-slop."""

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

OBSOLETE_COMPONENTS = ("LivePulseRail", "InteractiveStage", "ProjectCard", "ExhibitionHub", "CaseStudy")
NOISE_LABELS = ("Shader Hero", "Re-ping vivo", "I — Laboratorio", "II — Exposición", "III — Matriz")
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

    def test_v4_typescript_sources_zero_any_and_no_obsolete_imports(self) -> None:
        any_pattern = re.compile(r"(:\s*any\b|\bas\s+any\b|<any>)")
        ts_files = list((REPO_ROOT / "src").rglob("*.ts")) + list((REPO_ROOT / "src").rglob("*.tsx"))
        self.assertGreaterEqual(len(ts_files), 12)
        for path in ts_files:
            content = path.read_text(encoding="utf-8")
            self.assertIsNone(any_pattern.search(content), f"'any' prohibido en {path.name}")
            self.assertNotIn("JSX.Element", content, f"Usar ReactNode en {path.name}")
            for deleted in OBSOLETE_COMPONENTS:
                self.assertNotIn(deleted, content, f"Referencia huérfana a {deleted} en {path.name}")
                self.assertFalse((REPO_ROOT / "src" / "components" / f"{deleted}.tsx").exists())
        for comp in ("HeroShader.tsx", "ProjectIndex.tsx", "ProjectStudio.tsx", "MicroLabs.tsx", "SignalDiagram.tsx", "CommandPalette.tsx", "PortfolioApp.tsx"):
            self.assertTrue((REPO_ROOT / "src" / "components" / comp).is_file(), f"Falta {comp}")

    def test_vendored_taste_skill_effects_are_present_and_safe(self) -> None:
        effects = (
            "public/assets/effects/fx.js",
            "public/assets/effects/grid-pulse/effect.js",
            "public/assets/effects/contour-lines/effect.js",
        )
        for rel in effects:
            content = read(rel)
            for forbidden in BANNED_DOM:
                self.assertNotIn(forbidden, content, f"{forbidden} encontrado en {rel}")

    def test_catalog_lists_six_v4_products_with_diagrams_and_health_urls(self) -> None:
        projects = sync_static_hub.extract_projects()
        self.assertEqual([p["slug"] for p in projects], list(EXPECTED_PROJECTS))
        for project in projects:
            slug = str(project["slug"])
            live, font, accent = EXPECTED_PROJECTS[slug]
            self.assertEqual(project["liveUrl"], live)
            if slug == "pdfcraft-studio":
                self.assertIsNone(project["healthUrl"])
            else:
                self.assertEqual(project["healthUrl"], f"{live}/api/v1/health")
            self.assertTrue(str(project["labPrompt"]).strip())

            diagram = project["diagram"]
            assert isinstance(diagram, dict)
            self.assertEqual(len(diagram["nodes"]), 4)
            modes = {e["mode"] for e in diagram["edges"]}
            self.assertEqual(modes, {"normal", "fault"}, f"{slug} requiere rutas normal y fault")

            plate = project["plate"]
            assert isinstance(plate, dict)
            self.assertEqual(plate["displayFont"], font)
            self.assertEqual(plate["accent"], accent)
            for field in ("problem", "outcome", "retrospective", "nextEvolution", "everydayName"):
                self.assertTrue(str(project[field]).strip(), f"{slug} sin {field}")

    def test_each_product_has_a_distinct_visual_identity(self) -> None:
        projects = sync_static_hub.extract_projects()
        plates = [p["plate"] for p in projects]
        for key in ("bg", "accent", "displayFont"):
            values = [plate[key] for plate in plates]  # type: ignore[index]
            self.assertEqual(len(values), len(set(values)), f"'{key}' repetido entre productos")
        paradigms = [p["matrix"]["paradigm"] for p in projects]  # type: ignore[index]
        self.assertEqual(len(paradigms), len(set(paradigms)))

    def test_static_pages_enforce_v4_information_architecture(self) -> None:
        expected = sync_static_hub.build()
        for page in ("public/index.html", "public/preview.html"):
            self.assertEqual(read(page), expected, f"{page} desactualizado: ejecutar scripts/sync_static_hub.py")
        for slug, (live, _font, _accent) in EXPECTED_PROJECTS.items():
            self.assertIn(slug, expected)
            self.assertIn(live, expected)
        for token in ("Software claro para usar, sólido por dentro.", "Pruébalo", "Cómo funciona", "Ingeniería y código", "Conversemos"):
            self.assertIn(token, expected)
        for noise in NOISE_LABELS:
            self.assertNotIn(noise, expected, f"Ruido V3 residual encontrado: {noise}")

    def test_static_pages_use_safe_dom_only(self) -> None:
        for page in ("public/index.html", "public/preview.html", "scripts/static_hub.template.html"):
            content = read(page)
            for forbidden in BANNED_DOM:
                self.assertNotIn(forbidden, content, f"{forbidden} en {page}")
            self.assertIn("createElement", content)
            self.assertIn("createElementNS", content)
            self.assertIn("textContent", content)

    def test_hub_typography_and_palette_are_anti_slop(self) -> None:
        css = read("src/app/globals.css")
        layout = read("src/app/layout.tsx")
        self.assertIn("#f7f7f5", css)
        self.assertIn("#0044cc", css)
        self.assertIn("::selection", css)
        self.assertIn("Archivo", layout)
        self.assertIn("Hanken_Grotesk", layout)
        self.assertNotIn("#F7F6F3".lower(), css.lower())
        self.assertNotIn("#8b5cf6", css.lower())
        for font in BANNED_FONTS:
            self.assertIsNone(re.search(rf"\b{font}\b", css + layout), f"Fuente prohibida {font}")

    def test_v4_specs_docs_dockerfile_and_adrs(self) -> None:
        self.assertIn("Tesis en 10 segundos", read("PRODUCT.md"))
        self.assertIn("Monografía de Galería", read("DESIGN.md"))
        self.assertIn("Divulgación Progresiva", read(".specs/04-phase6-v4-ux-ia/v4-ux-information-architecture.spec.md"))
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
