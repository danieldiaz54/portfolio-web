# DESIGN — Monografía de Galería V4 (Divulgación Progresiva & Carga Cognitiva Mínima)

Skills aplicadas: `impeccable` (`craft-floor.md` + `critique-rubric.md`), `design-taste-frontend` (`Leonxlnx/taste-skill 2.5.1`), `frontend-design` y `web-design-guidelines`.

## Principios visuales
- **Lienzo sereno:** papel `#F7F7F5`, placas `#FFFFFF`, tinta `#0A0A0A`, grafito `#3F3F46`, filetes `#E4E4E7`, acento único `#0044CC` y punto vivo `#15803D`.
- **Cero hábitos plantilla rechazados por `craft-floor.md`:**
  - Sin eyebrows/kickers en mayúsculas sobre titulares.
  - Sin numeración falsa `01 / 02 / 03` ni números romanos decorativos.
  - Sin tarjetas anidadas ni grilla cliché de métricas hero (`6 / 6 / 100%`).
  - Sin etiquetas técnicas ni URLs crudas en la portada principal.
- **Un único efecto GPU silencioso (`taste-skill 2.5.1`):** `grid-pulse` atenuado (`lineOpacity: 0.09`, `pulses: 4`, `calm: 0.62`) detrás del Hero, sin botones de control visibles; conmuta vía atajo `⌘K` y respeta `prefers-reduced-motion: reduce`.
- **Superficies de navegador estilizadas:** `::selection`, `scrollbar-color`, `:focus-visible`, `text-underline-offset: 4px`, y `tabular-nums` restringido a cifras y latencias reales.
- **Índice Maestro-Detalle:** filetes `1px` a la izquierda, vista previa `16:10` a tamaño generoso sticky a la derecha.
- **Estudio de 3 pestañas:** cada capa recibe ancho completo sin competir visualmente entre sí.

## Tipografía
- **Display**: `Archivo` (700–800, tracking `-0.03em` máx., medida <= 15ch en Hero).
- **Cuerpo**: `Hanken Grotesk` (400–600, 17px, interlineado 1.6, medida <= 65ch).
- **Datos y código**: `JetBrains Mono` (solo donde existen mediciones, nodos o código real).

## Seguridad del DOM
Cero `innerHTML`, `outerHTML`, `insertAdjacentHTML` ni `eval`. DOM y SVG construidos exclusivamente mediante `createElement`, `createElementNS` y `textContent`.
