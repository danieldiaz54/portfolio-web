# PRODUCT — Portafolio Hub V4 (Arquitectura de Información por Divulgación Progresiva)

## 1. Rol del hub
El hub guía al visitante con la menor carga cognitiva posible desde una tesis clara hasta la prueba en vivo de cada sistema, eliminando la duplicación de listas y el ruido de ingeniería en la portada.

## 2. Audiencias y recorrido en 3 capas
| Audiencia | Tiempo disponible | Capa que consume | Qué resuelve al instante |
|---|---|---|---|
| Cualquier visitante / talento | 10–20 s | Capa 1 (Entrada) | **Tesis en 10 segundos**: qué construyo, para quién y a dónde ir (`Proyectos`). |
| Líder de producto / diseño | 1–2 min | Capa 2 (Índice Maestro-Detalle `#proyectos`) | Los 6 proyectos en un solo lugar, con vista previa real en su paleta y beneficio cotidiano primero. |
| Líder técnico / ingeniero par | 3–10 min | Capa 3 (`ProjectStudio`: 3 pestañas) | 1. **Pruébalo** (Micro-Lab) → 2. **Cómo funciona** (Diagrama + Trade-offs) → 3. **Ingeniería y código** (Salud real Railway, retrospectiva y GitHub). |

## 3. Decisiones clave de UX V4
1. **Cada proyecto aparece una sola vez** en el documento principal (`#proyectos`), eliminando grilla + tabla matriz + barra de ping + laboratorio repetidos.
2. **Hero sin distracciones (<= 4 señales):** sin eyebrows, sin KPIs decorativos (`6/6/100%`), sin controles del shader y sin URLs de healthcheck en portada.
3. **Divulgación progresiva del Estudio:** probar primero, entender el diagrama después, revisar latencias y código al final.
4. **Cierre accionable (`#criterio` y `#contacto`):** síntesis de método en 3 filas limpias y acción directa para copiar el enlace del portafolio o ir a GitHub.

## 4. Estructura final
1. **Masthead** (`Daniel Díaz` · `Proyectos` · `Criterio` · `Contacto`).
2. **Hero** (shader silencioso `grid-pulse` · tesis · `Explorar los proyectos` · `Cómo trabajo`).
3. **Proyectos (`#proyectos`)** — Índice de 6 filas + Vista previa sticky 16:10 + botón `Probar y ver cómo funciona`.
4. **Estudio (`ProjectStudio`, `#estudio-<slug>` y `/projects/[slug]`)** — `Pruébalo` · `Cómo funciona` · `Ingeniería y código`.
5. **Criterio (`#criterio`)** y **Contacto (`#contacto`)** + colofón y atajo silencioso `⌘K`.
