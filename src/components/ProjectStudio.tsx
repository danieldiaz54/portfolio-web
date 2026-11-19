"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, RefreshCw, X } from "lucide-react";
import type { Project, TelemetryMap } from "@/types/project";
import MicroLabs from "@/components/MicroLabs";
import SignalDiagram from "@/components/SignalDiagram";

type StudioTabId = "try" | "how" | "eng";

const STUDIO_TABS: readonly { id: StudioTabId; label: string }[] = [
  { id: "try", label: "Pruébalo" },
  { id: "how", label: "Cómo funciona" },
  { id: "eng", label: "Ingeniería y código" },
];

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
              <span>Vista dedicada</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          ) : (
            <Link className="studio-nav-btn" href="/#proyectos">
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Todos los proyectos</span>
            </Link>
          )}
          {mode === "modal" && onClose ? (
            <button type="button" className="studio-nav-btn" onClick={onClose}>
              <span>Cerrar (Esc)</span>
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="studio-tabs" role="tablist" aria-label="Capas de profundidad del proyecto">
        {STUDIO_TABS.map((item) => {
          const isSelected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className="studio-tab"
              onClick={() => setTab(item.id)}
            >
              {isSelected ? (
                <motion.span
                  layoutId="studio-tab-line"
                  className="studio-tab-line"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              ) : null}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="studio-panel" style={labTheme}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${project.slug}-${tab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
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
                    <span>Abrir app completa</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <button type="button" className="link-action" onClick={() => setTab("how")}>
                    <span>Ver diagrama y fallas</span>
                    <ArrowRight size={15} aria-hidden="true" />
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
                    setStatusNote(
                      next ? project.diagram.faultCaption : project.diagram.normalCaption,
                    );
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
                      <RefreshCw size={13} aria-hidden="true" />
                      <span>Comprobar ahora</span>
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
                    <span>Ver código en GitHub</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <a
                    className="link-action"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Abrir despliegue en vivo</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="studio-footer">
        {mode === "modal" && onNavigate ? (
          <>
            <button
              type="button"
              className="studio-nav-btn"
              onClick={() => onNavigate(prevProject.slug)}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Anterior: {prevProject.name}</span>
            </button>
            <button
              type="button"
              className="studio-nav-btn"
              onClick={() => onNavigate(nextProject.slug)}
            >
              <span>Siguiente: {nextProject.name}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <Link className="studio-nav-btn" href={`/projects/${prevProject.slug}`}>
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Anterior: {prevProject.name}</span>
            </Link>
            <Link className="studio-nav-btn" href={`/projects/${nextProject.slug}`}>
              <span>Siguiente: {nextProject.name}</span>
              <ArrowRight size={14} aria-hidden="true" />
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
