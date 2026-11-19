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
  repoUrl: string;
  hosting: Hosting;
  testsLabel: string;
  matrix: ParadigmRow;
  plate: PlateTheme;
  previewKind: PreviewKind;
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
