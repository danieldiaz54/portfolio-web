# DESIGN — Monografía de Galería Arquitectónica

Skills aplicadas: `frontend-design` (dirección estética intencional), `impeccable` (jerarquía, ritmo, copy),
`web-design-guidelines` (accesibilidad y semántica), `ui-ux-pro-max` (patrones de portafolio y paletas).

## Concepto
Un catálogo impreso de exposición de arquitectura: papel de galería, tinta negra, retícula suiza estricta,
números de inventario (`N.º 01`) y placas montadas. El hub es deliberadamente sobrio y monocromo para que
**las seis placas** —cada una en la paleta real de su producto— sean el único color fuerte de la página.

## Tokens
| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F7F7F5` | Fondo de galería |
| `--plate` | `#FFFFFF` | Montaje de placas y panel |
| `--ink` | `#0A0A0A` | Texto principal, reglas gruesas |
| `--graphite` | `#3F3F46` | Texto secundario |
| `--hairline` | `#E4E4E7` | Filetes de 1 px |
| `--gallery` | `#0044CC` | Único acento: enlaces, foco, filtro activo |
| `--live` | `#15803D` | Indicador "En vivo" |

## Tipografía
- **Display**: `Archivo` (700–900, tracking negativo, tamaños 56–120 px en portada).
- **Texto**: `Hanken Grotesk` (400–600, 17 px, interlineado 1.6, medida 64ch).
- **Metadatos**: `JetBrains Mono` (12–13 px, mayúsculas, inventario, cifras).
- Tipografías prohibidas: Inter, Roboto, Open Sans, Arial como elección primaria.

## Retícula y ritmo
- 12 columnas, contenedor 1240 px, margen 24/48 px.
- Reglas negras de 2 px abren cada sección con número romano + título (`II — Exposición`).
- Placas en retícula 3 / 2 / 1 columnas; cada placa: vista previa 4:3 + ficha técnica de 3 filas.

## Placas (vistas previas codificadas)
Cada placa dibuja una miniatura del producto real con CSS: su fondo, tinta, acento y fuente display.
| Producto | Fondo | Acento | Display |
|---|---|---|---|
| PdfCraft | `#EAEEF2` | `#1D4ED8` | Bricolage Grotesque |
| Merkat | `#FAFAF9` | `#A16207` | Bodoni Moda |
| PulseFlow | `#090D16` | `#10B981` | Sora |
| Cortex | `#F8FAFC` | `#B45309` | Source Serif 4 |
| LedgerCore | `#F4F7F6` | `#047857` | Albert Sans |
| FieldNotes | `#EFECE6` | `#9A3412` | Bitter |

## Movimiento
Solo transiciones de 160–240 ms en `transform`/`opacity` (placa eleva 2 px, panel se desliza).
`prefers-reduced-motion` desactiva todo movimiento.

## Accesibilidad
Contraste AA en todo texto, foco visible `2px solid var(--gallery)`, panel con `role="dialog"`,
`aria-modal`, cierre con `Esc`, filtros como `role="tablist"` con `aria-selected`.

## Seguridad del DOM
Sin `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `eval`. El HTML estático construye nodos con
`document.createElement` + `textContent`.
