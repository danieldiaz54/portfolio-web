import type { ProjectCaseStudy } from "@/types/project";

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "daniel-dev";

export const PROJECTS: ProjectCaseStudy[] = [
  {
    slug: "pulseflow-collab",
    title: "PulseFlow Collab",
    tagline:
      "Plataforma colaborativa de gestión de incidentes y operaciones en tiempo real.",
    area: "Full-Stack & Realtime",
    architecture: "Monolito Modular + Event-Driven WebSockets",
    phase: "Fase 1",
    problem:
      "Los equipos de ingeniería que coordinan incidentes sufren estado desactualizado entre múltiples pestañas, sobrescrituras silenciosas cuando dos operadores editan el mismo registro y ausencia de trazabilidad auditada.",
    solution:
      "Backend en monolito modular con separación estricta por dominios, control de concurrencia optimista mediante versionado de entidades, publicación de eventos en Redis Pub/Sub para escalar gateways WebSocket horizontalmente y bitácora inmutable de cambios en PostgreSQL.",
    techStack: [
      "Next.js",
      "TypeScript",
      "NestJS / Fastify",
      "PostgreSQL",
      "Redis Pub/Sub",
      "WebSockets",
    ],
    metrics: [
      { label: "Latencia Sync", value: "< 50 ms p95" },
      { label: "Concurrencia", value: "Optimistic Locking" },
      { label: "Escalado WS", value: "Multi-nodo via Redis" },
    ],
    mermaidDiagram: `flowchart LR
    C1[Browser Client A] <-->|WebSocket| GW1[WS Gateway Node 1]
    C2[Browser Client B] <-->|WebSocket| GW2[WS Gateway Node 2]
    GW1 <-->|Pub/Sub| R[(Redis Event Bus)]
    GW2 <-->|Pub/Sub| R
    GW1 --> MOD[Modular Monolith Core]
    MOD -->|Optimistic Lock + Audit| PG[(PostgreSQL)]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Monolito Modular antes que Microservicios",
        decision:
          "Estructurar el backend como un monolito modular con fronteras de dominio explícitas.",
        rationale:
          "Maximiza velocidad de iteración y transacciones ACID sin la sobrecarga operacional de múltiples despliegues en el dominio colaborativo.",
      },
      {
        id: "ADR-02",
        title: "Redis Pub/Sub como backplane de WebSockets",
        decision:
          "Desacoplar las conexiones WebSocket usando canales Pub/Sub en Redis.",
        rationale:
          "Permite ejecutar múltiples instancias del servidor detrás de un balanceador manteniendo sincronizados a todos los clientes conectados.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/pulseflow-collab`,
  },
  {
    slug: "cortex-rag-agent",
    title: "Cortex RAG Agent",
    tagline:
      "Copiloto multi-agente para análisis documental técnico con RAG híbrido y evaluación continua.",
    area: "Applied AI & Agents",
    architecture: "Pipeline Multi-Agente + RAG Híbrido + Evals",
    phase: "Fase 2",
    problem:
      "Los asistentes basados en RAG ingenuo fallan en consultas técnicas con acrónimos exactos, generan respuestas sin citas verificables y carecen de métricas objetivas para detectar regresiones en calidad, latencia o costo.",
    solution:
      "Pipeline orquestado con grafo de agentes (Router, Retriever Híbrido, Verificador de Citas) que combina búsqueda vectorial densa con BM25/léxica y Reranking, entrega respuestas vía Server-Sent Events (SSE) y ejecuta un Eval Harness automatizado sobre datasets dorados.",
    techStack: [
      "Python 3.12",
      "FastAPI",
      "LangGraph",
      "pgvector",
      "SSE Streaming",
      "Next.js",
    ],
    metrics: [
      { label: "Recuperación", value: "Hybrid Vector + BM25" },
      { label: "Grounding", value: "100% Citas Verificadas" },
      { label: "Calidad", value: "Eval Harness Automatizado" },
    ],
    mermaidDiagram: `flowchart TD
    Q[User Query] --> R[Router Agent]
    R --> V[Vector Search pgvector]
    R --> K[Keyword Search BM25]
    V --> RR[Reciprocal Rank Fusion]
    K --> RR
    RR --> G[Synthesizer + Citation Guardrail]
    G -->|SSE Stream| UI[Next.js Streaming UI]
    EV[Eval Harness CI] -.->|Faithfulness & Latency| G`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Búsqueda Híbrida sobre pgvector + Full-Text",
        decision:
          "Unificar almacenamiento relacional, vectorial y léxico en PostgreSQL con pgvector.",
        rationale:
          "Evita sincronización dual con bases vectoriales externas y mejora la precisión en códigos de error, símbolos y nombres propios.",
      },
      {
        id: "ADR-02",
        title: "Eval Harness como compuerta de calidad",
        decision:
          "Versionar un conjunto de pruebas de evaluación con métricas de fidelidad, relevancia y costo por token.",
        rationale:
          "Permite iterar prompts y chunking con evidencia cuantitativa en lugar de pruebas manuales subjetivas.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/cortex-rag-agent`,
  },
  {
    slug: "ledgercore-distributed",
    title: "LedgerCore Distributed",
    tagline:
      "Motor transaccional y de reservas de alta concurrencia con consistencia eventual garantizada.",
    area: "Distributed Systems",
    architecture: "Microservicios Event-Driven (Saga + Outbox Pattern)",
    phase: "Fase 1",
    problem:
      "En sistemas distribuidos de pagos o inventario, los reintentos de red y las fallas parciales entre base de datos y broker de mensajes provocan cobros duplicados, eventos perdidos o estados inconsistentes.",
    solution:
      "Arquitectura orientada a eventos en Java 21 y Spring Boot 3 que implementa Idempotency Keys, Transactional Outbox Pattern para publicación atómica hacia Apache Kafka, orquestación Saga con acciones compensatorias y locks distribuidos en Redis.",
    techStack: [
      "Java 21",
      "Spring Boot 3",
      "Apache Kafka",
      "PostgreSQL",
      "Redis",
      "Testcontainers",
    ],
    metrics: [
      { label: "Seguridad", value: "Zero Double-Spend" },
      { label: "Mensajería", value: "Transactional Outbox" },
      { label: "Tolerancia", value: "Saga + Dead Letter Queue" },
    ],
    mermaidDiagram: `flowchart LR
    API[Ledger API] -->|Idempotency Check| RD[(Redis Lock)]
    API -->|ACID Tx: Ledger + Outbox| PG[(PostgreSQL)]
    RL[Outbox Relay] -->|Publish Events| KF[[Apache Kafka]]
    KF --> S1[Reservation Service]
    KF --> S2[Settlement Service]
    S2 -->|Failure Event| KF
    KF -->|Compensating Action| API`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Transactional Outbox frente a 2PC (Two-Phase Commit)",
        decision:
          "Persistir eventos de dominio en una tabla outbox dentro de la misma transacción local que el estado del ledger.",
        rationale:
          "Garantiza entrega al menos una vez hacia Kafka sin acoplar disponibilidad con transacciones distribuidas bloqueantes.",
      },
      {
        id: "ADR-02",
        title: "Idempotencia por clave cliente y deduplicación en consumidor",
        decision:
          "Exigir Idempotency-Key en comandos críticos y registrar IDs procesados en los consumidores Kafka.",
        rationale:
          "Neutraliza reintentos de red y entregas duplicadas propias de la semántica at-least-once.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/ledgercore-distributed`,
  },
  {
    slug: "cloudops-gitops-platform",
    title: "CloudOps GitOps Platform",
    tagline:
      "Plataforma de infraestructura declarativa, despliegue GitOps y observabilidad OpenTelemetry.",
    area: "Cloud & DevOps",
    architecture: "IaC + GitOps + Full Observability (OTel)",
    phase: "Fase 3",
    problem:
      "Desplegar múltiples servicios manualmente genera deriva de configuración entre entornos, caídas durante actualizaciones y diagnóstico lento ante degradaciones en producción por falta de trazas correlacionadas.",
    solution:
      "Infraestructura reproducible con módulos Terraform, pipelines GitHub Actions con escaneo de seguridad e imágenes firmadas, sincronización declarativa en Kubernetes vía ArgoCD con despliegues progresivos y stack completo Prometheus + Grafana + Loki + OpenTelemetry.",
    techStack: [
      "Terraform",
      "Kubernetes",
      "ArgoCD",
      "GitHub Actions",
      "OpenTelemetry",
      "Prometheus & Grafana",
    ],
    metrics: [
      { label: "Despliegue", value: "Zero-Downtime GitOps" },
      { label: "Observabilidad", value: "Golden Signals + Traces" },
      { label: "Reproducibilidad", value: "100% Declarative IaC" },
    ],
    mermaidDiagram: `flowchart LR
    GH[GitHub Actions CI] -->|Build + Scan + Push| REG[(Container Registry)]
    GH -->|Update Manifests| GIT[GitOps Config Repo]
    ARGO[ArgoCD Controller] -->|Sync State| K8S[Kubernetes Cluster]
    TF[Terraform IaC] -->|Provision| K8S
    K8S -->|OTLP Metrics/Logs/Traces| OTEL[OTel Collector]
    OTEL --> PROM[Prometheus / Loki]
    PROM --> GRAF[Grafana Dashboards]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Modelo Pull GitOps con ArgoCD",
        decision:
          "Separar el pipeline de CI (construcción de artefactos) del controlador CD dentro del clúster.",
        rationale:
          "Evita exponer credenciales de administrador del clúster en runners externos y detecta drift automáticamente.",
      },
      {
        id: "ADR-02",
        title: "Estándar OpenTelemetry transversal",
        decision:
          "Instrumentar los servicios del portafolio mediante OTel Collector agnóstico al backend.",
        rationale:
          "Correlaciona trazas distribuidas entre Next.js, FastAPI y Spring Boot bajo un único Trace ID.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/cloudops-gitops-platform`,
  },
  {
    slug: "fieldnotes-mobile",
    title: "FieldNotes Mobile",
    tagline:
      "Aplicación móvil multiplataforma offline-first con motor de sincronización y resolución de conflictos.",
    area: "Mobile Offline-First",
    architecture: "Clean Architecture + Offline-First Sync Engine",
    phase: "Fase 2",
    problem:
      "Las aplicaciones móviles dependientes de red fallan en zonas sin cobertura, pierden formularios capturados en campo o generan conflictos destructivos cuando el dispositivo recupera conectividad.",
    solution:
      "App en React Native (Expo + TypeScript) estructurada con Clean Architecture, almacenamiento local transaccional en SQLite/WatermelonDB como fuente de verdad de la UI, cola persistente de mutaciones (outbox local) y motor de sincronización incremental con manejo explícito de conflictos.",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "SQLite / WatermelonDB",
      "Clean Architecture",
      "Jest",
    ],
    metrics: [
      { label: "Disponibilidad", value: "100% Offline-Capable" },
      { label: "UI Responsiveness", value: "Local-First Reads" },
      { label: "Integridad", value: "Conflict-Aware Sync" },
    ],
    mermaidDiagram: `flowchart TD
    UI[React Native Screens] --> UC[Domain Use Cases]
    UC --> REPO[Repository Interfaces]
    REPO --> DB[(Local SQLite / WatermelonDB)]
    DB --> Q[Pending Mutation Queue]
    NET[Network Monitor] -->|Online Trigger| SYNC[Background Sync Engine]
    Q --> SYNC
    SYNC <-->|Delta Push/Pull| API[Remote Sync API]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Local-First como fuente de verdad de la interfaz",
        decision:
          "Toda lectura y escritura de UI opera contra SQLite local, delegando la red al motor de sincronización.",
        rationale:
          "Garantiza latencia instantánea al usuario y elimina estados rotos ante pérdida intermitente de señal.",
      },
      {
        id: "ADR-02",
        title: "Clean Architecture para aislar el motor de sync",
        decision:
          "Separar entidades/casos de uso de adaptadores Expo, SQLite y transporte HTTP.",
        rationale:
          "Permite probar la lógica de resolución de conflictos con tests unitarios rápidos sin emulador.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/fieldnotes-mobile`,
  },
];

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
