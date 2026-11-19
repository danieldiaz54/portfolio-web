# PRODUCT — Portafolio Hub V3 (Spatial Architectural Stage)

## 1. Rol del hub
El hub **no** es otro producto aislado ni una galería pasiva de tarjetas: es un **escenario interactivo de exposición de ingeniería** (`Spatial Architectural Stage`) que presenta seis productos independientes, cada uno con su propia identidad visual, su propio paradigma de arquitectura y su propio despliegue en vivo.
Su trabajo es **demostrar y explicar en segundos**: el visitante puede probar los mecanismos clave de cada sistema sin abandonar la portada y verificar su salud real contra producción.

## 2. Audiencias y su pregunta principal
| Audiencia | Tiempo disponible | Pregunta | Respuesta del hub V3 |
|---|---|---|---|
| Reclutador / talento | 10–30 s | ¿Qué hace esta persona y es real? | Tesis de una línea + pulsos en vivo contra 5 APIs Railway + 6 productos probables en vivo |
| Líder de ingeniería | 2–5 min | ¿Cómo decide? ¿Entiende trade-offs y fallas? | Micro-Lab interactivo + diagrama de señales que conmuta a ruta de falla + ficha *Elegido vs Descartado* |
| Par técnico | 10+ min | ¿El código respalda lo que dice? | Código en vivo, paleta `⌘K` con telemetría real, matriz de paradigmas y suite de contratos |

## 3. Convenciones investigadas (portafolios senior 2025–2026)
1. **Tesis en 10 segundos**: rol + especialidad + prueba verificable, sin adjetivos vacíos.
2. **El prototipo es la exhibición**: en vez de texto descriptivo plano, un Micro-Lab manipulable para cada sistema.
3. **Pocos proyectos, bien explicados**: 6 casos curados con arquitectura y persistencia distintas.
4. **Resultado primero**: cada placa y cada laboratorio abren con el problema cotidiano que resuelve.
5. **Casos de estudio con decisiones**: problema → restricciones → decisión (X sobre Y) → modo de falla aceptado → evidencia → qué haría distinto.
6. **Telemetría y evidencia verificable**: ping CORS real a producción, repositorios y pruebas automatizadas.
7. **Ergonomía de herramienta (`⌘K`) y colofón honesto**: navegación por teclado, créditos explícitos de tipografías y shaders.

## 4. Estructura de la página V3
1. **Portada (`100svh` con shader GPU maestro)** — tesis editorial, fondo óptico `grid-pulse` / `contour-lines` de `tasteskill 2.5.1`, tres cifras verificables y riel de pulso en vivo con latencias reales.
2. **I — Laboratorio en Vivo (Chameleon Stage)** — selector de 6 capítulos, atmósfera adaptada a la paleta de cada obra, Micro-Lab operable en sitio, diagrama SVG animado que reacciona a simulaciones de falla y decisión *Elegido vs Descartado*.
3. **II — Exposición completa** — 6 placas codificadas con filtros por categoría (`role="tablist"`) y acceso al panel lateral o ruta `/projects/[slug]`.
4. **III — Matriz de paradigmas** — tabla comparativa enriquecida con estado en vivo.
5. **IV — Método** y **V — Colofón**.
6. **Paleta Global `⌘K`** — búsqueda instantánea, `Ping en vivo (5 APIs Railway)` y conmutador de shader.

## 5. No-objetivos
- No es un dashboard saturado ni un muro de widgets con múltiples efectos WebGL simultáneos.
- No reutiliza una única estética para los 6 productos: el hub es un lienzo neutro de galería que cede el protagonismo cromático a cada obra.
