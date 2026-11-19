# Agentic Architecture Changelog — portfolio-web

## [2026-11-18] - Release v0.1.0 (Fase 4): Sincronización de Métricas Reales, Certificación QA & Seguridad DOM

### Added
- **SDD Specifications (`.specs/`)**:
  - `.specs/02-phase4-ecosystem-sync/certified-case-studies-and-metrics.spec.md`
  - `.specs/04-security/security-audit-report.spec.md` (`security-auditor`)
- **Automated Verification Suite (`tests/test_portfolio_hub_contracts.py`)**:
  - 6 pruebas automatizadas verificando `tsconfig.json` strict, cero `any` en TypeScript, sincronización de los 5 Case Studies con métricas reales (`17/17`, `15/15`, `33/33`, `31/31`, `45/45` tests) y puertos (`:8095`, `:8090`, `:8096`, `:8098`, `:8097`), cero `innerHTML` en `public/preview.html`, usuario non-root `nextjs` en `Dockerfile` y certificación cruzada de los 5 repositorios hermanos.

### Changed
- **`src/data/projects.ts` & `public/preview.html`**:
  - Actualizados con las métricas reales certificadas (`v0.1.0 · Certificado`) de los 5 repositorios y renderizado seguro de SVG con `DOMParser`.

## [2026-11-17] - Adopción de Estructura Agéntica (Estándar GNV Manager)

### Added
- **`AGENTS.md`**: Gobernanza del *Lead Orchestrator*, Ley de Ramas (`dev` / `main` / `sdd/agentic-optimization`) y catálogo de 7 subagentes.
- **`.agents/`**: Personas de los 7 subagentes, reglas contextuales (`domain-purity.md`, `ui-strict-types.md`, `gitflow-and-env-isolation.md`), Safety Gate (`hooks.json`, `safety-gate.py`, `safety-gate.js`) y catálogo de skills UI/UX.
- **`.specs/`**: Especificaciones fundacionales en `.specs/00-infrastructure/` y `.specs/01-domain/architecture-baseline.spec.md`.
- **Aislamiento de Entornos**: `.env.development.example`, `.env.production.example` y `docker-compose.dev.yml`.
