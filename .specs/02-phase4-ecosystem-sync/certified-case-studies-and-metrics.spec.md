# SPEC-02: Sincronización Fase 4 — Métricas Reales, Puertos Locales y Certificaciones v0.1.0

> **Estado**: Implementado & Certificado
> **Fecha**: 2026-11-18
> **Alcance**: `src/data/projects.ts`, `public/preview.html`, `tests/test_portfolio_hub_contracts.py`

---

## 1. Objetivo

Conectar el Hub Central (`portfolio-web`) con las métricas reales observadas, conteos de pruebas automatizadas, puertos de ejecución local y certificaciones QA + DevSecOps obtenidas al completar los 5 repositorios técnicos del portafolio.

## 2. Matriz de Proyectos Certificados Conectados al Hub

| Proyecto (`slug`) | Versión & Estado | Puerto Local | Suite QA (`unittest`) | Seguridad (`security-auditor`) |
| :--- | :--- | :--- | :--- | :--- |
| `pulseflow-collab` | `v0.1.0 · Certificado` | `:8095` | `17/17 PASS` | `CERTIFIED (0 Crit/High)` |
| `cortex-rag-agent` | `v0.1.0 · Certificado` | `:8090` | `15/15 PASS` | `CERTIFIED (0 Crit/High)` |
| `ledgercore-distributed` | `v0.1.0 · Certificado` | `:8096` | `33/33 PASS` | `CERTIFIED (0 Crit/High)` |
| `cloudops-gitops-platform` | `v0.1.0 · Certificado` | `:8098` | `31/31 PASS` | `CERTIFIED (0 Crit/High)` |
| `fieldnotes-mobile` | `v0.1.0 · Certificado` | `:8097` | `45/45 PASS` | `CERTIFIED (0 Crit/High)` |

## 3. Criterios de Aceptación y Seguridad DOM

1. Tanto `src/data/projects.ts` como `public/preview.html` reflejan el estado `v0.1.0 · Certificado`, el puerto de demostración local y el conteo real de pruebas de cada proyecto.
2. `public/preview.html` renderiza los diagramas SVG de Mermaid mediante `DOMParser().parseFromString(svg, "image/svg+xml")` y `replaceChildren`, eliminando el uso de `innerHTML`.
3. `tests/test_portfolio_hub_contracts.py` valida automáticamente la integridad de los 5 Case Studies, la ausencia de `any` en `src/`, la ausencia de `innerHTML` en `public/preview.html` y la existencia real de los 5 repositorios hermanos en el ecosistema.
