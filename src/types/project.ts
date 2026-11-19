export type MarketArea =
  | "Full-Stack & Realtime"
  | "Applied AI & Agents"
  | "Distributed Systems"
  | "Cloud & DevOps"
  | "Mobile Offline-First";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  decision: string;
  rationale: string;
}

export interface ProjectCaseStudy {
  slug: string;
  title: string;
  tagline: string;
  area: MarketArea;
  architecture: string;
  phase: string;
  problem: string;
  solution: string;
  techStack: string[];
  metrics: ProjectMetric[];
  mermaidDiagram: string;
  adrHighlights: ArchitectureDecision[];
  repoUrl: string;
  liveUrl: string;
}
