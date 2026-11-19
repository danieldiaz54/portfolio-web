# Spec 06 — V6 Pinned Scrollytelling Cinema (Scroll Estático Coreografiado)

## 1. Propósito
Elevar la experiencia de `portfolio-web` a un recorrido cinematográfico impulsado por scroll con secciones fijadas en pantalla (**"scroll estático"** mediante GSAP `ScrollTrigger` `pin: true` + `scrub`), física 3D reactiva al puntero y shaders WebGL `taste-skill 2.5.1` (`fluted-glass`, `silk-folds`, `grain-gradient`), sin romper la claridad ni la arquitectura en 3 capas de V4/V5.

## 2. Capítulos de Scrollytelling
1. **Capítulo 1 — Hero Pinned Curtain (Portada):**
   - `section.hero` queda fijada (`pin: true, pinSpacing: false, scrub: true`) en escritorio mientras la superficie inferior (`.curtain-surface` con `border-radius: 36px 36px 0 0`) sube cubriéndola suavemente; `.hero-inner` retrocede con profundidad (`y`, `scale`, `opacity`, `blur`), el shader se escala sutilmente y `.hero-scroll-cue` se desvanece.
   - Mantiene `<= 4` elementos de foco en portada (sin toolbars técnicas ni KPIs falsos).
2. **Capítulo 2 — `#proyectos` Pinned Stage (Protagonista · 6 pasos):**
   - `.projects-pin-stage` se fija en pantalla (`start: "top top", end: () => "+=" + projects.length * 460, pin: true, scrub: 0.5`).
   - Al avanzar el scroll, una barra vertical izquierda (`.scrub-fill`) y 6 segmentos horizontales superiores reflejan el progreso continuo; cada sexto del recorrido activa automáticamente el siguiente producto (`motion.div layoutId="active-index-pill"` + morfismo con `clip-path` y escala de `AnimatePresence` en `<PreviewPlate />` + resplandor ambiental reactivo a `project.plate`).
   - Clic en fila, clic en segmento superior o flechas ↑↓ saltan suavemente dentro de la línea temporal fijada (`useSmoothScroll().scrollTo`).
   - La tarjeta de vista previa reacciona en 3D (`useMotionValue` + `useSpring` `rotateX`/`rotateY`) con brillo especular y píldora `"Explorar estudio"`.
3. **Capítulo 3 — `#criterio` Manifiesto Fijado + Apilamiento de Principios (`CriteriaStack`):**
   - `.manifesto-stage` se fija brevemente (`pin: true, scrub: 0.6`) mientras cada palabra se ilumina (`opacity: 0.14 -> 1.0`, con énfasis cromático `.manifesto-accent`) y progresa `.manifesto-progress-bar`.
   - Debajo, `.criteria-stack` apila las 3 tarjetas con `position: sticky` escalonado y encogimiento sutil (`scale: 0.94, opacity: 0.76`) de la tarjeta previa al entrar la siguiente.
4. **Capítulo 4 — `#contacto` Portal Spotlight (`ContactPortal`):**
   - Tarjeta escalada dinámicamente desde el scroll (`scale: 0.94 -> 1.0`) con foco radial interactivo seguido por el puntero (`--mx`, `--my`) y CTAs magnéticos.

## 3. Reglas invariantes de seguridad, rendimiento y móvil
- `overflow-x: clip` (en lugar de `hidden`) sobre `html` y `body` para permitir `position: sticky` y `ScrollTrigger pin: true`.
- Toda fijación (`pin: true`) condicionada con `gsap.matchMedia()` a `"(min-width: 960px) and (prefers-reduced-motion: no-preference)"`. En móvil (`< 960px`) las secciones fluyen limpiamente sin fijaciones forzadas ni desbordamiento (`scrollWidth <= 390`).
- Navegación superior flotante tipo píldora con seguimiento dinámico (`activeSection` + `layoutId="nav-active-pill"`) integrada con `useSmoothScroll()` para evitar desfaces de desplazamiento con spacers fijados.
- `0 any`, `0 JSX.Element`, `0 innerHTML/eval`.
