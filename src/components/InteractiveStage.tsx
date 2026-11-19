"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Project, TelemetryMap } from "@/types/project";
import MicroLabs from "@/components/MicroLabs";
import SignalDiagram from "@/components/SignalDiagram";

interface InteractiveStageProps {
  projects: readonly Project[];
  activeSlug: string;
  telemetry: TelemetryMap;
  onSelectSlug: (slug: string) => void;
  onOpenCase: (slug: string) => void;
}

export default function InteractiveStage({
  projects,
  activeSlug,
  telemetry,
  onSelectSlug,
  onOpenCase,
}: InteractiveStageProps) {
  const active = projects.find((project) => project.slug === activeSlug) ?? projects[0];
  const [faultActive, setFaultActive] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string>(active.diagram.normalCaption);

  useEffect(() => {
    setFaultActive(false);
    setStatusNote(active.diagram.normalCaption);
  }, [active]);

  const handleFaultChange = (nextFault: boolean, note: string) => {
    setFaultActive(nextFault);
    setStatusNote(note);
  };

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (index + step + projects.length) % projects.length;
    onSelectSlug(projects[nextIdx].slug);
  };

  const isDarkLab = active.previewKind === "kanban";
  const stageVars = {
    "--stage-accent": active.plate.accent,
    "--p-bg": active.plate.bg,
    "--p-surface": active.plate.surface,
    "--p-ink": active.plate.ink,
    "--p-muted": active.plate.muted,
    "--p-accent": active.plate.accent,
    "--p-display": `var(${active.plate.displayVar}), "${active.plate.displayFont}", sans-serif`,
  } as CSSProperties;

  const entry = telemetry[active.slug];
  const badgeText = !active.healthUrl
    ? "Ejecución local · 0 B a red"
    : entry?.status === "live" && entry.latencyMs !== null
      ? `Railway 200 OK · ${entry.latencyMs} ms`
      : entry?.detail ?? "Comprobando salud…";

  const firstTrade = active.tradeOffs[0];

  return (
    <div style={stageVars}>
      <div className="stage-rail" role="tablist" aria-label="Seleccionar laboratorio interactivo">
        {projects.map((project, idx) => (
          <button
            key={project.slug}
            type="button"
            role="tab"
            className="stage-tab"
            aria-selected={project.slug === active.slug}
            style={{ "--tab-accent": project.plate.accent } as CSSProperties}
            onClick={() => onSelectSlug(project.slug)}
            onKeyDown={(event) => handleTabKey(event, idx)}
          >
            <div className="stage-tab-kicker mono">
              <span>N.º {project.inventory}</span>
              <span>{project.categoryLabel}</span>
            </div>
            <strong>{project.name}</strong>
            <span className="stage-sub">{project.everydayName}</span>
          </button>
        ))}
      </div>

      <div className="stage-shell" role="tabpanel" aria-label={`Laboratorio de ${active.name}`}>
        <div className="stage-banner">
          <div>
            <span className="mono">
              Sala {active.inventory} · {active.matrix.paradigm}
            </span>
            <h3>
              {active.name} — {active.everydayName}
            </h3>
            <p>{active.labPrompt}</p>
          </div>
          <div className="stage-banner-right">
            <span className="stage-telemetry-badge">
              <span
                className={`pulse-dot ${active.healthUrl ? (entry?.status === "live" ? "is-live" : "is-degraded") : "is-local"}`}
                aria-hidden="true"
              />
              {badgeText}
            </span>
          </div>
        </div>

        <div className="stage-grid">
          <div className={`stage-lab ${isDarkLab ? "is-dark" : ""}`}>
            <MicroLabs
              key={active.slug}
              project={active}
              telemetry={entry}
              faultActive={faultActive}
              onFaultChange={handleFaultChange}
            />
          </div>

          <div className="stage-arch">
            <SignalDiagram
              diagram={active.diagram}
              accent={active.plate.accent}
              faultActive={faultActive}
              statusNote={statusNote}
              onToggleFault={() => {
                const next = !faultActive;
                handleFaultChange(
                  next,
                  next ? active.diagram.faultCaption : active.diagram.normalCaption,
                );
              }}
            />

            {firstTrade ? (
              <div className="stage-decision">
                <div className="stage-decision-grid">
                  <div>
                    <span className="mono label">Elegido</span>
                    {firstTrade.chosen}
                  </div>
                  <div>
                    <span className="mono label">Descartado</span>
                    <s>{firstTrade.rejected}</s>
                  </div>
                </div>
                <div className="exhibit-actions">
                  <button
                    type="button"
                    className="link-case"
                    onClick={() => onOpenCase(active.slug)}
                  >
                    Leer ficha de caso →
                  </button>
                  <a
                    className="link-live"
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir en vivo ↗
                  </a>
                  <a
                    className="link-plain"
                    href={active.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Código
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
