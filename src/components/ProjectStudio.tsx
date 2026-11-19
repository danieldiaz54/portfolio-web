"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { Project, TelemetryMap } from "@/types/project";
import MicroLabs from "@/components/MicroLabs";
import SignalDiagram from "@/components/SignalDiagram";

type StudioTabId = "try" | "how" | "eng";

interface ProjectStudioProps {
  project: Project;
  allProjects: readonly Project[];
  mode: "modal" | "page";
  telemetry?: TelemetryMap;
  onPingProject?: (slug: string) => void;
  onClose?: () => void;
  onNavigate?: (slug: string) => void;
}

export default function ProjectStudio({
  project,
  allProjects,
  mode,
  telemetry = {},
  onPingProject,
  onClose,
  onNavigate,
}: ProjectStudioProps) {
  const [tab, setTab] = useState<StudioTabId>("try");
  const [faultActive, setFaultActive] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string>(project.diagram.normalCaption);

  useEffect(() => {
    setTab("try");
    setFaultActive(false);
    setStatusNote(project.diagram.normalCaption);
  }, [project]);

  const idx = allProjects.findIndex((item) => item.slug === project.slug);
  const prevProject = allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(idx + 1) % allProjects.length];

  const labTheme = {
    "--p-bg": project.plate.bg,
    "--p-surface": project.plate.surface,
    "--p-ink": project.plate.ink,
    "--p-muted": project.plate.muted,
    "--p-accent": project.plate.accent,
    "--p-display": `var(${project.plate.displayVar}), "${project.plate.displayFont}", sans-serif`,
  } as CSSProperties;

  const entry = telemetry[project.slug];
  const healthSummary = !project.healthUrl
    ? "100 % local en el navegador · Sin servidor externo"
    : entry?.status === "live" && entry.latencyMs !== null
      ? `En vivo en ${project.hosting} · HTTP 200 · ${entry.latencyMs} ms`
      : entry?.status === "checking"
        ? `Comprobando ${project.hosting}…`
        : `Desplegado en ${project.hosting}`;

  const body = (
    <>
      <div className="studio-header">
        <div className="studio-header-title">
          <strong>{project.name}</strong>
          <span>{project.everydayName}</span>
        </div>
        <div className="studio-header-actions">
          {mode === "modal" ? (
            <Link className="studio-nav-btn" href={`/projects/${project.slug}`}>
              Vista dedicada ↗
            </Link>
          ) : (
            <Link className="studio-nav-btn" href="/#proyectos">
              ← Todos los proyectos
            </Link>
          )}
          {mode === "modal" && onClose ? (
            <button type="button" className="studio-nav-btn" onClick={onClose}>
              Cerrar (Esc)
            </button>
          ) : null}
        </div>
      </div>

      <div className="studio-tabs" role="tablist" aria-label="Capas de profundidad del proyecto">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "try"}
          className="studio-tab"
          onClick={() => setTab("try")}
        >
          Pruébalo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "how"}
          className="studio-tab"
          onClick={() => setTab("how")}
        >
          Cómo funciona
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "eng"}
          className="studio-tab"
          onClick={() => setTab("eng")}
        >
          Ingeniería y código
        </button>
      </div>

      <div className="studio-panel" style={labTheme}>
        {tab === "try" ? (
          <>
            <p className="studio-lead">{project.labPrompt}</p>
            <div className={`stage-lab ${project.previewKind === "kanban" ? "is-dark" : ""}`}>
              <MicroLabs
                key={project.slug}
                project={project}
                telemetry={entry}
                faultActive={faultActive}
                onFaultChange={(next, note) => {
                  setFaultActive(next);
                  setStatusNote(note);
                }}
              />
            </div>
            <div className="stage-preview-actions">
              <a
                className="btn btn-solid"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir app completa ↗
              </a>
              <button type="button" className="link-action" onClick={() => setTab("how")}>
                Ver diagrama y fallas →
              </button>
            </div>
          </>
        ) : null}

        {tab === "how" ? (
          <>
            <p className="studio-lead">
              <strong>El problema:</strong> {project.problem} ({project.audience})
            </p>
            <SignalDiagram
              diagram={project.diagram}
              accent={project.plate.accent}
              faultActive={faultActive}
              statusNote={statusNote}
              onToggleFault={() => {
                const next = !faultActive;
                setFaultActive(next);
                setStatusNote(next ? project.diagram.faultCaption : project.diagram.normalCaption);
              }}
            />
            {project.tradeOffs.map((tradeOff) => (
              <div className="tradeoff" key={tradeOff.chosen}>
                <div>
                  <span className="mono label">Qué elegí</span>
                  {tradeOff.chosen}
                </div>
                <div>
                  <span className="mono label">Qué descarté</span>
                  <s>{tradeOff.rejected}</s>
                </div>
                <div className="tradeoff-note">
                  <span className="mono label">Por qué y riesgo aceptado</span>
                  {tradeOff.because} {tradeOff.failureMode}
                </div>
              </div>
            ))}
            <ol className="flow-list">
              {project.flow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </>
        ) : null}

        {tab === "eng" ? (
          <>
            <div className="telemetry-banner">
              <span className="telemetry-status">
                <span
                  className={`live-dot ${project.healthUrl ? (entry?.status === "live" ? "is-live" : "is-degraded") : "is-local"}`}
                  aria-hidden="true"
                />
                {healthSummary}
              </span>
              {project.healthUrl && onPingProject ? (
                <button
                  type="button"
                  className="studio-nav-btn"
                  onClick={() => onPingProject(project.slug)}
                >
                  Comprobar ahora
                </button>
              ) : null}
            </div>

            <dl className="eng-specs">
              <div>
                <dt>Paradigma</dt>
                <dd>{project.matrix.paradigm}</dd>
              </div>
              <div>
                <dt>Persistencia</dt>
                <dd>{project.matrix.persistence}</dd>
              </div>
              <div>
                <dt>Consistencia</dt>
                <dd>{project.matrix.consistency}</dd>
              </div>
              <div>
                <dt>Pruebas</dt>
                <dd>{project.testsLabel}</dd>
              </div>
            </dl>

            <ul className="stack-list">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>

            <div className="retro-box">
              <h4>Retrospectiva</h4>
              <p>{project.retrospective}</p>
              <p>
                <strong>Siguiente evolución:</strong> {project.nextEvolution}
              </p>
            </div>

            <div className="stage-preview-actions">
              <a
                className="btn btn-solid"
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver código en GitHub ↗
              </a>
              <a
                className="link-action"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir despliegue en vivo ↗
              </a>
            </div>
          </>
        ) : null}
      </div>

      <div className="studio-footer">
        {mode === "modal" && onNavigate ? (
          <>
            <button
              type="button"
              className="studio-nav-btn"
              onClick={() => onNavigate(prevProject.slug)}
            >
              ← Anterior: {prevProject.name}
            </button>
            <button
              type="button"
              className="studio-nav-btn"
              onClick={() => onNavigate(nextProject.slug)}
            >
              Siguiente: {nextProject.name} →
            </button>
          </>
        ) : (
          <>
            <Link className="studio-nav-btn" href={`/projects/${prevProject.slug}`}>
              ← Anterior: {prevProject.name}
            </Link>
            <Link className="studio-nav-btn" href={`/projects/${nextProject.slug}`}>
              Siguiente: {nextProject.name} →
            </Link>
          </>
        )}
      </div>
    </>
  );

  if (mode === "page") {
    return (
      <div className="studio-page">
        <div className="shell">
          <div className="studio-panel-wrap">{body}</div>
        </div>
      </div>
    );
  }

  return body;
}
