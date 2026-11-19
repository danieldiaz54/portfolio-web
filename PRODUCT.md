# PRODUCT — Portafolio Hub V5 (Kinetic Light Studio & Real Next.js Export)

## 1. Rol del hub
El hub guía al visitante con claridad inmediata desde una tesis limpia hasta la prueba interactiva de cada producto real, combinando la arquitectura de información en 3 capas con una experiencia cinética, táctil y luminosa ejecutada directamente sobre Next.js 15 + React 19 (sin plantillas estáticas paralelas).

## 2. Audiencias y recorrido en 3 capas
| Audiencia | Tiempo disponible | Capa que consume | Qué resuelve al instante |
|---|---|---|---|
| Cualquier visitante / talento | 10–20 s | Capa 1 (Entrada) | **Tesis en 10 segundos**: qué construyo, para quién y dos rutas claras (`Explorar los proyectos`, `Cómo trabajo`). |
| Líder de producto / diseño | 1–2 min | Capa 2 (Índice Maestro-Detalle `#proyectos`) | Los 6 proyectos en una sola lista sincronizada con el scroll, con vista previa camaleónica en la identidad visual de cada producto. |
| Líder técnico / ingeniero par | 3–10 min | Capa 3 (`ProjectStudio`: 3 pestañas) | 1. **Pruébalo** (Micro-Lab) → 2. **Cómo funciona** (Diagrama interactivo + Trade-offs) → 3. **Ingeniería y código** (Salud real Railway, retrospectiva y GitHub). |

## 3. Decisiones clave de UX V5
1. **Un único punto de verdad compilado con Next.js 15 (`output: "export"`):** GitHub Pages publica el mismo bundle React (`gsap`, `lenis`, `motion`, `fluted-glass`) compilado por Next.js bajo `./out` con `public/.nojekyll`.
2. **Hero sin distracciones (<= 4 señales):** entrada tipográfica coreografiada sobre vidrio estriado WebGL sutil (`fluted-glass`), cero eyebrows, cero KPIs decorativos y cero toolbars técnicas en portada.
3. **Exploración táctil en `#proyectos`:** selección reactiva por hover, clic, teclado o scroll (`ScrollTrigger`), píldora deslizante (`layoutId`), transiciones camaleónicas (`AnimatePresence`) y cursor contextual (`Explorar estudio`).
4. **Estudio y cierre vivo (`ProjectStudio`, `#criterio` y `#contacto`):** divulgación en 3 pestañas con desplazamiento aislado (`data-lenis-prevent`), manifiesto de criterio revelado con el scroll y copia instantánea del enlace en `#contacto`.

## 4. Estructura final
1. **Barra de progreso & Masthead flotante** (`ScrollProgressBar` + `Daniel Díaz` · `Proyectos` · `Criterio` · `Contacto`).
2. **Hero cinético** (`fluted-glass` WebGL silencioso · entrada tipográfica · `Explorar los proyectos` · `Cómo trabajo` magnéticos).
3. **Proyectos (`#proyectos`)** — Índice Maestro-Detalle de 6 filas con `ScrollTrigger` + vista previa camaleónica sticky 16:10 + Estudio en drawer/ruta `/projects/[slug]`.
4. **Criterio (`#criterio`)** — Manifiesto kinetic word-by-word + síntesis en 3 principios de arquitectura.
5. **Contacto (`#contacto`)** + colofón y paleta rápida `⌘K` (incluye selector de 5 shaders).
