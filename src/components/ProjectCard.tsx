import type { Project } from "@/types/project";
import PreviewPlate from "@/components/PreviewPlate";

interface ProjectCardProps {
  project: Project;
  onOpenCase: (slug: string) => void;
}

export default function ProjectCard({ project, onOpenCase }: ProjectCardProps) {
  return (
    <article className="exhibit" aria-labelledby={`title-${project.slug}`}>
      <div className="exhibit-mount">
        <PreviewPlate project={project} />
      </div>
      <div className="exhibit-body">
        <div className="exhibit-top mono">
          <span>N.º {project.inventory}</span>
          <span>{project.categoryLabel}</span>
        </div>
        <h3 id={`title-${project.slug}`}>
          {project.name}
          <small>{project.everydayName}</small>
        </h3>
        <p>{project.oneLiner}</p>
        <dl className="exhibit-spec">
          <div>
            <dt>Paradigma</dt>
            <dd>{project.matrix.paradigm}</dd>
          </div>
          <div>
            <dt>Pruebas</dt>
            <dd>{project.testsLabel}</dd>
          </div>
          <div>
            <dt>Identidad</dt>
            <dd>
              <span className="swatch" style={{ background: project.plate.accent }} />
              {project.plate.displayFont}
            </dd>
          </div>
        </dl>
        <div className="exhibit-actions">
          <button type="button" className="link-case" onClick={() => onOpenCase(project.slug)}>
            Leer ficha de caso →
          </button>
          <a className="link-live" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            En vivo
          </a>
          <a className="link-plain" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            Código
          </a>
        </div>
      </div>
    </article>
  );
}
