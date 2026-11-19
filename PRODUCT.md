# PRODUCT — Portafolio Hub V6 (Pinned Scrollytelling Cinema & Next.js 15 Export)

## 1. Rol del hub
El hub transforma la navegación tradicional en un recorrido cinematográfico guiado por scroll estático (`ScrollTrigger pin + scrub`), permitiendo explorar las seis aplicaciones reales sin perder simplicidad cognitiva: primero claridad humana en portada, luego exhibición interactiva paso a paso fijada en pantalla y finalmente el estudio profundo en 3 pestañas.

## 2. Audiencias y recorrido en 3 capas
| Audiencia | Tiempo disponible | Capa que consume | Qué resuelve al instante |
|---|---|---|---|
| Cualquier visitante / talento | 10–20 s | Capa 1 (Hero Cortina Pinned) | **Tesis en 10 segundos**: qué construyo, para quién y entrada limpia hacia los proyectos sobre vidrio estriado / seda WebGL. |
| Líder de producto / diseño | 1–2 min | Capa 2 (Escenario Fijado `#proyectos`) | Los 6 productos en una escena estática que avanza con el scroll (`1..6`), mostrando cada identidad visual real en vista previa 3D reactiva. |
| Líder técnico / ingeniero par | 3–10 min | Capa 3 (`ProjectStudio`: 3 pestañas) | 1. **Pruébalo** (Micro-Lab) → 2. **Cómo funciona** (Diagrama interactivo + Trade-offs) → 3. **Ingeniería y código** (Salud real Railway, retrospectiva y GitHub). |

## 3. Evolución clave en V6
1. **Scroll estático coreografiado (`pin + scrub`):** en escritorio, Hero funciona como telón de entrada; `#proyectos` fija el índice y la vista previa 3D para recorrer los 6 productos mediante scroll continuo, clic en filas o salto por segmentos; `#criterio` fija el manifiesto y apila las tarjetas de método; `#contacto` revela un portal interactivo con foco luminoso.
2. **Navegación sincronizada a spacers fijados:** `Navbar` flotante con píldora compartida (`layoutId`) conectado al contexto global de `Lenis` (`useSmoothScroll()`), garantizando saltos exactos pese a las alturas reservadas por `ScrollTrigger`.
3. **Degradación elegante en móvil y accesibilidad:** bajo `960px` o con `prefers-reduced-motion: reduce`, el recorrido pasa a flujo vertical fluido con revelados suaves sin bloqueo de scroll ni desbordamiento horizontal (`390px`).
