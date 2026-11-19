# DESIGN — Obsidian Fixed-Backdrop Zero-Card Cinema V7 (`portfolio-web`)

Skills y librerías aplicadas: `gpt-taste` (dolly & pinning editorial), `design-taste-frontend` (`Leonxlnx/taste-skill 2.5.1` dark-room lighting), `impeccable`, `gsap`, `lenis` y `motion`.

## Principios visuales (Cine Oscuro Atmosférico Sin Tarjetas)
- **Teatro fijo obsidiana:** fondo continuo `#06080D`, tinta marfil `#F8FAFC`, plata `#CBD5E1`, grafito `#94A3B8`, filetes estructurales `rgba(248, 250, 252, 0.12)`, azul eléctrico `#3B82F6` y punto vivo `#22C55E`.
- **Iluminación WebGL fija (`taste-skill 2.5.1`):**
  - `prism-dispersion` por defecto (haz blanco refractado en abanico espectral con zona `calm` a la izquierda para máxima legibilidad del texto).
  - `spotlight-cone`, `god-rays`, `fluted-glass`, `grid-pulse`, `contour-lines` y `off` intercambiables en `⌘K`.
  - Layer cromático reactivo `.cinema-chroma-wash` sincronizado con `--scene-accent` + viñeta lateral protectora.
- **Arquitectura abierta sin cajas:**
  - **Barra HUD abierta (`.hud-nav`):** tipografía en esquina izquierda (`Daniel Díaz`) y derecha (`Obras`, `Método`, `Contacto`, `⌘K`) con único subrayado `1px` móvil (`layoutId="hud-underline"`).
  - **Proyección 3D sin marco (`.cinema-projection`):** `<PreviewPlate />` flota sin tarjeta blanca alrededor, manteniendo intacta la paleta individual de cada producto y emitiendo sombra volumétrica del acento de la obra.
  - **Tira cinematográfica inferior (`.filmstrip`):** 6 capítulos horizontales sobre filete único láser (`--scrub-progress`).
  - **Editorial Method (`#criterio`) & Finale (`#contacto`):** filas suizas con filetes `1px` dibujados en scroll y tipografía abierta gigante `Conversemos.`.
- **Estudio Técnico (`ProjectStudio` + `SignalDiagram`):** superficie obsidiana elevada `#0D1320`, pestañas minimalistas por línea inferior (`layoutId="studio-tab-line"`) y diagrama SVG oscuro de alto contraste (`#0B101B` + `#F8FAFC`).

## Seguridad del DOM
Cero `any`, cero `JSX.Element`, cero `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` o `document.write`. Shaders vendored en `public/assets/effects/`.
