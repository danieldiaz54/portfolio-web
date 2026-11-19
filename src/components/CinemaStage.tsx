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
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project, TelemetryMap } from "@/types/project";
import PreviewPlate from "@/components/PreviewPlate";
import MagneticButton from "@/components/MagneticButton";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

interface CinemaStageProps {
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

export default function CinemaStage({
  projects,
  selectedSlug,
  telemetry,
  onSelect,
  onOpenStudio,
}: CinemaStageProps) {
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
  const tiltX = useSpring(rawRotateX, { stiffness: 250, damping: 24, mass: 0.45 });
  const tiltY = useSpring(rawRotateY, { stiffness: 250, damping: 24, mass: 0.45 });

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
        pinSpacing: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          pinEl.style.setProperty("--scrub-progress", self.progress.toFixed(4));
          const nextIdx = Math.min(
            projects.length - 1,
            Math.max(0, Math.floor(self.progress * projects.length * 0.9999)),
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

  const selectChapterAt = (idx: number, syncScroll: boolean) => {
    const safeIdx = Math.min(projects.length - 1, Math.max(0, idx));
    const targetProject = projects[safeIdx];
    lastIdxRef.current = safeIdx;
    clickLockUntil.current = Date.now() + 900;
    onSelect(targetProject.slug);

    if (syncScroll && triggerRef.current) {
      const st = triggerRef.current;
      const targetY =
        safeIdx === 0
          ? st.start + 12
          : st.start + ((safeIdx + 0.35) / projects.length) * (st.end - st.start);
      scrollTo(targetY, { duration: 0.7 });
    }
  };

  const handleFilmstripKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }
    event.preventDefault();
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIdx = (index + step + projects.length) % projects.length;
    selectChapterAt(nextIdx, true);
  };

  const handleProjectionMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    cursorX.set(event.clientX - rect.left + 12);
    cursorY.set(event.clientY - rect.top - 18);

    rawRotateY.set((relX - 0.5) * 9.5);
    rawRotateX.set((0.5 - relY) * 8);
    el.style.setProperty("--sheen-x", `${(relX * 100).toFixed(1)}%`);
    el.style.setProperty("--sheen-y", `${(relY * 100).toFixed(1)}%`);
  };

  const handleProjectionLeave = () => {
    setCursorActive(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const stageStyle = {
    "--stage-accent": active.plate.accent,
  } as CSSProperties;

  return (
    <>
      <div className="cinema-stage-desktop" style={stageStyle}>
        <div ref={pinRef} className="cinema-stage">
          <div className="shell cinema-stage-shell">
            <div className="cinema-stage-top">
              <span className="mono cinema-chapter-kicker">
                <span className="projects-counter" aria-live="polite">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <span>·</span>
                <span>
                  {active.categoryLabel} · {active.matrix.paradigm}
                </span>
              </span>
              <span className="mono cinema-chapter-meta">
                <span
                  className={dotClass(active, telemetry)}
                  aria-label={active.healthUrl ? "Servicio en línea" : "Ejecución local"}
                />
                <span>{active.testsLabel}</span>
              </span>
            </div>

            <div className="cinema-stage-grid">
              <motion.div
                key={active.slug}
                className="cinema-editorial-copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="cinema-everyday-name">{active.everydayName}</p>
                <h2 id="proyectos-title" className="cinema-project-title">
                  {active.name}
                </h2>
                <p className="cinema-problem">{active.problem}</p>
                <p className="cinema-outcome">{active.outcome}</p>

                <div className="cinema-actions">
                  <MagneticButton>
                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={() => onOpenStudio(active.slug)}
                    >
                      Probar y ver cómo funciona
                    </button>
                  </MagneticButton>
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

              <div
                className="cinema-projection"
                onMouseEnter={() => setCursorActive(true)}
                onMouseLeave={handleProjectionLeave}
                onMouseMove={handleProjectionMove}
                onClick={() => onOpenStudio(active.slug)}
              >
                <div className="projection-glow" aria-hidden="true" />
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
                    transformPerspective: 1200,
                  }}
                >
                  <motion.div
                    key={active.slug}
                    className="cinema-plate-float"
                    initial={{ opacity: 0, y: 14, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="projection-specular" aria-hidden="true" />
                    <PreviewPlate project={active} />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <div className="filmstrip-wrap">
              <div className="filmstrip-rail" aria-hidden="true">
                <div className="filmstrip-laser" />
              </div>
              <div
                className="filmstrip"
                role="tablist"
                aria-label="Capítulos de los seis productos"
              >
                {projects.map((project, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={project.slug}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-current={isCurrent ? "true" : undefined}
                      className={`filmstrip-item ${isCurrent ? "is-active" : ""}`}
                      onClick={() => selectChapterAt(idx, true)}
                      onKeyDown={(event) => handleFilmstripKey(event, idx)}
                    >
                      {isCurrent ? (
                        <motion.span
                          layoutId="filmstrip-active"
                          className="filmstrip-active-bar"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="filmstrip-item-head">
                        <span className={dotClass(project, telemetry)} aria-hidden="true" />
                        <span className="filmstrip-name">{project.name}</span>
                      </span>
                      <span className="filmstrip-sub">{project.everydayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cinema-mobile-reel">
        <div className="shell">
          <div className="cinema-mobile-head">
            <h2 className="cinema-mobile-heading">Obras en vivo</h2>
            <p>Seis productos reales sin cajas ni adornos: toca cualquiera para abrir su estudio.</p>
          </div>
          {projects.map((project, idx) => (
            <article
              key={project.slug}
              className="cinema-mobile-chapter"
              style={{ "--stage-accent": project.plate.accent } as CSSProperties}
            >
              <div className="cinema-mobile-meta mono">
                <span>
                  {String(idx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <span>{project.categoryLabel}</span>
                <span className={dotClass(project, telemetry)} aria-hidden="true" />
              </div>
              <h3 className="cinema-mobile-title">{project.name}</h3>
              <p className="cinema-mobile-sub">{project.everydayName}</p>
              <div className="cinema-mobile-plate" onClick={() => onOpenStudio(project.slug)}>
                <PreviewPlate project={project} />
              </div>
              <p className="cinema-problem">{project.problem}</p>
              <p className="cinema-outcome">{project.outcome}</p>
              <div className="cinema-actions">
                <button
                  type="button"
                  className="btn btn-solid"
                  onClick={() => onOpenStudio(project.slug)}
                >
                  Probar y ver cómo funciona
                </button>
                <a
                  className="link-action"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Abrir app en vivo</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
