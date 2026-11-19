"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import type { Project, TelemetryMap } from "@/types/project";
import PreviewPlate from "@/components/PreviewPlate";

interface ProjectIndexProps {
  projects: readonly Project[];
  selectedSlug: string;
  telemetry: TelemetryMap;
  onSelect: (slug: string) => void;
  onOpenStudio: (slug: string) => void;
}

function dotClass(project: Project, telemetry: TelemetryMap): string {
  if (!project.healthUrl) {
    return "live-dot is-local";
  }
  const entry = telemetry[project.slug];
  if (!entry || entry.status === "checking" || entry.status === "idle") {
    return "live-dot";
  }
  return entry.status === "live" ? "live-dot is-live" : "live-dot is-degraded";
}

export default function ProjectIndex({
  projects,
  selectedSlug,
  telemetry,
  onSelect,
  onOpenStudio,
}: ProjectIndexProps) {
  const active = projects.find((project) => project.slug === selectedSlug) ?? projects[0];

  const handleRowKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = projects[(index + step + projects.length) % projects.length];
    onSelect(next.slug);
  };

  const stageStyle = {
    "--stage-accent": active.plate.accent,
  } as CSSProperties;

  return (
    <div className="index-layout">
      <div className="project-index" role="listbox" aria-label="Índice de seis aplicaciones">
        {projects.map((project, idx) => {
          const isCurrent = project.slug === active.slug;
          return (
            <button
              key={project.slug}
              type="button"
              role="option"
              aria-selected={isCurrent}
              aria-current={isCurrent ? "true" : undefined}
              className="index-row"
              style={{ "--row-accent": project.plate.accent } as CSSProperties}
              onClick={() => onSelect(project.slug)}
              onKeyDown={(event) => handleRowKey(event, idx)}
            >
              <div className="index-row-top">
                <span className="index-row-name">
                  <span
                    className="swatch"
                    style={{ background: project.plate.accent }}
                    aria-hidden="true"
                  />
                  <span>{project.name}</span>
                  <span className="index-row-everyday">· {project.everydayName}</span>
                </span>
                <span
                  className={dotClass(project, telemetry)}
                  aria-label={project.healthUrl ? "Servicio en línea" : "Ejecución local"}
                />
              </div>
              <p className="index-row-desc">{project.oneLiner}</p>
            </button>
          );
        })}
      </div>

      <article
        className="project-stage-preview"
        style={stageStyle}
        aria-live="polite"
        aria-label={`Vista previa de ${active.name}`}
      >
        <div className="stage-preview-frame">
          <PreviewPlate project={active} />
        </div>
        <div className="stage-preview-body">
          <div className="stage-preview-meta">
            <span>
              {active.categoryLabel} · {active.matrix.paradigm}
            </span>
            <span>{active.testsLabel}</span>
          </div>
          <h3>{active.name}</h3>
          <p className="stage-preview-problem">{active.problem}</p>
          <p className="stage-preview-outcome">{active.outcome}</p>
          <div className="stage-preview-actions">
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => onOpenStudio(active.slug)}
            >
              Probar y ver cómo funciona
            </button>
            <a
              className="link-action"
              href={active.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir app en vivo ↗
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
