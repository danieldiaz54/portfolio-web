import type { ProjectCaseStudy } from "@/types/project";

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "daniel-dev";

export const PROJECTS: ProjectCaseStudy[] = [
  {
    slug: "pulseflow-collab",
    title: "PulseFlow Collab",
    tagline:
      "Plataforma colaborativa de gestión de incidentes y operaciones en tiempo real (:8095).",
    area: "Full-Stack & Realtime",
    architecture: "Monolito Modular + Event-Driven WebSockets",
    phase: "v0.1.0 · Certificado",
    problem:
      "Los equipos de ingeniería que coordinan incidentes sufren estado desactualizado entre múltiples pestañas, sobrescrituras silenciosas cuando dos operadores editan el mismo registro y ausencia de trazabilidad auditada.",
    solution:
      "Backend en monolito modular con separación estricta por dominios, control de concurrencia optimista CAS (ERR-409-OPTIMISTIC-LOCK), publicación de eventos en backplane Pub/Sub multi-nodo (ws-gateway-01 y ws-gateway-02) y bitácora append-only inmutable.",
    techStack: [
      "Next.js / Minimalist UI",
      "TypeScript",
      "Python 3.12 / aiohttp WS",
      "PostgreSQL / SQLite CAS",
      "Redis Pub/Sub Backplane",
      "WebSockets & SSE",
    ],
    metrics: [
      { label: "Concurrencia", value: "CAS · HTTP 409 OCC" },
      { label: "Escalado WS", value: "Multi-nodo Pub/Sub" },
      { label: "Suite QA", value: "17/17 Tests PASS" },
    ],
    mermaidDiagram: `flowchart LR
    C1[Operator A] <-->|WebSocket / SSE| GW1[ws-gateway-01]
    C2[Operator B] <-->|WebSocket / SSE| GW2[ws-gateway-02]
    GW1 <-->|Pub/Sub Fan-out| R[(Multi-Node Event Bus)]
    GW2 <-->|Pub/Sub Fan-out| R
    GW1 --> MOD[Modular Monolith Core]
    MOD -->|Atomic CAS + Append-Only Triggers| PG[(PostgreSQL / SQLite)]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Monolito Modular antes que Microservicios",
        decision:
          "Estructurar el backend como un monolito modular con fronteras de dominio explícitas (incidents, sla_policy, collaboration).",
        rationale:
          "Maximiza velocidad de iteración y transacciones ACID sin la sobrecarga operacional de múltiples despliegues en el dominio colaborativo.",
      },
      {
        id: "ADR-02",
        title: "Compare-And-Swap Atómico y Bitácora Append-Only",
        decision:
          "Exigir expected_version en mutaciones y bloquear UPDATE/DELETE en incident_audit_ledger mediante triggers de base de datos.",
        rationale:
          "Evita sobrescrituras silenciosas (HTTP 409) y garantiza trazabilidad post-mortem inmutable.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/pulseflow-collab`,
  },
  {
    slug: "cortex-rag-agent",
    title: "Cortex RAG Agent",
    tagline:
      "Copiloto multi-agente para análisis documental técnico con RAG híbrido y evaluación continua (:8090).",
    area: "Applied AI & Agents",
    architecture: "Pipeline Multi-Agente + RAG Híbrido + Evals",
    phase: "v0.1.0 · Certificado",
    problem:
      "Los asistentes basados en RAG ingenuo fallan en consultas técnicas con acrónimos exactos, generan respuestas sin citas verificables y carecen de métricas objetivas para detectar regresiones en calidad, latencia o costo.",
    solution:
      "Pipeline orquestado con grafo de 4 agentes (Router, Hybrid Retriever BM25 + Vector 64-D con Reciprocal Rank Fusion k=60, Synthesizer y Citation Guardrail) con streaming SSE y Eval Harness conectado a un ledger append-only.",
    techStack: [
      "Python 3.12",
      "FastAPI / ThreadingHTTP",
      "Multi-Agent Pipeline",
      "pgvector + Okapi BM25",
      "SSE Streaming",
      "Eval Harness Ledger",
    ],
    metrics: [
      { label: "Recuperación", value: "BM25 + Vector RRF" },
      { label: "Golden Evals", value: "5/5 · Faithfulness 1.0" },
      { label: "Suite QA", value: "15/15 Tests PASS" },
    ],
    mermaidDiagram: `flowchart TD
    Q[User Query] --> R[Router Agent]
    R --> V[Vector Search 64-D Cosine]
    R --> K[Keyword Search Okapi BM25]
    V --> RR[Weighted RRF k=60]
    K --> RR
    RR --> G[Synthesizer + Citation Guardrail]
    G -->|SSE Stream| UI[Minimalist Console :8090]
    EV[Eval Harness 5/5] -->|Append-Only| L[(eval_runs_ledger)]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Búsqueda Híbrida BM25 + Vector con Reciprocal Rank Fusion",
        decision:
          "Combinar ranking léxico Okapi BM25 y similitud coseno vectorial mediante RRF ponderado según la intención clasificada por RouterAgent.",
        rationale:
          "Resuelve con precisión tanto códigos de error exactos (ERR-409, AGA-8) como consultas conceptuales de arquitectura.",
      },
      {
        id: "ADR-02",
        title: "Citation Guardrail y Ledger Append-Only de Evaluaciones",
        decision:
          "Bloquear respuestas sin citas verificadas ([cite:chunk_id]) y registrar cada corrida de evaluación en una tabla protegida por triggers BEFORE UPDATE/DELETE.",
        rationale:
          "Elimina alucinaciones no fundamentadas y preserva evidencia histórica inmutable de calidad.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/cortex-rag-agent`,
  },
  {
    slug: "ledgercore-distributed",
    title: "LedgerCore Distributed",
    tagline:
      "Motor transaccional double-entry y orquestador Saga con Transactional Outbox e idempotencia (:8096).",
    area: "Distributed Systems",
    architecture: "Microservicios Event-Driven (Saga + Outbox Pattern)",
    phase: "v0.1.0 · Certificado",
    problem:
      "En sistemas distribuidos de pagos o inventario, los reintentos de red y las fallas parciales entre base de datos y broker de mensajes provocan cobros duplicados, eventos perdidos o estados contables inconsistentes.",
    solution:
      "Motor contable de partida doble en centavos enteros exactos (Zero-Sum Invariant) con huella SHA-256 de Idempotency-Key, locks distribuidos con fencing tokens, Transactional Outbox hacia tópicos Kafka, compensación automática Saga + DLQ y blueprint Java 21 / Spring Boot 3.",
    techStack: [
      "Java 21 & Spring Boot 3",
      "Python 3.12 Core Engine",
      "Apache Kafka Outbox Relay",
      "PostgreSQL / SQLite ACID",
      "Redis Fencing Locks",
      "Double-Entry Zero-Sum",
    ],
    metrics: [
      { label: "Contabilidad", value: "Zero-Sum Imbalance $0" },
      { label: "Idempotencia", value: "SHA-256 Replay / 409" },
      { label: "Suite QA", value: "33/33 Tests PASS" },
    ],
    mermaidDiagram: `flowchart LR
    API[Ledger API :8096] -->|Fencing Token| RD[(Distributed Lock)]
    API -->|ACID Tx: Double-Entry + Outbox| PG[(PostgreSQL / SQLite)]
    RL[Outbox Relay] -->|At-Least-Once| KF[[Kafka Partitioned Topics]]
    KF --> S2[Settlement / Compensation]
    S2 -->|Failure| DLQ[(Dead-Letter Queue)]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Transactional Outbox frente a 2PC (Two-Phase Commit)",
        decision:
          "Persistir asientos contables de partida doble y eventos outbox dentro de la misma transacción ACID local.",
        rationale:
          "Garantiza publicación atómica hacia Kafka sin bloqueos distribuidos entre microservicios.",
      },
      {
        id: "ADR-02",
        title: "Idempotencia SHA-256 y Compensación Contable Append-Only",
        decision:
          "Validar huella SHA-256 por Idempotency-Key y ejecutar rollbacks de Saga mediante asientos compensatorios SAGA_COMPENSATION sin borrar filas previas.",
        rationale:
          "Previene doble cobro ante reintentos y mantiene inmutabilidad contable verificada bajo 24 hilos concurrentes.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/ledgercore-distributed`,
  },
  {
    slug: "cloudops-gitops-platform",
    title: "CloudOps GitOps Platform",
    tagline:
      "Plataforma de infraestructura Terraform, control plane GitOps y observabilidad OpenTelemetry (:8098).",
    area: "Cloud & DevOps",
    architecture: "IaC + GitOps + Full Observability (OTel)",
    phase: "v0.1.0 · Certificado",
    problem:
      "Desplegar múltiples servicios manualmente genera deriva de configuración entre entornos, contenedores inseguros en producción y diagnóstico lento ante degradaciones de SLO por falta de compuertas automáticas.",
    solution:
      "Módulos Terraform multi-entorno, manifiestos Kubernetes endurecidos (Pod Security Standards Restricted) sincronizados con ArgoCD ApplicationSet, stack OpenTelemetry + Prometheus + Grafana para los 5 servicios y motor Canary con auto-rollback por Golden Signals.",
    techStack: [
      "Terraform IaC",
      "Kubernetes & ArgoCD",
      "OpenTelemetry Collector",
      "Prometheus & Grafana",
      "Python 3.12 Control Plane",
      "PSS Restricted Policy Gate",
    ],
    metrics: [
      { label: "Flota GitOps", value: "5/5 Servicios Synced" },
      { label: "Canary Gate", value: "Auto-Rollback SLO 99.9%" },
      { label: "Suite QA", value: "31/31 Tests PASS" },
    ],
    mermaidDiagram: `flowchart LR
    TF[Terraform VPC/EKS] --> K8S[K8s PSS Restricted Fleet]
    ARGO[ArgoCD ApplicationSet] -->|Drift Reconcile| K8S
    CP[CloudOps Control Plane :8098] -->|Policy Gate + Canary Rollback| K8S
    K8S -->|OTLP Telemetry| OTEL[OTel Collector]
    OTEL --> PROM[Prometheus Alerts + Grafana]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "Modelo Pull GitOps y Compuerta de Admisión PSS Restricted",
        decision:
          "Bloquear contenedores root, sistemas de archivos mutables y tags :latest en producción antes de reconciliar estado con ArgoCD.",
        rationale:
          "Elimina deriva de configuración manual y garantiza mínimo privilegio en los 5 servicios del portafolio.",
      },
      {
        id: "ADR-02",
        title: "Canary Auto-Rollback gobernado por Golden Signals",
        decision:
          "Abortar y revertir despliegues canary automáticamente (HTTP 409) cuando la tasa de error supera 1.0% o la latencia p95 excede 250 ms.",
        rationale:
          "Protege el presupuesto de error (SLO 99.9%) con trazabilidad en un ledger append-only de despliegues.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/cloudops-gitops-platform`,
  },
  {
    slug: "fieldnotes-mobile",
    title: "FieldNotes Mobile",
    tagline:
      "Aplicación móvil multiplataforma offline-first con cola SQLite, relojes de Lamport y resolución de conflictos (:8097).",
    area: "Mobile Offline-First",
    architecture: "Clean Architecture + Offline-First Sync Engine",
    phase: "v0.1.0 · Certificado",
    problem:
      "Las aplicaciones móviles dependientes de red fallan en zonas industriales sin cobertura, pierden inspecciones capturadas en campo o sobrescriben cambios cuando múltiples técnicos reconectan.",
    solution:
      "App en React Native (Expo 52 + TypeScript estricto) y motor de sincronización con almacenamiento SQLite local-first, cola persistente de mutaciones, relojes lógicos de Lamport y resolución determinística de conflictos (KEEP_LOCAL, ACCEPT_REMOTE, MANUAL_MERGE).",
    techStack: [
      "React Native & Expo 52",
      "TypeScript Strict (0 any)",
      "SQLite Local Outbox",
      "Lamport Logical Clocks",
      "Python 3.12 Sync Engine",
      "Clean Architecture",
    ],
    metrics: [
      { label: "Operación", value: "100% Offline + Outbox" },
      { label: "Conflictos", value: "Lamport + 3-Way Merge" },
      { label: "Suite QA", value: "45/45 Tests PASS" },
    ],
    mermaidDiagram: `flowchart TD
    UI[Expo Mobile UI / Simulator :8097] --> UC[Clean Arch Use Cases]
    UC --> DB[(Local SQLite Notes + Outbox)]
    DB -->|Offline 503 Guard / Online Trigger| SYNC[Delta Push/Pull Engine]
    SYNC -->|Version & Lamport Check| REM[(Remote Cloud Sync Store)]
    REM -->|409 Version Divergence| CR[Conflict Resolver: Local/Remote/Merge]`,
    adrHighlights: [
      {
        id: "ADR-01",
        title: "SQLite Local-First con Outbox Transaccional",
        decision:
          "Persistir toda nota e inspección junto a su mutación pendiente en una única transacción SQLite local antes de intentar red.",
        rationale:
          "Garantiza latencia cero en interfaz móvil y cero pérdida de datos cuando el dispositivo opera en modo avión o sin señal.",
      },
      {
        id: "ADR-02",
        title: "Relojes Lógicos de Lamport y Resolución Explícita de Conflictos",
        decision:
          "Ordenar causalmente las mutaciones con LamportClock y exigir resolución explícita cuando base_version difiere de la versión remota.",
        rationale:
          "Evita pérdida silenciosa de inspecciones críticas de campo y registra cada sincronización en un ledger append-only.",
      },
    ],
    repoUrl: `https://github.com/${GITHUB_USERNAME}/fieldnotes-mobile`,
  },
];

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
