"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { HeroEffectId, Project, TelemetryEntry, TelemetryMap } from "@/types/project";
import { OWNER, PROJECTS, SUPPORTING_REPO } from "@/data/projects";
import Navbar, { type ActiveSectionId } from "@/components/Navbar";
import HeroShader from "@/components/HeroShader";
import ProjectIndex from "@/components/ProjectIndex";
import ProjectStudio from "@/components/ProjectStudio";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import MagneticButton from "@/components/MagneticButton";
import KineticManifesto from "@/components/KineticManifesto";
import CriteriaStack, { type CriterionItem } from "@/components/CriteriaStack";
import ContactPortal from "@/components/ContactPortal";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const HERO_TITLE_WORDS = ["Software", "claro", "para", "usar,", "sólido", "por", "dentro."];

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
  const { scrollTo } = useSmoothScroll();
  const mainRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);

  const [heroEffect, setHeroEffect] = useState<HeroEffectId>("fluted-glass");
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

  // Entrada tipográfica 3D de Hero en montaje inicial
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
        { yPercent: 115, rotateX: 22, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.78,
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
          duration: 0.65,
          delay: 0.22,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
    }, scope);

    return () => ctx.revert();
  }, []);

  // Coreografía global: Hero Cortina Fijada + rastreo de sección activa
  useEffect(() => {
    const heroEl = heroSectionRef.current;
    const heroInner = heroInnerRef.current;
    const mainEl = mainRef.current;
    if (!heroEl || !heroInner || !mainEl || typeof window === "undefined") {
      return undefined;
    }

    const shaderEl = heroEl.querySelector<HTMLElement>(".hero-shader");
    const cueEl = heroEl.querySelector<HTMLElement>(".hero-scroll-cue");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      });

      heroTl.to(
        heroInner,
        {
          y: -64,
          scale: 0.92,
          opacity: 0.08,
          filter: "blur(6px)",
          ease: "none",
        },
        0,
      );

      if (shaderEl) {
        heroTl.to(
          shaderEl,
          {
            scale: 1.12,
            y: 32,
            ease: "none",
          },
          0,
        );
      }

      if (cueEl) {
        heroTl.to(
          cueEl,
          {
            opacity: 0,
            y: 14,
            duration: 0.25,
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
    scrollTo(`#${targetId}`, { duration: 0.95 });
  };

  return (
    <>
      <ScrollProgressBar />
      <a className="skip-link" href="#proyectos">
        Saltar a los proyectos
      </a>
      <Navbar activeSection={activeSection} onOpenCmdk={() => setCmdkOpen(true)} />

      <main ref={mainRef}>
        <section ref={heroSectionRef} className="hero" aria-labelledby="hero-title">
          <HeroShader effect={heroEffect} />
          <div className="shell hero-inner" ref={heroInnerRef}>
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
              Soy {OWNER.name}, ingeniero full-stack. Diseñé seis aplicaciones cotidianas —cada una
              con su propia arquitectura y base de datos— que puedes probar en vivo aquí mismo.
            </p>
            <div className="hero-actions">
              <MagneticButton>
                <a
                  className="btn btn-solid"
                  href="#proyectos"
                  onClick={(event) => handleHeroScrollLink(event, "proyectos")}
                >
                  <span>Explorar los proyectos</span>
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
          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="hero-scroll-line" />
            <span className="mono">Desliza</span>
          </div>
        </section>

        <div className="curtain-surface">
          <section id="proyectos" className="projects-cinema-section" aria-labelledby="proyectos-title">
            <ProjectIndex
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
              <CriteriaStack items={CRITERIA} />
            </div>
          </section>

          <section id="contacto" className="section" aria-labelledby="contacto-title">
            <div className="shell">
              <ContactPortal
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
        </div>
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
