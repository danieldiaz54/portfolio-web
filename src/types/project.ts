export type ProjectCategory =
  | "web"
  | "realtime"
  | "ai"
  | "fintech"
  | "mobile"
  | "data";

export type PreviewKind =
  | "pdf"
  | "catalog"
  | "kanban"
  | "chat"
  | "wallet"
  | "phone";

export type Hosting = "GitHub Pages" | "Railway";

export type HeroEffectId =
  | "fluted-glass"
  | "silk-folds"
  | "grain-gradient"
  | "grid-pulse"
  | "contour-lines"
  | "off";

export type TelemetryStatus = "idle" | "checking" | "live" | "local" | "degraded";

export interface TelemetryEntry {
  status: TelemetryStatus;
  latencyMs: number | null;
  detail: string;
}

export type TelemetryMap = Record<string, TelemetryEntry>;

export interface DiagramNode {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  kind: "client" | "core" | "store" | "guard";
}

export interface DiagramEdge {
  from: string;
  to: string;
  label: string;
  mode: "normal" | "fault";
}

export interface DiagramSpec {
  title: string;
  normalCaption: string;
  faultCaption: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
}

export interface PlateTheme {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  displayFont: string;
  bodyFont: string;
  displayVar: string;
}

export interface TradeOff {
  chosen: string;
  rejected: string;
  because: string;
  failureMode: string;
}

export interface ParadigmRow {
  paradigm: string;
  persistence: string;
  consistency: string;
}

export interface Project {
  slug: string;
  inventory: string;
  name: string;
  everydayName: string;
  oneLiner: string;
  problem: string;
  audience: string;
  outcome: string;
  category: ProjectCategory;
  categoryLabel: string;
  stack: readonly string[];
  liveUrl: string;
  healthUrl: string | null;
  repoUrl: string;
  hosting: Hosting;
  testsLabel: string;
  labPrompt: string;
  matrix: ParadigmRow;
  plate: PlateTheme;
  previewKind: PreviewKind;
  diagram: DiagramSpec;
  tradeOffs: readonly TradeOff[];
  flow: readonly string[];
  evidence: readonly string[];
  retrospective: string;
  nextEvolution: string;
}

export interface CategoryFilter {
  id: ProjectCategory | "all";
  label: string;
}
