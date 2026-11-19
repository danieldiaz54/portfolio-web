# DESIGN — Kinetic Light Studio V5 (`portfolio-web`)

Skills y librerías aplicadas: `design-taste-frontend` (`Leonxlnx/taste-skill 2.5.1`), `impeccable` (`craft-floor.md` + `critique-rubric.md`), `frontend-design`, `gsap`, `lenis` y `motion`.

## Principios visuales (Dirección 1 — Kinetic Light Studio)
- **Lienzo luminoso de estudio:** papel cálido `#FAFAF8`, superficies `#FFFFFF` con borde sutil `rgba(11, 15, 25, 0.08)` y elevación suave de estudio, tinta `#0B0F19`, grafito `#475569`, acento eléctrico `#2563EB` y punto vivo `#16A34A`.
- **Geometría táctil moderna:** botones píldora (`999px`) con física magnética sutil (`MagneticButton`), placas `24px–28px` redondeadas y transiciones spring calibradas.
- **Atmósfera WebGL (`taste-skill 2.5.1`):** `fluted-glass` (vidrio arquitectónico estriado con refracción cromática suave) por defecto detrás del Hero, más `grain-gradient`, `grid-pulse`, `contour-lines` y `off` accesibles mediante `⌘K`. Respeta siempre `prefers-reduced-motion: reduce`.
- **Coreografía de scroll e interacción:**
  - `Lenis` sincronizado al ticker de `GSAP` (`ScrollTrigger`).
  - Barra de progreso superior (`motion/react` `useScroll` + `useSpring`).
  - Vista previa camaleónica (`ProjectIndex`) que adopta el color de fondo, tinta y acento de cada producto (`project.plate`) mediante `AnimatePresence`.
  - Manifiesto revelado por palabras al avanzar por `#criterio`.
- **Disciplina anti-slop conservada:** cero eyebrows en mayúsculas sobre titulares, cero numeración decorativa `01 / 02`, cero tarjetas anidadas, cero KPIs cosméticos y cero duplicación del listado de proyectos.

## Tipografía
- **Display**: `Archivo` (700–800, tracking controlado `-0.03em` máx., medida `<= 15ch` en Hero).
- **Cuerpo**: `Hanken Grotesk` (400–600, `17px`, interlineado `1.6`, medida `<= 65ch`).
- **Datos y código**: `JetBrains Mono` (exclusivamente en métricas de latencia reales, nodos y artefactos técnicos).

## Seguridad del DOM
Cero `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` o `document.write`. Shaders vendored auditados en `public/assets/effects/` usando exclusivamente DOM/WebGL seguro.
