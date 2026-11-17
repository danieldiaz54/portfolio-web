import Link from "next/link";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Cpu,
  FileCode2,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { PROJECTS } from "@/data/projects";

const ENGINEERING_STANDARDS = [
  {
    icon: FileCode2,
    title: "Architecture Decision Records",
    description:
      "Cada repositorio documenta sus trade-offs en docs/adr/ explicando por qué se eligió cada arquitectura y qué alternativas se descartaron.",
  },
  {
    icon: ShieldCheck,
    title: "CI/CD Automatizado",
    description:
      "Workflows en GitHub Actions que ejecutan linting, verificación de tipos, tests automatizados y build en cada push o pull request.",
  },
  {
    icon: Box,
    title: "Entornos Reproducibles",
    description:
      "Dockerfiles multi-stage y docker-compose.yml para levantar cualquier sistema localmente con un único comando.",
  },
  {
    icon: Terminal,
    title: "Contratos y Trazabilidad",
    description:
      "Conventional Commits, diagramas Mermaid verificables, variables de entorno tipadas y enfoque en observabilidad desde el diseño.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Hero Section */}
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-surface-900 via-surface-950 to-surface-900 p-8 sm:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-accent-emerald">
          <Cpu className="h-3.5 w-3.5" />
          <span>6 Repositorios Públicos · 5 Arquitecturas Distintas</span>
        </div>

        <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Ingeniería de Software orientada a{" "}
          <span className="text-accent-cyan">arquitecturas reales</span> y
          problemas de mercado.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Este sitio centraliza mi ecosistema de proyectos independientes. Cada
          repositorio aborda un dominio crítico del mercado moderno con una
          arquitectura diferente, métricas claras y documentación de decisiones
          técnicas.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 rounded-xl bg-accent-cyan px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors"
          >
            <span>Explorar Case Studies</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#architectures"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface-900 px-5 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 transition-colors"
          >
            <span>Matriz de Arquitecturas</span>
          </Link>
        </div>
      </section>

      {/* Architecture Coverage Matrix */}
      <section id="architectures" className="mt-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
              Cobertura de Mercado
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Matriz de Arquitecturas del Portafolio
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Cero proyectos repetidos: cada repo demuestra un patrón distinto.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-surface-900/60">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-surface-900 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Repositorio</th>
                <th className="px-5 py-3.5">Área de Mercado</th>
                <th className="px-5 py-3.5">Arquitectura</th>
                <th className="px-5 py-3.5">Enfoque Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {PROJECTS.map((project) => (
                <tr
                  key={project.slug}
                  className="hover:bg-surface-900/90 transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-accent-cyan">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="hover:underline"
                    >
                      {project.slug}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-200">{project.area}</td>
                  <td className="px-5 py-4 text-accent-emerald font-medium">
                    {project.architecture}
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {project.metrics.map((m) => m.value).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section id="projects" className="mt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
            Repositorios Independientes
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Case Studies Técnicos
          </h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Engineering Standards */}
      <section id="standards" className="mt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
            Orden y Calidad
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Estándar Compartido en Todos los Repositorios
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {ENGINEERING_STANDARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-surface-900/60 p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-accent-indigo">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent-emerald">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Obligatorio en cada repo del portafolio</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
