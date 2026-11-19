"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project, TelemetryMap } from "@/types/project";
import PreviewPlate from "@/components/PreviewPlate";

gsap.registerPlugin(ScrollTrigger);

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
  const listRef = useRef<HTMLDivElement>(null);
  const pointerLockUntil = useRef<number>(0);
  const [cursorActive, setCursorActive] = useState<boolean>(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 32, mass: 0.35 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 32, mass: 0.35 });

  const active = projects.find((project) => project.slug === selectedSlug) ?? projects[0];

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof window === "undefined") {
      return undefined;
    }
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 920px)").matches;
    if (reduced || !isDesktop) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const rows = list.querySelectorAll<HTMLElement>("[data-slug]");
      rows.forEach((row) => {
        const slug = row.dataset.slug;
        if (!slug) {
          return;
        }
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => {
            if (Date.now() > pointerLockUntil.current) {
              onSelect(slug);
            }
          },
          onEnterBack: () => {
            if (Date.now() > pointerLockUntil.current) {
              onSelect(slug);
            }
          },
        });
      });
    }, list);

    return () => ctx.revert();
  }, [onSelect]);

  const handleRowKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    pointerLockUntil.current = Date.now() + 900;
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = projects[(index + step + projects.length) % projects.length];
    onSelect(next.slug);
  };

  const handleManualSelect = (slug: string) => {
    pointerLockUntil.current = Date.now() + 900;
    onSelect(slug);
  };

  const handleStageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - rect.left + 12);
    cursorY.set(event.clientY - rect.top - 18);
  };

  const stageStyle = {
    "--stage-accent": active.plate.accent,
    "--stage-bg": active.plate.bg,
  } as CSSProperties;

  return (
    <div className="index-layout">
      <div
        ref={listRef}
        className="project-index"
        role="listbox"
        aria-label="Índice de seis aplicaciones"
      >
        {projects.map((project, idx) => {
          const isCurrent = project.slug === active.slug;
          return (
            <div key={project.slug} className="index-row-wrap" data-slug={project.slug}>
              {isCurrent ? (
                <motion.div
                  layoutId="active-index-pill"
                  className="active-index-pill"
                  transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  aria-hidden="true"
                />
              ) : null}
              <button
                type="button"
                role="option"
                aria-selected={isCurrent}
                aria-current={isCurrent ? "true" : undefined}
                className="index-row"
                style={{ "--row-accent": project.plate.accent } as CSSProperties}
                onMouseEnter={() => handleManualSelect(project.slug)}
                onClick={() => handleManualSelect(project.slug)}
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
            </div>
          );
        })}
      </div>

      <article
        className="project-stage-preview"
        style={stageStyle}
        aria-live="polite"
        aria-label={`Vista previa de ${active.name}`}
      >
        <div
          className="stage-preview-frame"
          onMouseEnter={() => setCursorActive(true)}
          onMouseLeave={() => setCursorActive(false)}
          onMouseMove={handleStageMouseMove}
          onClick={() => onOpenStudio(active.slug)}
        >
          <motion.div
            className="stage-cursor-pill"
            style={{ x: springX, y: springY }}
            animate={{ opacity: cursorActive ? 1 : 0, scale: cursorActive ? 1 : 0.9 }}
            transition={{ duration: 0.16 }}
            aria-hidden="true"
          >
            <span>Explorar estudio</span>
            <ArrowUpRight size={13} />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              className="stage-preview-plate-wrap"
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <PreviewPlate project={active} />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            className="stage-preview-body"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
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
                <span>Abrir app en vivo</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </article>
    </div>
  );
}
