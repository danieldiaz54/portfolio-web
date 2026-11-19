# PRODUCT — Portafolio Hub (Exposición de Ingeniería)

## 1. Rol del hub
El hub **no** es otro producto: es la **sala de exposición** que presenta seis productos independientes,
cada uno con su propia identidad visual, su propio paradigma de arquitectura y su propio despliegue en vivo.
Su trabajo es **explicar**, no impresionar con ruido: en 10 segundos un visitante debe saber quién soy,
qué construyo y dónde está la evidencia.

## 2. Audiencias y su pregunta principal
| Audiencia | Tiempo disponible | Pregunta | Respuesta del hub |
|---|---|---|---|
| Reclutador / talento | 10–30 s | ¿Qué hace esta persona y es real? | Tesis de una línea + 6 productos con enlace en vivo |
| Líder de ingeniería | 2–5 min | ¿Cómo decide? ¿Entiende trade-offs? | Ficha de caso: decisión elegida vs descartada, modo de falla, retrospectiva |
| Par técnico | 10+ min | ¿El código respalda lo que dice? | Repositorio, número de pruebas, matriz de paradigmas |

## 3. Convenciones investigadas (portafolios senior 2025–2026)
1. **Tesis en 10 segundos**: rol + especialidad + prueba, sin adjetivos vacíos ("apasionado", "innovador").
2. **Pocos proyectos, bien explicados**: 4–6 casos curados en lugar de una lista de 20 repos.
3. **Resultado primero**: cada tarjeta abre con el problema cotidiano que resuelve, no con el stack.
4. **Casos de estudio con decisiones**: problema → restricciones → decisión (X sobre Y) → modo de falla → evidencia → qué haría distinto.
5. **Evidencia verificable**: demo en vivo, código fuente y pruebas automatizadas enlazadas.
6. **Escaneable**: filtros por tipo de sistema y una matriz comparativa para lectura rápida.
7. **Colofón honesto**: cómo se hizo el sitio, tipografías y herramientas.

## 4. Estructura de la página
1. **Portada (Tesis)** — nombre, una línea de posicionamiento, tres cifras verificables, CTA a la exposición.
2. **Exposición** — 6 placas, cada una con una vista previa codificada en la paleta y tipografía exacta del producto,
   filtros por categoría (Web · Tiempo real · IA · Fintech · Móvil · Datos).
3. **Ficha de caso** (panel lateral + página `/projects/[slug]`) — Problema, Para quién, Decisiones (elegido vs descartado,
   por qué, modo de falla), Flujo, Evidencia, Retrospectiva.
4. **Matriz de paradigmas** — tabla comparativa: paradigma, persistencia, consistencia, despliegue, pruebas.
5. **Método** — cómo trabajo (Spec-Driven Development, arquitectura limpia, pruebas antes del merge, GitFlow).
6. **Colofón y contacto**.

## 5. No-objetivos
- No es un dashboard ni un informe de métricas.
- No reutiliza el estilo de ningún producto expuesto: el hub es neutro para que cada placa luzca su identidad.
