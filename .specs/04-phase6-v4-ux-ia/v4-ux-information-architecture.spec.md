# Spec V4 — Arquitectura de Información y UX por Divulgación Progresiva (`portfolio-web` v4.0.0)

> **Estado:** Aprobada · **Rama:** `feat/v4-ux-information-architecture` (desde `dev`) · **Referencia:** `impeccable/reference/craft-floor.md` + `critique-rubric.md` + `design-taste-frontend` (`tasteskill 2.5.1`).

## 1. Problema UX resuelto respecto a V3
La iteración anterior (`v3.0.0`) sufría de sobrecarga cognitiva y redundancia visual:
- Cada proyecto aparecía listado **4 veces** en la misma página (barra de telemetría del Hero + selector del Laboratorio + grilla de 6 placas + tabla Matriz).
- El Hero competía por atención con **19 controles simultáneos** (selector de shader, ping manual, 6 píldoras técnicas, eyebrow, KPIs `6/6/100%`, 3 CTAs).
- Al entrar a un proyecto se presentaban Micro-Lab, Diagrama SVG y Trade-offs comprimidos lado a lado.

## 2. Nuevo Modelo Mental: 3 Capas de Divulgación Progresiva
1. **Capa 1 — Entrada limpia (`<= 4` elementos en foco):**
   - **Masthead:** Wordmark `Daniel Díaz` + 3 enlaces únicos (`Proyectos`, `Criterio`, `Contacto`). El atajo `⌘K`/`Ctrl+K` permanece oculto al teclado.
   - **Hero:** Fondo silencioso `grid-pulse` de `taste-skill 2.5.1` (`lineOpacity: 0.09`, `pulses: 4`, `calm: 0.62`, sin botones de control visibles), `<h1>` directo (`"Software claro para usar, sólido por dentro."`, sin eyebrow ni colores parciales), tesis en 2 líneas y exactamente 2 acciones (`Explorar los proyectos` y `Cómo trabajo`).
2. **Capa 2 — `#proyectos`: Índice Maestro-Detalle (única aparición de los 6 proyectos):**
   - **Columna izquierda (`.project-index`):** 6 filas sobrias separadas por filetes `1px` (nombre + subtítulo cotidiano + 1 línea de valor + punto discreto de salud en vivo). Sin tarjetas anidadas ni cifras de latencia en portada.
   - **Columna derecha sticky (`.project-stage-preview`):** placa visual `16:10` real del proyecto seleccionado (`PreviewPlate`), resumen problema/resultado en 2 líneas y 2 acciones: **`Probar y ver cómo funciona`** y **`Abrir app en vivo ↗`**.
3. **Capa 3 — `ProjectStudio` (Estudio Profundo en 3 pestañas, modalidad enfocada y `/projects/[slug]`):**
   - **Pestaña 1 (`Pruébalo`):** el problema cotidiano + Micro-Lab interactivo a ancho completo.
   - **Pestaña 2 (`Cómo funciona`):** diagrama SVG de señales con pulsos (`normal` ↔ `Simular fallo / defensa`) + decisión *Qué elegí vs Qué descarté* + pasos del flujo.
   - **Pestaña 3 (`Ingeniería y código`):** telemetría CORS real contra Railway (`/api/v1/health` en `ms` + botón `Comprobar ahora`), especificaciones técnicas, Stack, **Retrospectiva honesta** y código en GitHub.
   - Navegación secuencial `← Anterior` / `Siguiente →`.
4. **Cierre de página:** 3 filas editoriales en `#criterio` y bloque humano `#contacto` con botón `Copiar enlace del portafolio`.

## 3. Criterios de Aceptación
- Cero duplicación en portada: sin barras técnicas visibles, sin 7 filtros, sin tabla Matriz repetida, sin numeración decorativa.
- Superficies del navegador personalizadas (`::selection`, `scrollbar-color`, `:focus-visible`, `text-underline-offset`, `tabular-nums`).
- Paridad completa Next.js 15 (`src/`) ↔ GitHub Pages (`public/index.html`, `public/preview.html`) con `0 any`, `0 JSX.Element`, `0 innerHTML/eval`, `0px` horizontal overflow en `390px`.
