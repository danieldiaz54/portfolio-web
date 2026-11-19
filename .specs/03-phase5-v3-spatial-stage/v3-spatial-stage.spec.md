# Spec V3 — Spatial Architectural Stage (`portfolio-web` v3.0.0)

> **Estado:** Aprobada · **Rama:** `feat/v3-spatial-architectural-stage` (desde `dev`) · **Habilidad rectora:** `Leonxlnx/taste-skill` (`tasteskill 2.5.1`) + `frontend-design` + `impeccable` + `web-design-guidelines`.

## 1. Tesis de Cambio de Paradigma
La versión `v2.0.0` resolvió la claridad expositiva, pero mantenía al visitante como observador pasivo de tarjetas estáticas. **`v3.0.0` transforma el portafolio en un escenario interactivo de ingeniería** sin sacrificar sobriedad tipográfica ni velocidad:

1. **Un solo efecto GPU maestro en portada (`tasteskill 2.5.1`):**
   - Runtime oficial vendoreado sin dependencias externas en `public/assets/effects/fx.js`, con `grid-pulse/effect.js` (activo por defecto) y `contour-lines/effect.js` (conmutable desde Hero o `⌘K`).
   - Respeta `prefers-reduced-motion: reduce`, limita DPR, libera contextos WebGL fuera de pantalla y provee fallback SVG/CSS determinista.
2. **Telemetría en vivo real contra Railway (`/api/v1/health`):**
   - `LivePulseRail` ejecuta `fetch()` CORS en paralelo contra los 5 microservicios vivos (`merkat-catalog`, `pulseflow-collab`, `cortex-rag-agent`, `ledgercore-distributed`, `fieldnotes-mobile`) y reporta latencia medida en `ms`, junto al estado `local` para `pdfcraft-studio`.
3. **Sección I — Laboratorio en Vivo (6 Micro-Labs + Diagrama de Señales Reactivo):**
   - Escenario camaleónico que muta superficie, borde, acento y tipografía display al seleccionar cualquiera de los 6 capítulos (navegable por clic o teclado `←`/`→`).
   - Cada producto ofrece un **Micro-Lab interactivo real** dentro del hub (reordenar/firmar PDF con `0 B` a red, consultas polimórficas NoSQL+Redis CQRS, colisión `HTTP 409 OCC CAS` con resolución, citas RAG + guardrail honesto, idempotencia doble clic SHA-256 + reverso Saga, y modo avión SQLite + resolución 3-way).
   - Acoplado en paralelo al **Diagrama de Señales SVG** (`viewBox="0 0 420 220"`): al disparar una falla, colisión o rechazo desde el Micro-Lab, el paquete animado cambia de ruta normal a ruta de compensación/resolución (`normal` ↔ `fault`).
4. **Paleta de Comandos Global (`⌘K` / `Ctrl+K`):**
   - `role="dialog"`, `aria-modal="true"`, navegable por teclado (`↑`/`↓`/`Enter`/`Esc`), filtro instantáneo sobre productos, paradigmas y stack, acción global **Ping en vivo (5 APIs Railway)** y control del shader del Hero (`grid-pulse`, `contour-lines`, `estático`).
5. **Paridad Next.js 15 (`src/`) ↔ GitHub Pages (`public/`):**
   - Única fuente de datos en `src/data/projects.ts` y estilos en `src/app/globals.css`, sincronizados automáticamente hacia `public/index.html` y `public/preview.html` mediante `scripts/sync_static_hub.py`.

## 2. Guardrails No Negociables
- **TypeScript estricto (`src/`):** `0` ocurrencias de `any`, `0` ocurrencias de `JSX.Element` (usar `ReactNode`), `npm run lint`, `npm run typecheck` y `npm run build` sin errores.
- **Seguridad del DOM (`public/` y `scripts/`):** `0` ocurrencias de `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval(` y `document.write`; SVG construido exclusivamente con `document.createElementNS`.
- **Contraste y Anti-Slop:** `#F7F7F5` + `#FFFFFF` + `#0A0A0A` + `#0044CC` (`Archivo` + `Hanken Grotesk` + `JetBrains Mono`); prohibidas `Inter`, `Roboto`, `Open Sans`, `#F7F6F3` y `#8B5CF6`.
