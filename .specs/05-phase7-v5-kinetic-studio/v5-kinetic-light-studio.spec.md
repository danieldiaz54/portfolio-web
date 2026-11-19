# Spec 05 — V5 Kinetic Light Studio (Next.js 15 Export, Smooth Scroll & Tactile Choreography)

## 1. Propósito
Mantener intacta la arquitectura de información en 3 capas de V4 (Hero limpio `<= 4` señales, Índice Maestro-Detalle único `#proyectos` y Estudio de 3 pestañas `Pruébalo / Cómo funciona / Ingeniería y código`), elevando la dirección visual y la interacción a **Kinetic Light Studio**: estética luminosa (`#fafaf8` + `#ffffff` + `#0b0f19` + `#2563eb`), física táctil y coreografía de scroll con `gsap`, `lenis`, `motion` y shaders de `Leonxlnx/taste-skill 2.5.1`.

## 2. Alcance y cambios estructurales
1. **Despliegue 100% real en Next.js 15 + React 19 (`output: "export"`)**:
   - Eliminar el HTML estático duplicado manual (`public/index.html`, `public/preview.html`, `scripts/static_hub.template.html`, `scripts/sync_static_hub.py`).
   - Configurar `next.config.mjs` con soporte dual (`standalone` por defecto y `STATIC_EXPORT=1` con `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }` y `NEXT_PUBLIC_BASE_PATH`).
   - Añadir `public/.nojekyll` para que GitHub Pages sirva `_next/` sin filtrado Jekyll.
   - Actualizar `.github/workflows/pages.yml` para compilar `./out` con Node 22 y publicarlo en GitHub Pages.
2. **Motor visual `taste-skill 2.5.1` + librerías cinéticas**:
   - Añadir `gsap`, `lenis` y `motion` en `package.json`.
   - Incorporar `public/assets/effects/fluted-glass/effect.js` y `public/assets/effects/grain-gradient/effect.js`.
   - `fluted-glass` como shader atmosférico por defecto detrás del Hero (`calm: 0.56`, acento `#2563eb` suave) con soporte completo para `grain-gradient`, `grid-pulse`, `contour-lines` y `off` vía `⌘K`.
3. **Coreografía de movimiento e interacción sin perder claridad**:
   - `SmoothScrollProvider`: instancia única de `Lenis` acoplada al ticker de `gsap` y `ScrollTrigger`, respetando `prefers-reduced-motion: reduce` y contenedores internos con `data-lenis-prevent`.
   - `ScrollProgressBar`: barra superior de `2px` impulsada por `motion/react` `useScroll` + `useSpring`.
   - Hero: entrada escalonada palabra por palabra en viewport inicial y CTAs magnéticos (`MagneticButton`) con inclinación de resorte sutil.
   - Índice Maestro-Detalle `#proyectos`: estado sincronizado con `ScrollTrigger` al desplazarse y con hover/teclado; píldora compartida `layoutId="active-index-pill"`; vista previa camaleónica tintada dinámicamente con `project.plate` mediante `AnimatePresence`; seguimiento de cursor con píldora `"Explorar estudio"`.
   - `ProjectStudio`: pestañas animadas con `layoutId="studio-tab-pill"`, micro-interacciones táctiles en `MicroLabs` y panel protegido con `data-lenis-prevent`.
   - `KineticManifesto`: revelado progresivo palabra por palabra vinculado al scroll en `#criterio`.

## 3. Reglas invariantes (no negociables)
- Prohibido `any`, `JSX.Element`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` y `document.write`.
- Mantener cero toolbars técnicas en Hero, cero KPIs decorativos (`6/6/100%`) y cero duplicación del catálogo de proyectos.
- Respetar `prefers-reduced-motion: reduce` en Lenis, GSAP, Motion y WebGL Shaders.
- Overflow horizontal `0px` en `390px` móvil y `1440px` escritorio.
