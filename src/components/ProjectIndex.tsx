"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project, TelemetryMap } from "@/types/project";
import PreviewPlate from "@/components/PreviewPlate";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

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
  const { scrollTo } = useSmoothScroll();
  const pinRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const onSelectRef = useRef(onSelect);
  const lastIdxRef = useRef<number>(0);
  const clickLockUntil = useRef<number>(0);
  const [cursorActive, setCursorActive] = useState<boolean>(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 32, mass: 0.35 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 32, mass: 0.35 });

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const tiltX = useSpring(rawRotateX, { stiffness: 260, damping: 24, mass: 0.45 });
  const tiltY = useSpring(rawRotateY, { stiffness: 260, damping: 24, mass: 0.45 });

  const activeIndex = Math.max(
    0,
    projects.findIndex((project) => project.slug === selectedSlug),
  );
  const active = projects[activeIndex] ?? projects[0];

  useEffect(() => {
    lastIdxRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const pinEl = pinRef.current;
    if (!pinEl || typeof window === "undefined") {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${projects.length * 460}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          pinEl.style.setProperty("--scrub-progress", self.progress.toFixed(4));
          pinEl.style.setProperty("--orb-shift", `${((self.progress - 0.5) * 80).toFixed(1)}px`);
          const nextIdx = Math.min(
            projects.length - 1,
            Math.max(0, Math.floor(self.progress * projects.length)),
          );
          if (nextIdx !== lastIdxRef.current && Date.now() > clickLockUntil.current) {
            lastIdxRef.current = nextIdx;
            onSelectRef.current(projects[nextIdx].slug);
          }
        },
      });
      triggerRef.current = st;

      return () => {
        triggerRef.current = null;
        st.kill();
      };
    });

    return () => {
      triggerRef.current = null;
      mm.revert();
    };
  }, [projects]);

  const selectProjectAt = (idx: number, syncScroll: boolean) => {
    const safeIdx = Math.min(projects.length - 1, Math.max(0, idx));
    const targetProject = projects[safeIdx];
    lastIdxRef.current = safeIdx;
    clickLockUntil.current = Date.now() + 900;
    onSelect(targetProject.slug);

    if (syncScroll && triggerRef.current) {
      const st = triggerRef.current;
      const targetY = st.start + ((safeIdx + 0.35) / projects.length) * (st.end - st.start);
      scrollTo(targetY, { duration: 0.72 });
    }
  };

  const handleRowKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 1 : -1;
    const nextIdx = (index + step + projects.length) % projects.length;
    selectProjectAt(nextIdx, true);
  };

  const handleStageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    cursorX.set(event.clientX - rect.left + 12);
    cursorY.set(event.clientY - rect.top - 18);

    rawRotateY.set((relX - 0.5) * 9);
    rawRotateX.set((0.5 - relY) * 7.5);
    el.style.setProperty("--sheen-x", `${(relX * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${(relY * 100).toFixed(1)}%`);
  };

  const handleStageMouseLeave = () => {
    setCursorActive(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const stageStyle = {
    "--stage-accent": active.plate.accent,
    "--stage-bg": active.plate.bg,
  } as CSSProperties;

  return (
    <div ref={pinRef} className="projects-pin-stage" style={stageStyle}>
      <div className="shell projects-pin-shell">
        <div className="section-intro projects-pin-intro">
          <div className="projects-intro-head">
            <h2 id="proyectos-title">Proyectos</h2>
            <span className="mono projects-counter" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <p>
            Desliza o elige cualquiera para recorrer las seis arquitecturas y abre su estudio para
            probarlo en vivo.
          </p>
        </div>

        <div className="index-layout">
          <div className="project-index-wrap">
            <div className="scrub-track" aria-hidden="true">
              <div className="scrub-fill" />
            </div>

            <div className="project-index" role="listbox" aria-label="Índice de seis aplicaciones">
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
                      onClick={() => selectProjectAt(idx, true)}
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
          </div>

          <article
            className="project-stage-preview"
            aria-live="polite"
            aria-label={`Vista previa de ${active.name}`}
          >
            <div className="stage-segments" aria-label="Progreso entre proyectos">
              {projects.map((project, idx) => (
                <button
                  key={project.slug}
                  type="button"
                  className={`stage-segment ${idx <= activeIndex ? "is-filled" : ""}`}
                  aria-label={`Ir a ${project.name}`}
                  onClick={() => selectProjectAt(idx, true)}
                />
              ))}
            </div>

            <div
              className="stage-preview-frame"
              onMouseEnter={() => setCursorActive(true)}
              onMouseLeave={handleStageMouseLeave}
              onMouseMove={handleStageMouseMove}
              onClick={() => onOpenStudio(active.slug)}
            >
              <div className="stage-ambient-orb" aria-hidden="true" />
              <div className="stage-specular" aria-hidden="true" />

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

              <motion.div
                className="stage-preview-tilt"
                style={{
                  rotateX: tiltX,
                  rotateY: tiltY,
                  transformPerspective: 1100,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.slug}
                    className="stage-preview-plate-wrap"
                    initial={{
                      opacity: 0,
                      y: 22,
                      scale: 0.95,
                      clipPath: "inset(8% 0% 0% 0% round 12px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      clipPath: "inset(0% 0% 0% 0% round 12px)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -16,
                      scale: 0.96,
                      clipPath: "inset(0% 0% 8% 0% round 12px)",
                    }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <PreviewPlate project={active} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                className="stage-preview-body"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
      </div>
    </div>
  );
}
