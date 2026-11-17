# ADR 001: Next.js App Router y Catálogo Estático Tipado para Case Studies

- **Estado**: Aceptado
- **Fecha**: 2026-11-17

## Contexto

El sitio web del portafolio (`portfolio-web`) debe servir como punto de entrada rápido, indexable por motores de búsqueda y confiable para reclutadores y *staff engineers* que evalúan proyectos técnicos en pocos minutos. Necesitamos modelar información estructurada (área de mercado, arquitectura, problema, solución, métricas, diagramas Mermaid y ADRs destacados) sin introducir la complejidad operativa de una base de datos externa ni el costo de mantener un CMS en esta fase.

## Decisión

1. Utilizar **Next.js 15 (App Router)** con generación estática (`generateStaticParams` en `/projects/[slug]`) y `output: "standalone"` para despliegues portables en Docker o Vercel/Edge.
2. Almacenar los *Case Studies* en un catálogo fuertemente tipado en TypeScript (`src/types/project.ts` y `src/data/projects.ts`) en lugar de consultar un CMS headless o base de datos en tiempo de ejecución.

## Alternativas Consideradas

- **CMS Headless (Sanity / Strapi / Contentful)**: Añade latencia de red, gestión de tokens/webhooks y un servicio adicional que mantener vivo. Descartado para Fase 0.
- **SPA tradicional en Vite/React**: Peor SEO por defecto para páginas de detalle y requiere configuración adicional para SSR/SSG.

## Consecuencias

### Positivas
- **Type-safety de extremo a extremo**: Cualquier campo faltante en un Case Study falla en tiempo de compilación (`tsc --noEmit`).
- **Rendimiento óptimo**: Páginas pre-renderizadas con TTFB mínimo y cero dependencias de runtime externas.
- **Evolución simple**: Si en el futuro los Case Studies crecen a artículos largos en MDX o se sincronizan con la API de GitHub, la interfaz `ProjectCaseStudy` permite cambiar el adaptador de datos sin reescribir la UI.

### Trade-offs
- Actualizar textos o métricas de un proyecto requiere un commit y rebuild del sitio (aceptable al estar versionado junto al código en Git).
