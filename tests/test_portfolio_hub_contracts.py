"""Contratos V7 Obsidian Fixed-Backdrop Zero-Card Cinema: shaders dark-room, 0 tarjetas en portada y 3 capas intactas."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM_ROOT = REPO_ROOT.parent

EXPECTED_PROJECTS = {
    "pdfcraft-studio": ("https://danieldiaz54.github.io/pdfcraft-studio/", "Bricolage Grotesque", "#1D4ED8"),
    "merkat-catalog": ("https://merkat-catalog-production.up.railway.app", "Bodoni Moda", "#A16207"),
    "pulseflow-collab": ("https://pulseflow-collab-production.up.railway.app", "Sora", "#10B981"),
    "cortex-rag-agent": ("https://cortex-rag-agent-production.up.railway.app", "Source Serif 4", "#B45309"),
    "ledgercore-distributed": ("https://ledgercore-distributed-production.up.railway.app", "Albert Sans", "#047857"),
    "fieldnotes-mobile": ("https://fieldnotes-mobile-production.up.railway.app", "Bitter", "#9A3412"),
}

OBSOLETE_COMPONENTS = (
    "LivePulseRail",
    "InteractiveStage",
    "ProjectCard",
    "ExhibitionHub",
    "CaseStudy",
    "ProjectIndex",
    "CriteriaStack",
    "ContactPortal",
)
OBSOLETE_STATIC_FILES = (
    "public/index.html",
    "public/preview.html",
    "scripts/static_hub.template.html",
    "scripts/sync_static_hub.py",
)
NOISE_LABELS = ("Shader Hero", "Re-ping vivo", "I — Laboratorio", "II — Exposición", "III — Matriz")
BANNED_FONTS = ("Inter", "Roboto", "Open Sans")
BANNED_DOM = ("innerHTML", "outerHTML", "insertAdjacentHTML", "eval(", "document.write")

REQUIRED_COMPONENTS = (
    "SmoothScrollProvider.tsx",
    "ScrollProgressBar.tsx",
    "MagneticButton.tsx",
    "KineticManifesto.tsx",
    "FixedBackdrop.tsx",
    "CinemaStage.tsx",
    "EditorialMethod.tsx",
    "CinemaFinale.tsx",
    "HeroShader.tsx",
    "Navbar.tsx",
    "ProjectStudio.tsx",
    "MicroLabs.tsx",
    "SignalDiagram.tsx",
    "CommandPalette.tsx",
    "PortfolioApp.tsx",
    "PreviewPlate.tsx",
)


def read(relative: str) -> str:
    return (REPO_ROOT / relative).read_text(encoding="utf-8")


def parse_project_blocks() -> dict[str, str]:
    src = read("src/data/projects.ts")
    parts = re.split(r'\n  \{\r?\n    slug:\s*"([^"]+)"', src)
    blocks: dict[str, str] = {}
    for idx in range(1, len(parts), 2):
        blocks[parts[idx]] = parts[idx + 1]
    return blocks


class TestPortfolioHubContracts(unittest.TestCase):
    def test_package_dependencies_and_strict_typescript(self) -> None:
        pkg = json.loads(read("package.json"))
        tsc = json.loads(read("tsconfig.json"))
        self.assertEqual(pkg["name"], "portfolio-web")
        for script in ("build", "typecheck", "lint"):
            self.assertIn(script, pkg["scripts"])
        for dep in ("gsap", "lenis", "motion", "lucide-react", "next", "react", "react-dom"):
            self.assertIn(dep, pkg["dependencies"], f"Falta dependencia {dep}")
        self.assertTrue(tsc["compilerOptions"]["strict"])

    def test_pages_static_export_configuration_and_no_legacy_html(self) -> None:
        next_cfg = read("next.config.mjs")
        pages_yml = read(".github/workflows/pages.yml")
        ci_yml = read(".github/workflows/ci.yml")

        self.assertIn("STATIC_EXPORT", next_cfg)
        self.assertIn('"export"', next_cfg)
        self.assertIn("trailingSlash: true", next_cfg)
        self.assertIn('STATIC_EXPORT: "1"', pages_yml)
        self.assertIn('NEXT_PUBLIC_BASE_PATH: "/portfolio-web"', pages_yml)
        self.assertIn('path: "./out"', pages_yml)
        self.assertIn('STATIC_EXPORT: "1"', ci_yml)
        self.assertTrue((REPO_ROOT / "public" / ".nojekyll").is_file(), "Falta public/.nojekyll")
        for obsolete in OBSOLETE_STATIC_FILES:
            self.assertFalse((REPO_ROOT / obsolete).exists(), f"Archivo estático obsoleto aún existe: {obsolete}")

    def test_v7_typescript_sources_zero_any_safe_dom_and_no_obsolete_card_components(self) -> None:
        any_pattern = re.compile(r"(:\s*any\b|\bas\s+any\b|<any>)")
        ts_files = list((REPO_ROOT / "src").rglob("*.ts")) + list((REPO_ROOT / "src").rglob("*.tsx"))
        self.assertGreaterEqual(len(ts_files), 18)
        for path in ts_files:
            content = path.read_text(encoding="utf-8")
            self.assertIsNone(any_pattern.search(content), f"'any' prohibido en {path.name}")
            self.assertNotIn("JSX.Element", content, f"Usar ReactNode en {path.name}")
            for forbidden_dom in BANNED_DOM:
                self.assertNotIn(forbidden_dom, content, f"{forbidden_dom} prohibido en {path.name}")
            for deleted in OBSOLETE_COMPONENTS:
                self.assertNotIn(deleted, content, f"Referencia huérfana a {deleted} en {path.name}")
                self.assertFalse((REPO_ROOT / "src" / "components" / f"{deleted}.tsx").exists())
            for noise in NOISE_LABELS:
                self.assertNotIn(noise, content, f"Ruido V3 residual encontrado en {path.name}: {noise}")
        for comp in REQUIRED_COMPONENTS:
            self.assertTrue((REPO_ROOT / "src" / "components" / comp).is_file(), f"Falta {comp}")

    def test_vendored_taste_skill_effects_are_present_and_safe(self) -> None:
        effects = (
            "public/assets/effects/fx.js",
            "public/assets/effects/prism-dispersion/effect.js",
            "public/assets/effects/spotlight-cone/effect.js",
            "public/assets/effects/god-rays/effect.js",
            "public/assets/effects/fluted-glass/effect.js",
            "public/assets/effects/grain-gradient/effect.js",
            "public/assets/effects/grid-pulse/effect.js",
            "public/assets/effects/contour-lines/effect.js",
        )
        for rel in effects:
            content = read(rel)
            for forbidden in BANNED_DOM:
                self.assertNotIn(forbidden, content, f"{forbidden} encontrado en {rel}")

    def test_catalog_lists_six_products_with_distinct_identities_and_health_urls(self) -> None:
        blocks = parse_project_blocks()
        self.assertEqual(list(blocks.keys()), list(EXPECTED_PROJECTS.keys()))

        bgs: list[str] = []
        accents: list[str] = []
        fonts: list[str] = []
        paradigms: list[str] = []

        for slug, block in blocks.items():
            live, font, accent = EXPECTED_PROJECTS[slug]
            self.assertIn(f'liveUrl: "{live}"', block)
            if slug == "pdfcraft-studio":
                self.assertIn("healthUrl: null", block)
            else:
                self.assertIn(f'healthUrl: "{live}/api/v1/health"', block)
            self.assertIn(f'displayFont: "{font}"', block)
            self.assertIn(f'accent: "{accent}"', block)
            self.assertIn('mode: "normal"', block)
            self.assertIn('mode: "fault"', block)

            bg_match = re.search(r'bg:\s*"([^"]+)"', block)
            paradigm_match = re.search(r'paradigm:\s*"([^"]+)"', block)
            self.assertIsNotNone(bg_match, f"Falta plate.bg en {slug}")
            self.assertIsNotNone(paradigm_match, f"Falta matrix.paradigm en {slug}")
            bgs.append(bg_match.group(1))  # type: ignore[union-attr]
            accents.append(accent)
            fonts.append(font)
            paradigms.append(paradigm_match.group(1))  # type: ignore[union-attr]

        for group_name, values in (("bg", bgs), ("accent", accents), ("displayFont", fonts), ("paradigm", paradigms)):
            self.assertEqual(len(values), len(set(values)), f"'{group_name}' repetido entre productos")

    def test_v7_fixed_backdrop_zero_card_contracts_and_three_layer_ia(self) -> None:
        app_src = read("src/components/PortfolioApp.tsx")
        studio_src = read("src/components/ProjectStudio.tsx")
        shader_src = read("src/components/HeroShader.tsx")
        stage_src = read("src/components/CinemaStage.tsx")
        backdrop_src = read("src/components/FixedBackdrop.tsx")
        provider_src = read("src/components/SmoothScrollProvider.tsx")
        cmdk_src = read("src/components/CommandPalette.tsx")

        for word in ("Software", "claro", "para", "usar,", "sólido", "por", "dentro."):
            self.assertIn(f'"{word}"', app_src)
        self.assertIn('heroEffect, setHeroEffect] = useState<HeroEffectId>("prism-dispersion")', app_src)
        self.assertIn("FixedBackdrop", app_src)
        self.assertIn("overflowY", app_src)
        self.assertIn("CinemaStage", app_src)
        self.assertIn("EditorialMethod", app_src)
        self.assertIn("CinemaFinale", app_src)
        self.assertNotIn("curtain-surface", app_src)
        self.assertIn("cinema-backdrop", backdrop_src)
        self.assertIn("pin: true", stage_src)
        self.assertIn("gsap.matchMedia", stage_src)
        self.assertIn("filmstrip", stage_src)
        self.assertNotIn('mode="wait"', stage_src)
        self.assertIn("useSmoothScroll", provider_src)
        self.assertIn("stop:", provider_src)
        self.assertIn("start:", provider_src)
        self.assertIn("keywords", cmdk_src)
        self.assertIn("NEXT_PUBLIC_BASE_PATH", shader_src)
        for fx_id in ("prism-dispersion", "spotlight-cone", "god-rays"):
            self.assertIn(fx_id, shader_src)
        for tab_label in ("Pruébalo", "Cómo funciona", "Ingeniería y código"):
            self.assertIn(tab_label, studio_src)

    def test_obsidian_cinema_palette_fixed_backdrop_and_typography(self) -> None:
        css = read("src/app/globals.css")
        layout = read("src/app/layout.tsx")
        self.assertIn("#06080d", css)
        self.assertIn("position: fixed", css)
        self.assertIn("overflow-x: clip", css)
        self.assertIn("skip-link:focus-visible", css)
        self.assertIn("#3b82f6", css)
        self.assertIn("::selection", css)
        self.assertIn("SmoothScrollProvider", layout)
        self.assertIn("Archivo", layout)
        self.assertIn("Hanken_Grotesk", layout)
        self.assertNotIn("#8b5cf6", css.lower())
        for font in BANNED_FONTS:
            self.assertIsNone(re.search(rf"\b{font}\b", css + layout), f"Fuente prohibida {font}")

    def test_v7_specs_docs_icon_dockerfile_and_adrs(self) -> None:
        self.assertIn("Portafolio Hub V7", read("PRODUCT.md"))
        self.assertIn("Obsidian Fixed-Backdrop Zero-Card Cinema V7", read("DESIGN.md"))
        self.assertTrue((REPO_ROOT / "src" / "app" / "icon.svg").is_file(), "Falta src/app/icon.svg")
        self.assertTrue(
            (REPO_ROOT / ".specs" / "07-phase9-v7-zero-card-cinema" / "v7-obsidian-fixed-cinema.spec.md").is_file()
        )
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
