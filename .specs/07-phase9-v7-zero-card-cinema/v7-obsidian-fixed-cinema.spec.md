# Spec 07 — V7 Obsidian Fixed-Backdrop Zero-Card Cinema (`portfolio-web`)

## 1. Principio rector
Reformulación completa desde cero basada en un **lienzo oscuro fijo continuo** (`#06080D`, `position: fixed; inset: 0`) iluminado por shaders WebGL de `taste-skill 2.5.1` (`prism-dispersion`, `spotlight-cone`, `god-rays`) y **cero tarjetas** sobre la narrativa principal: tipografía marfil abierta al espacio (`#F8FAFC`), filetes `1px` (`rgba(248, 250, 252, 0.12)`), proyecciones flotantes sin marco y un carril inferior tipo tira de cine.

## 2. Cuatro actos sobre fondo estático continuo
1. **Fondo Atmosférico Fijo (`FixedBackdrop.tsx` + `HeroShader.tsx`):**
   - Capa `z-index: 0` fija en viewport con `prism-dispersion` por defecto (`calm` a la izquierda para proteger la lectura), baño radial cromático reactivo (`--scene-accent`) y viñeta protectora de contraste.
2. **Acto I — Portada (`section.hero`):**
   - Transparente sobre el lienzo fijo (`<= 4` señales focales, cero eyebrows/toolbars/KPIs).
   - Entrada tipográfica 3D por palabras y salida *dolly-through* vinculada al scroll (`pin: true, pinSpacing: true, scrub: 0.6`).
3. **Acto II — Escenario de Proyección (`CinemaStage.tsx`, `#proyectos`):**
   - **Cero cajas ni tarjetas:** en escritorio (`>= 960px`), `.cinema-stage` se fija en pantalla (`pin: true, scrub: 0.55`) mostrando a la izquierda texto editorial puro + CTA, a la derecha la proyección flotante 3D de `<PreviewPlate />` (inclinación por resorte + morfismo `clip-path` + cursor `"Explorar estudio ↗"`), y abajo una tira horizontal de 6 capítulos sobre un único filete láser (`--scrub-progress`).
   - En móvil (`< 960px`), `.cinema-mobile-reel` despliega las 6 obras directamente sobre el fondo fijo separadas por filetes `1px` sin tarjetas.
4. **Acto III y Acto IV — Método y Cierre (`KineticManifesto.tsx`, `EditorialMethod.tsx`, `CinemaFinale.tsx`):**
   - Manifiesto fijado temporalmente en escritorio + 3 filas tipográficas editoriales con dibujo de filetes `1px` en scroll (`EditorialMethod`) sin tarjetas ni sombras.
   - Final abierto (`CinemaFinale`) con tipografía gigante `Conversemos.` y acciones magnéticas sobre el resplandor final del lienzo fijo.

## 3. Estándares invariantes
- `ProjectStudio.tsx` y `SignalDiagram.tsx` conservan las 3 capas (`Pruébalo`, `Cómo funciona`, `Ingeniería y código`), los 6 Micro-Labs y la telemetría CORS en Railway bajo paleta obsidiana con diagrama técnico de alto contraste.
- `overflow-x: clip` en `html` y `body`; `0 any`, `0 JSX.Element`, `0 innerHTML/eval`; `scrollWidth <= 390` en móvil y soporte estricto para `prefers-reduced-motion: reduce`.
