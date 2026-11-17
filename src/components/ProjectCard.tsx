import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import type { ProjectCaseStudy } from "@/types/project";

interface ProjectCardProps {
  project: ProjectCaseStudy;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-surface-900/80 p-6 transition-all hover:border-cyan-500/40 hover:bg-surface-900">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-accent-cyan">
            {project.area}
          </span>
          <span className="rounded-md bg-slate-800 px-2.5 py-1 font-mono text-[11px] text-slate-300">
            {project.phase}
          </span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-white group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>

        <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-accent-emerald">
          {project.architecture}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {project.tagline}
        </p>

        <div className="mt-4 rounded-xl border border-slate-800/80 bg-surface-950/70 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Problema que resuelve
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {project.problem}
          </p>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-slate-800 bg-surface-950/60 p-2.5"
            >
              <dt className="text-[10px] uppercase tracking-wider text-slate-400">
                {metric.label}
              </dt>
              <dd className="mt-0.5 text-xs font-semibold text-slate-100">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-slate-700/70 bg-surface-800/60 px-2 py-0.5 font-mono text-[11px] text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-cyan hover:underline"
        >
          <span>Ver Case Study y Diagrama</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <GitBranch className="h-3.5 w-3.5" />
          <span>Repo</span>
        </a>
      </div>
    </article>
  );
}
