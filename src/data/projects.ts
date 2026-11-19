import type { CategoryFilter, Project } from "@/types/project";

export const OWNER = {
  name: "Daniel Díaz",
  role: "Ingeniero de software full-stack",
  thesis:
    "Diseño y construyo sistemas completos —del dominio a la interfaz— y explico cada decisión con su costo.",
  github: "https://github.com/danieldiaz54",
} as const;

export const CATEGORY_FILTERS: readonly CategoryFilter[] = [
  { id: "all", label: "Todo" },
  { id: "web", label: "Web local" },
  { id: "data", label: "Datos" },
  { id: "realtime", label: "Tiempo real" },
  { id: "ai", label: "IA" },
  { id: "fintech", label: "Fintech" },
  { id: "mobile", label: "Móvil" },
];

export const PROJECTS: readonly Project[] = [
  {
    slug: "pdfcraft-studio",
    inventory: "01",
    name: "PdfCraft Studio",
    everydayName: "Editor de PDF privado",
    oneLiner: "Une, reordena, anota y firma PDFs sin subirlos a ningún servidor.",
    problem:
      "Para firmar o unir un PDF solemos subir contratos y documentos de identidad a servicios web ajenos.",
    audience: "Cualquier persona que maneja documentos sensibles: contratos, facturas, trámites.",
    outcome:
      "Todo el procesamiento ocurre dentro del navegador; el archivo nunca sale del equipo.",
    category: "web",
    categoryLabel: "Web local",
    stack: ["React 19", "TypeScript", "Vite", "pdf-lib", "pdf.js", "Vitest"],
    liveUrl: "https://danieldiaz54.github.io/pdfcraft-studio/",
    repoUrl: "https://github.com/danieldiaz54/pdfcraft-studio",
    hosting: "GitHub Pages",
    testsLabel: "7 Vitest + 5 contratos",
    matrix: {
      paradigm: "Local-first / SPA sin backend",
      persistence: "Memoria del navegador",
      consistency: "Local, inmediata",
    },
    plate: {
      bg: "#EAEEF2",
      surface: "#FFFFFF",
      ink: "#0F172A",
      muted: "#64748B",
      accent: "#1D4ED8",
      displayFont: "Bricolage Grotesque",
      bodyFont: "Public Sans",
      displayVar: "--font-bricolage",
    },
    previewKind: "pdf",
    tradeOffs: [
      {
        chosen: "Procesar el PDF en el navegador",
        rejected: "API de conversión en servidor",
        because: "Privacidad por diseño y costo de infraestructura cero.",
        failureMode:
          "Archivos muy grandes quedan limitados por la memoria del dispositivo.",
      },
    ],
    flow: [
      "Arrastras el PDF",
      "pdf.js dibuja miniaturas",
      "Reordenas, anotas o firmas",
      "pdf-lib genera el nuevo archivo",
      "Descarga local",
    ],
    evidence: [
      "Pipeline de CI: ESLint, tsc --noEmit, Vitest y build de Vite",
      "Desplegado como sitio estático en GitHub Pages",
    ],
    retrospective:
      "Separar el motor de edición de la interfaz desde el día uno permitió probarlo sin navegador.",
    nextEvolution: "Mover el renderizado a un Web Worker para documentos de cientos de páginas.",
  },
  {
    slug: "merkat-catalog",
    inventory: "02",
    name: "Merkat",
    everydayName: "Catálogo de boutique",
    oneLiner: "Vitrina con filtros instantáneos para productos que no se parecen entre sí.",
    problem:
      "Una tienda que vende ropa, joyería y perfumes no cabe en una tabla rígida: cada producto tiene atributos propios.",
    audience: "Comercios pequeños con catálogos variados.",
    outcome:
      "Catálogo documental polimórfico con lecturas servidas desde caché y escrituras separadas (CQRS).",
    category: "data",
    categoryLabel: "Datos",
    stack: ["Node.js 22", "TypeScript", "MongoDB", "Redis", "Docker"],
    liveUrl: "https://merkat-catalog-production.up.railway.app",
    repoUrl: "https://github.com/danieldiaz54/merkat-catalog",
    hosting: "Railway",
    testsLabel: "4 contratos + suite TS",
    matrix: {
      paradigm: "NoSQL documental + CQRS",
      persistence: "MongoDB + caché Redis",
      consistency: "Eventual en lecturas (TTL)",
    },
    plate: {
      bg: "#FAFAF9",
      surface: "#FFFFFF",
      ink: "#1C1917",
      muted: "#78716C",
      accent: "#A16207",
      displayFont: "Bodoni Moda",
      bodyFont: "Figtree",
      displayVar: "--font-bodoni",
    },
    previewKind: "catalog",
    tradeOffs: [
      {
        chosen: "Documentos MongoDB con atributos por tipo",
        rejected: "Tablas relacionales con modelo EAV",
        because: "Cada producto se lee completo en una consulta, sin joins de atributos.",
        failureMode:
          "Si la caché no se invalida, un precio puede verse desactualizado hasta que vence el TTL.",
      },
    ],
    flow: [
      "El visitante filtra",
      "Consulta a la caché de lectura",
      "Si falla: MongoDB",
      "Respuesta + recarga de caché",
    ],
    evidence: [
      "Arquitectura hexagonal: dominio sin dependencias de infraestructura",
      "Contenedor sin privilegios (usuario no root)",
    ],
    retrospective:
      "Modelar las variantes de producto como tipos explícitos evitó un documento “cajón de sastre”.",
    nextEvolution: "Invalidación por eventos en lugar de TTL fijo.",
  },
  {
    slug: "pulseflow-collab",
    inventory: "03",
    name: "PulseFlow",
    everydayName: "Tablero Kanban en vivo",
    oneLiner: "Un tablero donde dos personas editan a la vez sin pisarse.",
    problem:
      "Cuando dos personas editan la misma tarjeta, una sobrescribe el trabajo de la otra sin enterarse.",
    audience: "Equipos pequeños que organizan trabajo en tarjetas.",
    outcome:
      "Presencia en vivo y detección de ediciones simultáneas: el conflicto se muestra en lugar de perderse.",
    category: "realtime",
    categoryLabel: "Tiempo real",
    stack: ["Python 3.12", "Server-Sent Events", "Backplane de eventos", "Bitácora de auditoría"],
    liveUrl: "https://pulseflow-collab-production.up.railway.app",
    repoUrl: "https://github.com/danieldiaz54/pulseflow-collab",
    hosting: "Railway",
    testsLabel: "18 pruebas",
    matrix: {
      paradigm: "Orientado a eventos + concurrencia optimista",
      persistence: "Bitácora append-only",
      consistency: "Fuerte por versión (409)",
    },
    plate: {
      bg: "#090D16",
      surface: "#111827",
      ink: "#E5E7EB",
      muted: "#9CA3AF",
      accent: "#10B981",
      displayFont: "Sora",
      bodyFont: "Manrope",
      displayVar: "--font-sora",
    },
    previewKind: "kanban",
    tradeOffs: [
      {
        chosen: "Concurrencia optimista con número de versión",
        rejected: "Bloqueos pesimistas por tarjeta",
        because: "Nadie queda bloqueado esperando; el choque solo se resuelve cuando ocurre.",
        failureMode: "Con muchísima contención en una sola tarjeta aumentan los reintentos.",
      },
    ],
    flow: [
      "Editas una tarjeta (versión n)",
      "El servidor compara versiones",
      "Coincide: guarda y emite evento",
      "No coincide: 409 y aviso de conflicto",
    ],
    evidence: [
      "Demo de un clic: “Simular edición simultánea” provoca un 409 real",
      "Cada cambio queda en una bitácora de auditoría consultable",
    ],
    retrospective:
      "SSE resultó suficiente para la presencia; WebSockets queda como adaptador opcional.",
    nextEvolution: "Fusión automática de campos que no chocan (CRDT por campo).",
  },
  {
    slug: "cortex-rag-agent",
    inventory: "04",
    name: "Cortex",
    everydayName: "Chat con tus documentos",
    oneLiner: "Pregunta a tus manuales y recibe la respuesta con la cita exacta.",
    problem:
      "Los asistentes de IA responden con seguridad aunque inventen, y no dicen de qué página salió la respuesta.",
    audience: "Estudiantes, analistas y equipos con documentación extensa.",
    outcome:
      "Cada respuesta va acompañada del fragmento que la respalda; si no hay evidencia, lo dice.",
    category: "ai",
    categoryLabel: "IA",
    stack: ["Python 3.12", "Recuperación (RAG)", "Indexado por fragmentos", "Evals automáticos"],
    liveUrl: "https://cortex-rag-agent-production.up.railway.app",
    repoUrl: "https://github.com/danieldiaz54/cortex-rag-agent",
    hosting: "Railway",
    testsLabel: "16 pruebas + evals",
    matrix: {
      paradigm: "Recuperación aumentada (RAG)",
      persistence: "Índice de fragmentos",
      consistency: "Respuesta anclada a fuente",
    },
    plate: {
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      ink: "#1E3A5F",
      muted: "#64748B",
      accent: "#B45309",
      displayFont: "Source Serif 4",
      bodyFont: "Atkinson Hyperlegible",
      displayVar: "--font-source-serif",
    },
    previewKind: "chat",
    tradeOffs: [
      {
        chosen: "Citas obligatorias y negarse sin evidencia",
        rejected: "Generación libre más fluida",
        because: "Una respuesta verificable vale más que una respuesta elocuente.",
        failureMode: "Preguntas fuera del corpus reciben “no encontrado” en lugar de una conjetura.",
      },
    ],
    flow: [
      "Subes un documento",
      "Se divide en fragmentos indexados",
      "Preguntas",
      "Se recuperan los fragmentos relevantes",
      "Respuesta + cita",
    ],
    evidence: [
      "Suite de evaluación ejecutable desde la interfaz",
      "Ingesta de documentos por API",
    ],
    retrospective:
      "Medir con evals desde el inicio cambió la conversación de “se ve bien” a una métrica reproducible.",
    nextEvolution: "Búsqueda híbrida (léxica + vectorial) con re-ranking.",
  },
  {
    slug: "ledgercore-distributed",
    inventory: "05",
    name: "LedgerCore",
    everydayName: "Billetera digital",
    oneLiner: "Transferencias que nunca cobran dos veces, ni con doble clic.",
    problem:
      "Un doble clic o una red inestable pueden duplicar una transferencia y cobrar dos veces.",
    audience: "Cualquier usuario de pagos digitales; equipos que construyen pagos.",
    outcome:
      "Llave de idempotencia por operación, reverso automático si falla la liquidación y contabilidad de doble partida.",
    category: "fintech",
    categoryLabel: "Fintech",
    stack: ["Python 3.12", "Saga orquestada", "Transactional Outbox", "Cola de mensajes muertos"],
    liveUrl: "https://ledgercore-distributed-production.up.railway.app",
    repoUrl: "https://github.com/danieldiaz54/ledgercore-distributed",
    hosting: "Railway",
    testsLabel: "34 pruebas",
    matrix: {
      paradigm: "Saga + Outbox + doble partida",
      persistence: "Libro contable append-only",
      consistency: "Eventual con compensación",
    },
    plate: {
      bg: "#F4F7F6",
      surface: "#FFFFFF",
      ink: "#064E3B",
      muted: "#4B6B61",
      accent: "#047857",
      displayFont: "Albert Sans",
      bodyFont: "JetBrains Mono",
      displayVar: "--font-albert",
    },
    previewKind: "wallet",
    tradeOffs: [
      {
        chosen: "Saga orquestada con pasos compensables",
        rejected: "Commit en dos fases (2PC)",
        because: "Ningún servicio queda bloqueado esperando a otro.",
        failureMode: "Durante unos instantes el saldo se muestra como “pendiente”.",
      },
    ],
    flow: [
      "Envías dinero con una llave única",
      "Débito reservado",
      "Liquidación",
      "Si falla: reverso automático",
      "Asientos que suman cero",
    ],
    evidence: [
      "Demo de doble clic: la segunda solicitud devuelve el mismo resultado",
      "Auditoría: la suma de todos los asientos siempre es 0",
    ],
    retrospective:
      "Hacer explícito el estado “pendiente” en la interfaz resolvió más dudas que cualquier optimización.",
    nextEvolution: "Conciliación diaria contra un extracto externo.",
  },
  {
    slug: "fieldnotes-mobile",
    inventory: "06",
    name: "FieldNotes",
    everydayName: "Notas de campo sin internet",
    oneLiner: "Registra datos sin señal y sincroniza al volver a tener conexión.",
    problem:
      "Técnicos en zonas sin cobertura pierden registros o los duplican al reconectarse.",
    audience: "Personal de campo: inspección, mantenimiento, investigación.",
    outcome:
      "Todo se guarda en el teléfono; al reconectar se sincroniza y los choques se resuelven en tres opciones claras.",
    category: "mobile",
    categoryLabel: "Móvil",
    stack: ["Python 3.12", "SQLite local", "API de sincronización", "Blueprint Expo"],
    liveUrl: "https://fieldnotes-mobile-production.up.railway.app",
    repoUrl: "https://github.com/danieldiaz54/fieldnotes-mobile",
    hosting: "Railway",
    testsLabel: "46 pruebas",
    matrix: {
      paradigm: "Offline-first + sincronización",
      persistence: "SQLite en dispositivo",
      consistency: "Convergente con resolución explícita",
    },
    plate: {
      bg: "#EFECE6",
      surface: "#FFFBEB",
      ink: "#292524",
      muted: "#78716C",
      accent: "#9A3412",
      displayFont: "Bitter",
      bodyFont: "Work Sans",
      displayVar: "--font-bitter",
    },
    previewKind: "phone",
    tradeOffs: [
      {
        chosen: "Resolución de conflictos explícita por la persona",
        rejected: "Última escritura gana (LWW)",
        because: "En registros de campo, perder un dato en silencio es inaceptable.",
        failureMode: "Si hay muchos choques, resolverlos uno a uno genera fricción.",
      },
    ],
    flow: [
      "Modo avión: escribes notas",
      "Se encolan localmente",
      "Reconectas",
      "Sincronización",
      "Choque: conservar mía, la del servidor o ambas",
    ],
    evidence: [
      "Simulador de teléfono con interruptor de modo avión",
      "Botón “Simular choque” que provoca un conflicto real",
    ],
    retrospective:
      "Diseñar primero el estado sin conexión simplificó todo el resto del flujo.",
    nextEvolution: "Sincronización en segundo plano con reintentos exponenciales.",
  },
];

export const SUPPORTING_REPO = {
  name: "CloudOps GitOps Platform",
  description:
    "Infraestructura como código, manifiestos GitOps y señales doradas que documentan cómo se operaría el ecosistema en Kubernetes.",
  repoUrl: "https://github.com/danieldiaz54/cloudops-gitops-platform",
} as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
