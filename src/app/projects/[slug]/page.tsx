import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2, GitBranch, Layers } from "lucide-react";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Proyecto no encontrado | portfolio-web" };
  }

  return {
    title: `${project.title} — ${project.architecture} | portfolio-web`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent-cyan transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver al Hub del Portafolio</span>
      </Link>

      <header className="mt-6 rounded-3xl border border-slate-800 bg-surface-900/80 p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-accent-cyan">
            {project.area}
          </span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-accent-emerald">
            {project.architecture}
          </span>
          <span className="rounded-md bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300">
            {project.phase}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-300">
          {project.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-slate-700 bg-surface-950 px-2.5 py-1 font-mono text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-5">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-emerald px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition-colors"
          >
            <span>Demo en Vivo</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-accent-cyan hover:bg-cyan-500/20 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>Ver Repositorio Público ({project.slug})</span>
          </a>
        </div>
      </header>

      {/* Metrics */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-800 bg-surface-900/60 p-5"
          >
            <p className="text-xs uppercase tracking-wider text-slate-400">
              {metric.label}
            </p>
            <p className="mt-1.5 text-lg font-semibold text-white">
              {metric.value}
            </p>
          </div>
        ))}
      </section>

      {/* Problem & Solution */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-surface-900/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-300">
            Problema de Ingeniería
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {project.problem}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-surface-900/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-emerald">
            Solución y Arquitectura
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {project.solution}
          </p>
        </div>
      </section>

      {/* Mermaid Diagram Block */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-surface-900/60 p-6">
        <div className="flex items-center gap-2 text-white">
          <Layers className="h-4 w-4 text-accent-cyan" />
          <h2 className="text-lg font-semibold">
            Diagrama de Arquitectura (Mermaid)
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Definición declarativa versionada junto al código fuente del Case
          Study (renderizado visual disponible en preview.html y README).
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-surface-950 p-4 font-mono text-xs leading-relaxed text-cyan-200">
          <code>{project.mermaidDiagram}</code>
        </pre>
      </section>

      {/* ADRs */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-surface-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">
          Decisiones Clave de Arquitectura (ADRs)
        </h2>
        <div className="mt-4 space-y-4">
          {project.adrHighlights.map((adr) => (
            <div
              key={adr.id}
              className="rounded-xl border border-slate-800 bg-surface-950/70 p-5"
            >
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 font-mono text-xs font-semibold text-accent-indigo">
                  {adr.id}
                </span>
                <h3 className="font-semibold text-white">{adr.title}</h3>
              </div>
              <p className="mt-2.5 text-sm text-slate-200">
                <span className="font-semibold text-slate-400">Decisión: </span>
                {adr.decision}
              </p>
              <p className="mt-1.5 flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" />
                <span>{adr.rationale}</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
