"use client";

import type { Project, TelemetryMap } from "@/types/project";

interface LivePulseRailProps {
  projects: readonly Project[];
  telemetry: TelemetryMap;
  pinging: boolean;
  onPingAll: () => void;
  onSelectProject: (slug: string) => void;
}

function dotClass(status: string | undefined): string {
  if (status === "live") {
    return "pulse-dot is-live";
  }
  if (status === "local") {
    return "pulse-dot is-local";
  }
  if (status === "degraded") {
    return "pulse-dot is-degraded";
  }
  return "pulse-dot";
}

function formatLatency(project: Project, telemetry: TelemetryMap): string {
  if (!project.healthUrl) {
    return "Local";
  }
  const entry = telemetry[project.slug];
  if (!entry || entry.status === "idle" || entry.status === "checking") {
    return "…";
  }
  if (entry.status === "live" && entry.latencyMs !== null) {
    return `${entry.latencyMs} ms`;
  }
  return entry.detail;
}

export default function LivePulseRail({
  projects,
  telemetry,
  pinging,
  onPingAll,
  onSelectProject,
}: LivePulseRailProps) {
  return (
    <div className="pulse-rail" aria-label="Telemetría en vivo de servicios desplegados">
      <div className="pulse-rail-head">
        <span className="mono">
          Pulso real en vivo · 5 servicios Railway (/api/v1/health) + 1 app local
        </span>
        <div className="pulse-actions">
          <button type="button" className="pulse-ping-btn" onClick={onPingAll} disabled={pinging}>
            {pinging ? "Sondeando…" : "Re-ping vivo"}
          </button>
        </div>
      </div>
      <div className="pulse-grid">
        {projects.map((project) => {
          const entry = telemetry[project.slug];
          const status = project.healthUrl ? entry?.status : "local";
          return (
            <button
              key={project.slug}
              type="button"
              className="pulse-pill"
              onClick={() => onSelectProject(project.slug)}
              title={`Abrir laboratorio de ${project.name}`}
            >
              <span className="pulse-pill-left">
                <span className={dotClass(status)} aria-hidden="true" />
                <span>{project.name}</span>
              </span>
              <span className="pulse-latency">{formatLatency(project, telemetry)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
