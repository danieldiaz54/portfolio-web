"""Automated verification of portfolio-web contracts, TypeScript strictness, DOM security, and ecosystem sync."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
ECOSYSTEM_ROOT = REPO_ROOT.parent

EXPECTED_PROJECTS = {
    "pulseflow-collab": ("17/17 Tests PASS", ":8095"),
    "cortex-rag-agent": ("15/15 Tests PASS", ":8090"),
    "ledgercore-distributed": ("33/33 Tests PASS", ":8096"),
    "cloudops-gitops-platform": ("31/31 Tests PASS", ":8098"),
    "fieldnotes-mobile": ("45/45 Tests PASS", ":8097"),
}


class TestPortfolioWebContractsAndSecurity(unittest.TestCase):
    def test_package_and_tsconfig_strict_mode(self) -> None:
        pkg = json.loads((REPO_ROOT / "package.json").read_text(encoding="utf-8"))
        tsc = json.loads((REPO_ROOT / "tsconfig.json").read_text(encoding="utf-8"))
        self.assertEqual(pkg["name"], "portfolio-web")
        self.assertIn("build", pkg["scripts"])
        self.assertIn("typecheck", pkg["scripts"])
        self.assertTrue(tsc["compilerOptions"]["strict"])

    def test_typescript_sources_contain_zero_any(self) -> None:
        any_pattern = re.compile(r"(:\s*any\b|\bas\s+any\b|<any>)")
        ts_files = list((REPO_ROOT / "src").rglob("*.ts")) + list(
            (REPO_ROOT / "src").rglob("*.tsx")
        )
        self.assertGreaterEqual(len(ts_files), 6)
        for path in ts_files:
            content = path.read_text(encoding="utf-8")
            self.assertIsNone(
                any_pattern.search(content),
                f"Forbidden 'any' type detected in {path.relative_to(REPO_ROOT)}",
            )

    def test_projects_catalog_and_preview_sync_all_five_certified_repos(self) -> None:
        projects_ts = (REPO_ROOT / "src" / "data" / "projects.ts").read_text(
            encoding="utf-8"
        )
        preview_html = (REPO_ROOT / "public" / "preview.html").read_text(
            encoding="utf-8"
        )
        for slug, (qa_metric, port_marker) in EXPECTED_PROJECTS.items():
            self.assertIn(slug, projects_ts)
            self.assertIn(qa_metric, projects_ts)
            self.assertIn(port_marker, projects_ts)
            self.assertIn("v0.1.0 · Certificado", projects_ts)

            self.assertIn(slug, preview_html)
            self.assertIn(qa_metric, preview_html)
            self.assertIn(port_marker, preview_html)
            self.assertIn("v0.1.0 · Certificado", preview_html)

    def test_preview_html_uses_safe_dom_without_innerhtml(self) -> None:
        preview_html = (REPO_ROOT / "public" / "preview.html").read_text(
            encoding="utf-8"
        )
        for forbidden in ("innerHTML", "outerHTML", "insertAdjacentHTML", "eval("):
            self.assertNotIn(forbidden, preview_html)
        self.assertIn("DOMParser", preview_html)

    def test_dockerfile_non_root_and_adrs_present(self) -> None:
        dockerfile = (REPO_ROOT / "Dockerfile").read_text(encoding="utf-8")
        self.assertIn("USER nextjs", dockerfile)
        self.assertTrue(
            (
                REPO_ROOT
                / "docs"
                / "adr"
                / "001-nextjs-app-router-and-static-case-studies.md"
            ).is_file()
        )
        self.assertTrue(
            (
                REPO_ROOT
                / "docs"
                / "adr"
                / "002-multi-architecture-portfolio-taxonomy.md"
            ).is_file()
        )

    def test_all_sibling_repositories_exist_with_certified_specs(self) -> None:
        for slug in EXPECTED_PROJECTS:
            sibling = ECOSYSTEM_ROOT / slug
            if sibling.is_dir():
                self.assertTrue(
                    (
                        sibling
                        / ".specs"
                        / "04-security"
                        / "security-audit-report.spec.md"
                    ).is_file(),
                    f"Missing security certification in {slug}",
                )


if __name__ == "__main__":
    unittest.main()
