"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { HeroEffectId, Project, TelemetryEntry, TelemetryMap } from "@/types/project";
import { OWNER, PROJECTS, SUPPORTING_REPO } from "@/data/projects";
import Navbar from "@/components/Navbar";
import HeroShader from "@/components/HeroShader";
import LivePulseRail from "@/components/LivePulseRail";
import InteractiveStage from "@/components/InteractiveStage";
import ExhibitionHub from "@/components/ExhibitionHub";
import CaseStudy from "@/components/CaseStudy";
import CommandPalette from "@/components/CommandPalette";

const METHOD_STEPS: readonly { step: string; title: string; text: string }[] = [
  {
    step: "01",
    title: "Problema antes que stack",
    text: "Cada producto parte de una molestia cotidiana concreta y de quién la sufre.",
  },
  {
    step: "02",
    title: "Especificación escrita",
    text: "Spec-Driven Development: el contrato y las reglas de dominio se escriben antes del código.",
  },
  {
    step: "03",
    title: "Dominio aislado",
    text: "Arquitectura limpia: la lógica de negocio no depende de frameworks ni de la base de datos.",
  },
  {
    step: "04",
    title: "Pruebas antes del merge",
    text: "GitFlow con dev como único origen; main solo recibe versiones con CI en verde.",
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
  const [heroEffect, setHeroEffect] = useState<HeroEffectId>("grid-pulse");
  const [activeLabSlug, setActiveLabSlug] = useState<string>(PROJECTS[0].slug);
  const [openCaseSlug, setOpenCaseSlug] = useState<string | null>(null);
  const [cmdkOpen, setCmdkOpen] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryMap>({});
  const [pinging, setPinging] = useState<boolean>(false);
  const closeDrawerRef = useRef<HTMLButtonElement>(null);

  const pingAll = useCallback(async () => {
    setPinging(true);
    setTelemetry((prev) => {
      const checking: TelemetryMap = { ...prev };
      for (const project of PROJECTS) {
        if (project.healthUrl) {
          checking[project.slug] = { status: "checking", latencyMs: null, detail: "Midiendo…" };
        }
      }
      return checking;
    });
    const results = await Promise.all(
      PROJECTS.map(async (project) => [project.slug, await probeService(project)] as const),
    );
    setTelemetry(Object.fromEntries(results));
    setPinging(false);
  }, []);

  useEffect(() => {
    void pingAll();
  }, [pingAll]);

  useEffect(() => {
    const onGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCmdkOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, []);

  const openCaseProject = useMemo(
    () => PROJECTS.find((project) => project.slug === openCaseSlug),
    [openCaseSlug],
  );

  const closeCase = useCallback(() => setOpenCaseSlug(null), []);

  useEffect(() => {
    if (!openCaseProject) {
      return undefined;
    }
    closeDrawerRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCase();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openCaseProject, closeCase]);

  const jumpToLab = useCallback((slug: string) => {
    setActiveLabSlug(slug);
    const el = document.getElementById("laboratorio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const liveServicesCount = Object.values(telemetry).filter((e) => e.status === "live").length;
  const paradigmCount = new Set(PROJECTS.map((project) => project.matrix.paradigm)).size;

  return (
    <>
      <a className="skip-link" href="#laboratorio">
        Saltar al laboratorio en vivo
      </a>
      <Navbar onOpenCmdk={() => setCmdkOpen(true)} liveCount={liveServicesCount} />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <HeroShader effect={heroEffect} />
          <div className="shell">
            <div className="hero-head-row">
              <p className="hero-kicker mono">
                {OWNER.name} — {OWNER.role}
              </p>
              <div className="shader-switch" role="group" aria-label="Fondo GPU del Hero">
                <span className="mono">Shader Hero</span>
                <button
                  type="button"
                  aria-pressed={heroEffect === "grid-pulse"}
                  onClick={() => setHeroEffect("grid-pulse")}
                >
                  Señales
                </button>
                <button
                  type="button"
                  aria-pressed={heroEffect === "contour-lines"}
                  onClick={() => setHeroEffect("contour-lines")}
                >
                  Contornos
                </button>
                <button
                  type="button"
                  aria-pressed={heroEffect === "off"}
                  onClick={() => setHeroEffect("off")}
                >
                  Estático
                </button>
              </div>
            </div>

            <h1 id="hero-title" className="hero-title">
              Seis problemas cotidianos. <em>Seis arquitecturas.</em>
            </h1>

            <div className="hero-grid">
              <div>
                <p className="hero-thesis">{OWNER.thesis}</p>
                <div className="hero-actions">
                  <a className="btn btn-solid" href="#laboratorio">
                    Probar laboratorio vivo ↓
                  </a>
                  <a className="btn" href="#exposicion">
                    Ver las 6 placas
                  </a>
                  <button type="button" className="btn" onClick={() => setCmdkOpen(true)}>
                    Paleta ⌘K
                  </button>
                </div>
              </div>
              <div className="hero-figures">
                <div>
                  <strong>{PROJECTS.length}</strong>
                  <span className="mono">Productos en vivo</span>
                </div>
                <div>
                  <strong>{paradigmCount}</strong>
                  <span className="mono">Paradigmas</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span className="mono">Con CI y pruebas</span>
                </div>
              </div>
            </div>

            <LivePulseRail
              projects={PROJECTS}
              telemetry={telemetry}
              pinging={pinging}
              onPingAll={() => void pingAll()}
              onSelectProject={jumpToLab}
            />
          </div>
        </section>

        <section id="laboratorio" className="section" aria-labelledby="laboratorio-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="laboratorio-title">I — Laboratorio en vivo</h2>
              <p>
                Cada sala adopta la paleta del producto y te deja operar su mecanismo central en el acto
                junto a un diagrama de señales que conmuta al provocar fallas o conflictos.
              </p>
            </div>
            <InteractiveStage
              projects={PROJECTS}
              activeSlug={activeLabSlug}
              telemetry={telemetry}
              onSelectSlug={setActiveLabSlug}
              onOpenCase={setOpenCaseSlug}
            />
          </div>
        </section>

        <section id="exposicion" className="section" aria-labelledby="exposicion-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="exposicion-title">II — Exposición</h2>
              <p>
                Vista completa curada de las seis obras. Abre cualquier ficha para revisar decisiones
                de arquitectura (Elegido vs Descartado), modo de falla y retrospectiva.
              </p>
            </div>
            <ExhibitionHub onOpenCase={setOpenCaseSlug} onSelectLab={jumpToLab} />
          </div>
        </section>

        <section id="matriz" className="section" aria-labelledby="matriz-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="matriz-title">III — Matriz de paradigmas</h2>
              <p>
                Ningún proyecto repite arquitectura. La matriz resume cómo cada uno guarda sus datos y
                qué garantía de consistencia ofrece.
              </p>
            </div>
            <div className="matrix-wrap">
              <table className="matrix">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Paradigma</th>
                    <th scope="col">Persistencia</th>
                    <th scope="col">Consistencia</th>
                    <th scope="col">Despliegue</th>
                    <th scope="col">Pruebas</th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.map((project) => {
                    const entry = telemetry[project.slug];
                    const liveNote = !project.healthUrl
                      ? "Estático"
                      : entry?.status === "live" && entry.latencyMs !== null
                        ? `${entry.latencyMs} ms`
                        : "Live";
                    return (
                      <tr key={project.slug}>
                        <td>
                          <span className="swatch" style={{ background: project.plate.accent }} />
                          {project.name}
                        </td>
                        <td>{project.matrix.paradigm}</td>
                        <td>{project.matrix.persistence}</td>
                        <td>{project.matrix.consistency}</td>
                        <td>
                          {project.hosting} · <span className="mono">{liveNote}</span>
                        </td>
                        <td>{project.testsLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="metodo" className="section" aria-labelledby="metodo-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="metodo-title">IV — Método</h2>
              <p>El mismo proceso para los seis productos, sin importar el lenguaje o la base de datos.</p>
            </div>
            <div className="method">
              {METHOD_STEPS.map((item) => (
                <div key={item.step}>
                  <span className="mono">{item.step}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="colofon" className="section" aria-labelledby="colofon-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="colofon-title">V — Colofón</h2>
              <p>Cómo está hecho este sitio y qué hay detrás del telón.</p>
            </div>
            <div className="colophon">
              <div>
                <h3>Tipografía y shader GPU</h3>
                <p>
                  Archivo, Hanken Grotesk y JetBrains Mono. Fondo animado de portada impulsado por
                  Leonxlnx/taste-skill (v2.5.1, efectos grid-pulse y contour-lines sin dependencias).
                </p>
              </div>
              <div>
                <h3>Construcción</h3>
                <p>
                  Next.js 15, React 19 y TypeScript estricto. Versión estática en GitHub Pages
                  construida nodo a nodo con DOM seguro, sin inyectar HTML.
                </p>
              </div>
              <div>
                <h3>Infraestructura</h3>
                <p>
                  {SUPPORTING_REPO.description}{" "}
                  <a href={SUPPORTING_REPO.repoUrl} target="_blank" rel="noopener noreferrer">
                    {SUPPORTING_REPO.name} ↗
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="shell">
        <div className="footer mono">
          <span>© {OWNER.name} · V3 Spatial Stage</span>
          <a href={OWNER.github} target="_blank" rel="noopener noreferrer">
            github.com/danieldiaz54
          </a>
        </div>
      </footer>

      {openCaseProject ? (
        <>
          <div className="drawer-backdrop" onClick={closeCase} aria-hidden="true" />
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha de caso: ${openCaseProject.name}`}
          >
            <div className="drawer-head">
              <Link className="mono link-case" href={`/projects/${openCaseProject.slug}`}>
                Página completa →
              </Link>
              <button ref={closeDrawerRef} type="button" className="btn" onClick={closeCase}>
                Cerrar (Esc)
              </button>
            </div>
            <div className="case-body">
              <CaseStudy project={openCaseProject} />
            </div>
          </aside>
        </>
      ) : null}

      <CommandPalette
        open={cmdkOpen}
        projects={PROJECTS}
        telemetry={telemetry}
        heroEffect={heroEffect}
        onClose={() => setCmdkOpen(false)}
        onPingAll={() => void pingAll()}
        onChangeHeroEffect={setHeroEffect}
        onSelectLab={jumpToLab}
        onOpenCase={setOpenCaseSlug}
      />
    </>
  );
}
