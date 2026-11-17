# ADR 002: Taxonomía del Portafolio Orientada a Arquitecturas y Problemas de Ingeniería

- **Estado**: Aceptado
- **Fecha**: 2026-11-17

## Contexto

La mayoría de los portafolios técnicos agrupan proyectos únicamente por framework o lenguaje (ej. "Proyecto en React", "Proyecto en Python"), lo cual comunica poco sobre el criterio arquitectónico del ingeniero, los *trade-offs* que sabe manejar o su capacidad para resolver problemas reales de negocio en distintas áreas del mercado.

## Decisión

Estructurar todo el ecosistema del portafolio bajo una **taxonomía dual (Área de Mercado + Arquitectura Distintiva)**:
1. Cada uno de los 5 repositorios insignia representa un área de mercado distinta (Full-Stack Tiempo Real, IA Aplicada/RAG, Sistemas Distribuidos, Cloud/DevOps/Observabilidad, Mobile Offline-First).
2. Ningún proyecto repite el estilo arquitectónico de otro (Monolito Modular Event-Driven, Pipeline Multi-Agente + RAG Híbrido, Microservicios con Saga + Transactional Outbox, IaC + GitOps + OTel, Clean Architecture + Offline-First Sync).
3. Tanto en la web como en cada repositorio, cada proyecto se presenta mediante:
   - Problema de ingeniería concreto.
   - Arquitectura aplicada con diagrama Mermaid verificable.
   - Métricas técnicas observables y ADRs explícitos.

## Alternativas Consideradas

- **Monorepo único con todos los proyectos acoplados**: Dificulta que cada proyecto muestre su propio ciclo de CI/CD, Dockerfile y stack independiente como repositorio público evaluable por separado.
- **Múltiples apps CRUD en el mismo stack**: No demuestra amplitud de criterio arquitectónico ni cobertura real del mercado.

## Consecuencias

### Positivas
- Diferenciación inmediata frente a portafolios genéricos: demuestra criterio de diseño de sistemas, no solo sintaxis.
- Cada repositorio público puede ser clonado, ejecutado y auditado de forma aislada.

### Trade-offs
- Mayor disciplina requerida para mantener coherencia visual y documental entre 6 repositorios independientes (mitigado mediante un estándar común de `README.md`, `docs/adr/` y CI).
