# DESIGN — Pinned Scrollytelling Cinema V6 (`portfolio-web`)

Skills y librerías aplicadas: `gpt-taste` (GSAP pinning, card stacking y text scrubbing), `design-taste-frontend` (`Leonxlnx/taste-skill 2.5.1`), `impeccable`, `gsap`, `lenis` y `motion`.

## Principios visuales (Kinetic Light Studio + Scroll Estático)
- **Lienzo luminoso de estudio:** papel `#FAFAF8`, placas `#FFFFFF`, tinta `#0B0F19`, grafito `#475569`, acento eléctrico `#2563EB` y punto vivo `#16A34A`.
- **Cuatro escenas cinematográficas al hacer scroll:**
  1. **Telón de portada (`Hero`):** fijado atrás mientras `.curtain-surface` con esquinas superiores `36px` se desliza sobre él. Fondo WebGL `fluted-glass` por defecto y nuevo shader `silk-folds` seleccionable en `⌘K`.
  2. **Escenario fijado `#proyectos`:** barra vertical de progreso continua + indicador de 6 segmentos clicables + transición camaleónica con `clip-path`, perspectiva 3D interactiva al puntero (`useMotionValue` / `useSpring`) y reflejo especular.
  3. **Manifiesto fijado y tarjetas apiladas (`#criterio`):** palabras encendidas progresivamente con énfasis cromático en conceptos clave, seguido de 3 placas con `position: sticky` que se comprimen suavemente al apilarse.
  4. **Portal final (`#contacto`):** entrada con `scale` vinculada al scroll y foco radial luminoso al mover el cursor.
- **Integridad de Sticky / Pinning:** `overflow-x: clip` en `html` y `body` (nunca `overflow: hidden` global) y recalibración tras `document.fonts.ready`.

## Seguridad del DOM
Cero `any`, cero `JSX.Element`, cero `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` o `document.write`. Shaders vendored en `public/assets/effects/` (`fluted-glass`, `silk-folds`, `grain-gradient`, `grid-pulse`, `contour-lines`).
