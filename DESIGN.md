# DESIGN — Monografía de Galería Arquitectónica + Spatial Architectural Stage (V3)

Skills aplicadas: `design-taste-frontend` (`Leonxlnx/taste-skill 2.5.1`: un único efecto GPU maestro, diagramas con pulsos, micro-física `motion.md`, control de densidad y contraste), `frontend-design` (dirección estética intencional), `impeccable` (jerarquía, ritmo, copy), `web-design-guidelines` (accesibilidad y semántica) y `ui-ux-pro-max`.

## Concepto
Una **Monografía de Galería** elevada a escenario espacial de ingeniería: papel arquitectónico `#F7F7F5`, tinta negra `#0A0A0A`, retícula de 12 columnas y un único shader GPU sobrio en la portada (`grid-pulse` o `contour-lines`). Al recorrer los laboratorios en la Sección I, el escenario adopta sutilmente el acento de la obra activa para presentar **el producto vivo y su diagrama de flujo** lado a lado.

## Tokens
| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F7F7F5` | Fondo de galería |
| `--plate` | `#FFFFFF` | Montaje de placas, laboratorio y panel |
| `--ink` | `#0A0A0A` | Texto principal, reglas gruesas |
| `--graphite` | `#3F3F46` | Texto secundario |
| `--hairline` | `#E4E4E7` | Filetes de 1 px |
| `--gallery` | `#0044CC` | Acento institucional del hub, enlaces y foco |
| `--live` | `#15803D` | Indicador de salud real en vivo |

## Presupuesto GPU y Movimiento (`tasteskill 2.5.1`)
- **Un solo efecto maestro en el Hero:** `public/assets/effects/fx.js` monta `grid-pulse` (señales recorriendo una retícula fina hacia el borde opuesto al titular) o `contour-lines` (mapa topográfico paramétrico en OKLab), con botón de conmutación y soporte estático.
- **Diagramas pulsantes:** SVG semántico (`viewBox="0 0 420 220"`) con pulsos GPU sobre `stroke-dashoffset` que redirigen su ruta cuando el visitante provoca un conflicto o compensación en el Micro-Lab.
- **Física de micro-interacciones (`motion.md`):** `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`, paso táctil `1px` en hover y escala `.985` al presionar; cero animaciones sobre `width`/`height`/`top`/`left`.
- `prefers-reduced-motion: reduce` desactiva shaders animados, pulsos SVG y transiciones.

## Tipografía
- **Display**: `Archivo` (700–800, tracking negativo).
- **Texto**: `Hanken Grotesk` (400–600, 17 px, interlineado 1.6).
- **Metadatos y telemetría**: `JetBrains Mono` (12–13 px, `tabular-nums` en latencias y contadores).
- Tipografías prohibidas: `Inter`, `Roboto`, `Open Sans`, `Arial` como elección primaria.

## Seguridad del DOM y Accesibilidad
- **Cero `innerHTML`, `outerHTML`, `insertAdjacentHTML` o `eval`.** Todo el DOM y SVG estático se construye con `createElement`, `createElementNS` y `textContent`.
- Contraste AA en todo texto, anillo de foco `2px solid var(--gallery)`, paleta `⌘K` y drawer con `role="dialog"`, `aria-modal="true"`, cierre con `Esc` y pestañas con `role="tablist"`.
