"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { HeroEffectId, Project, TelemetryEntry, TelemetryMap } from "@/types/project";
import { OWNER, PROJECTS, SUPPORTING_REPO } from "@/data/projects";
import Navbar, { type ActiveSectionId } from "@/components/Navbar";
import FixedBackdrop from "@/components/FixedBackdrop";
import CinemaStage from "@/components/CinemaStage";
import ProjectStudio from "@/components/ProjectStudio";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import MagneticButton from "@/components/MagneticButton";
import KineticManifesto from "@/components/KineticManifesto";
import EditorialMethod, { type CriterionItem } from "@/components/EditorialMethod";
import CinemaFinale from "@/components/CinemaFinale";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const HERO_TITLE_WORDS = ["Software", "claro", "para", "usar,", "sólido", "por", "dentro."];

const RAW_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const NORMALIZED_BASE_PATH =
  RAW_BASE_PATH && RAW_BASE_PATH !== "/" ? RAW_BASE_PATH.replace(/\/$/, "") : "";
const PROFILE_PORTRAIT_SRC = `${NORMALIZED_BASE_PATH}/images/daniel-diaz.jpg`;

const CRITERIA: readonly CriterionItem[] = [
  {
    id: "human",
    title: "Primero la persona, después la arquitectura",
    text: "Si alguien no entiende para qué sirve una aplicación en los primeros cinco segundos, la ingeniería de respaldo no importa. Cada proyecto resuelve un problema cotidiano real antes de hablar de patrones.",
  },
  {
    id: "spec",
    title: "Especificar y probar antes de publicar",
    text: "Cada repositorio separa el dominio puro de la infraestructura y define contratos escritos antes de escribir código. Las ramas se integran por dev y solo llegan a producción con CI en verde.",
  },
  {
    id: "ops",
    title: "Operación pensada para producción",
    text: "Cinco servicios viven en contenedores sin privilegios sobre Railway, uno corre 100 % en el navegador y el repositorio complementario CloudOps GitOps Platform documenta su despliegue en Kubernetes.",
  },
];

async function probeService(project: Project): Promise<TelemetryEntry> {
  if (!project.healthUrl) {
    return { status: "local", latencyMs: 0, detail: "Browser local" };
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);
  const start = performance.now();
  try {
    const res = await fetch(project.healthUrl, {
      mode: "cors",
      cache: "no-store",
      signal: controller.signal,
    });
    const latency = Math.max(1, Math.round(performance.now() - start));
    return res.ok
      ? { status: "live", latencyMs: latency, detail: "200 OK" }
      : { status: "degraded", latencyMs: latency, detail: `HTTP ${res.status}` };
  } catch {
    return { status: "degraded", latencyMs: null, detail: "Sin respuesta" };
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function PortfolioApp() {
  const { scrollTo, stop, start } = useSmoothScroll();
  const mainRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);

  const [heroEffect, setHeroEffect] = useState<HeroEffectId>("prism-dispersion");
  const [activeSection, setActiveSection] = useState<ActiveSectionId>("hero");
  const [selectedSlug, setSelectedSlug] = useState<string>(PROJECTS[0].slug);
  const [studioSlug, setStudioSlug] = useState<string | null>(null);
  const [cmdkOpen, setCmdkOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryMap>({});

  const pingAll = useCallback(async () => {
    const results = await Promise.all(
      PROJECTS.map(async (project) => [project.slug, await probeService(project)] as const),
    );
    setTelemetry(Object.fromEntries(results));
  }, []);

  const pingOne = useCallback(async (slug: string) => {
    const project = PROJECTS.find((item) => item.slug === slug);
    if (!project) {
      return;
    }
    setTelemetry((prev) => ({
      ...prev,
      [slug]: { status: "checking", latencyMs: null, detail: "Midiendo…" },
    }));
    const entry = await probeService(project);
    setTelemetry((prev) => ({ ...prev, [slug]: entry }));
  }, []);

  useEffect(() => {
    void pingAll();
  }, [pingAll]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const hash = window.location.hash;
    let hashFrame = 0;
    if (hash.startsWith("#estudio-")) {
      const slug = hash.slice("#estudio-".length);
      if (PROJECTS.some((item) => item.slug === slug)) {
        hashFrame = window.requestAnimationFrame(() => {
          setSelectedSlug(slug);
          setStudioSlug(slug);
        });
      }
    }
    const onGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCmdkOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => {
      if (hashFrame) {
        window.cancelAnimationFrame(hashFrame);
      }
      window.removeEventListener("keydown", onGlobalKey);
    };
  }, []);

  // Entrada tipográfica 3D inicial de Hero
  useEffect(() => {
    const scope = heroInnerRef.current;
    if (!scope || typeof window === "undefined") {
      return undefined;
    }
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const words = scope.querySelectorAll<HTMLElement>(".hero-word-inner");
      const subElements = scope.querySelectorAll<HTMLElement>(".hero-thesis, .hero-actions");
      gsap.fromTo(
        words,
        { yPercent: 115, rotateX: 20, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.048,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
      gsap.fromTo(
        subElements,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.68,
          delay: 0.22,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
      const portraitEl = scope.querySelector<HTMLElement>(".hero-portrait");
      if (portraitEl) {
        gsap.fromTo(
          portraitEl,
          { y: 22, opacity: 0, clipPath: "inset(10% 0% 0% 0% round 18px)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            duration: 0.9,
            delay: 0.14,
            ease: "power3.out",
            clearProps: "transform,opacity,clipPath",
          },
        );
      }
    }, scope);

    return () => ctx.revert();
  }, []);

  // Transición fluida sin pin en Hero + rastreo exacto de sección activa
  useEffect(() => {
    const heroEl = heroSectionRef.current;
    const heroInner = heroInnerRef.current;
    const mainEl = mainRef.current;
    if (!heroEl || !heroInner || !mainEl || typeof window === "undefined") {
      return undefined;
    }

    const cueEl = heroEl.querySelector<HTMLElement>(".hero-scroll-cue");
    const mm = gsap.matchMedia();

    mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      heroTl.to(
        heroInner,
        {
          y: -44,
          scale: 0.96,
          opacity: 0.08,
          ease: "none",
        },
        0,
      );

      if (cueEl) {
        heroTl.to(
          cueEl,
          {
            opacity: 0,
            y: 12,
            duration: 0.3,
            ease: "none",
          },
          0,
        );
      }

      const portraitEl = heroInner.querySelector<HTMLElement>(".hero-portrait");
      if (portraitEl) {
        heroTl.to(
          portraitEl,
          {
            y: -18,
            ease: "none",
          },
          0,
        );
      }

      return () => {
        heroTl.kill();
      };
    });

    const ctx = gsap.context(() => {
      const sectionIds: readonly Exclude<ActiveSectionId, "hero">[] = [
        "proyectos",
        "criterio",
        "contacto",
      ];
      sectionIds.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (!el) {
          return;
        }
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          invalidateOnRefresh: true,
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
          onLeaveBack: idx === 0 ? () => setActiveSection("hero") : undefined,
        });
      });
    }, mainEl);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const studioProject = PROJECTS.find((project) => project.slug === studioSlug) ?? null;
  const anyModalOpen = Boolean(studioProject) || cmdkOpen;

  // Congela Lenis, bloquea el scroll nativo vía clase root y detiene fugas de wheel fuera o en límites del modal
  useEffect(() => {
    if (!anyModalOpen) {
      return undefined;
    }
    stop();
    const root = document.documentElement;
    root.classList.add("is-modal-open");

    const handleModalWheel = (event: WheelEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const matched = target?.closest(".studio-sheet, .cmdk-list");
      const container = matched instanceof HTMLElement ? matched : null;
      if (!container) {
        event.preventDefault();
        return;
      }
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 1) {
        event.preventDefault();
        return;
      }
      const atTop = container.scrollTop <= 0 && event.deltaY < 0;
      const atBottom = container.scrollTop >= maxScroll - 1 && event.deltaY > 0;
      if (atTop || atBottom) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleModalWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", handleModalWheel, { capture: true });
      root.classList.remove("is-modal-open");
      start();
    };
  }, [anyModalOpen, stop, start]);

  useEffect(() => {
    if (!studioProject) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStudioSlug(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [studioProject]);

  const openStudio = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setStudioSlug(slug);
  }, []);

  const copyPortfolioLink = useCallback(() => {
    const url =
      typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    if (navigator.clipboard && url) {
      void navigator.clipboard.writeText(url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleHeroScrollLink = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    scrollTo(`#${targetId}`, {
      offset: targetId === "proyectos" ? 0 : -24,
      duration: 0.9,
    });
  };

  const activeProject = PROJECTS.find((project) => project.slug === selectedSlug) ?? PROJECTS[0];
  const sceneAccent = activeSection === "proyectos" ? activeProject.plate.accent : "#3B82F6";

  return (
    <>
      <FixedBackdrop effect={heroEffect} accent={sceneAccent} />
      <ScrollProgressBar />
      <a className="skip-link" href="#proyectos">
        Saltar a los proyectos
      </a>
      <Navbar activeSection={activeSection} onOpenCmdk={() => setCmdkOpen(true)} />

      <main ref={mainRef} className="cinema-main">
        <section ref={heroSectionRef} className="hero" aria-labelledby="hero-title">
          <div className="shell hero-inner" ref={heroInnerRef}>
            <div className="hero-layout">
              <div className="hero-copy">
                <h1 id="hero-title" className="hero-title">
                  {HERO_TITLE_WORDS.map((word, idx) => (
                    <span key={`${word}-${idx}`}>
                      <span className="hero-word-mask">
                        <span className="hero-word-inner">{word}</span>
                      </span>
                      {idx < HERO_TITLE_WORDS.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <p className="hero-thesis">
                  Soy {OWNER.name}, ingeniero full-stack. Diseñé seis aplicaciones cotidianas —cada
                  una con su propia arquitectura y base de datos— que puedes probar en vivo aquí
                  mismo.
                </p>
                <div className="hero-actions">
                  <MagneticButton>
                    <a
                      className="btn btn-solid"
                      href="#proyectos"
                      onClick={(event) => handleHeroScrollLink(event, "proyectos")}
                    >
                      <span>Explorar las obras</span>
                      <ArrowDown size={15} aria-hidden="true" />
                    </a>
                  </MagneticButton>
                  <a
                    className="link-action"
                    href="#criterio"
                    onClick={(event) => handleHeroScrollLink(event, "criterio")}
                  >
                    <span>Cómo trabajo</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <figure className="hero-portrait">
                <div className="hero-portrait-frame">
                  <Image
                    src={PROFILE_PORTRAIT_SRC}
                    alt={`Retrato de ${OWNER.name}`}
                    width={880}
                    height={1100}
                    priority
                    unoptimized
                    className="hero-portrait-img"
                  />
                </div>
                <figcaption className="hero-portrait-caption">
                  <span className="hero-portrait-name">{OWNER.name}</span>
                  <span className="mono hero-portrait-role">Full-stack · Arquitectura</span>
                </figcaption>
              </figure>
            </div>
          </div>
          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="hero-scroll-line" />
            <span className="mono">Desliza</span>
          </div>
        </section>

        <section id="proyectos" className="cinema-stage-section" aria-labelledby="proyectos-title">
          <CinemaStage
            projects={PROJECTS}
            selectedSlug={selectedSlug}
            telemetry={telemetry}
            onSelect={setSelectedSlug}
            onOpenStudio={openStudio}
          />
        </section>

        <section id="criterio" className="section" aria-labelledby="criterio-title">
          <div className="shell">
            <div className="section-intro">
              <h2 id="criterio-title">Cómo diseño y construyo software</h2>
              <p>Un mismo método para las seis obras, sin repetir arquitectura ni estética.</p>
            </div>
            <KineticManifesto text="Cada producto empieza por el problema humano real, aísla su dominio puro de la infraestructura y demuestra su comportamiento bajo falla." />
            <EditorialMethod items={CRITERIA} />
          </div>
        </section>

        <section id="contacto" className="section section-finale" aria-labelledby="contacto-title">
          <div className="shell">
            <CinemaFinale
              githubUrl={OWNER.github}
              copied={copied}
              onCopyLink={copyPortfolioLink}
            />
          </div>
        </section>

        <footer className="shell">
          <div className="footer">
            <span>
              © {OWNER.name} · Tipografías Archivo y Hanken Grotesk · Infraestructura{" "}
              <a href={SUPPORTING_REPO.repoUrl} target="_blank" rel="noopener noreferrer">
                {SUPPORTING_REPO.name} ↗
              </a>
            </span>
            <span className="mono">Atajo ⌘K</span>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {studioProject ? (
          <motion.div
            className="studio-overlay"
            data-lenis-prevent
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setStudioSlug(null)}
          >
            <motion.aside
              className="studio-sheet"
              data-lenis-prevent
              role="dialog"
              aria-modal="true"
              aria-label={`Estudio de ${studioProject.name}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(event) => event.stopPropagation()}
            >
              <ProjectStudio
                project={studioProject}
                allProjects={PROJECTS}
                mode="modal"
                telemetry={telemetry}
                onPingProject={(slug) => void pingOne(slug)}
                onClose={() => setStudioSlug(null)}
                onNavigate={openStudio}
              />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CommandPalette
        open={cmdkOpen}
        projects={PROJECTS}
        heroEffect={heroEffect}
        onClose={() => setCmdkOpen(false)}
        onPingAll={() => void pingAll()}
        onChangeHeroEffect={setHeroEffect}
        onOpenStudio={openStudio}
      />
    </>
  );
}
