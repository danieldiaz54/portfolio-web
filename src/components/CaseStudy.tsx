import type { Project } from "@/types/project";

export default function CaseStudy({ project }: { project: Project }) {
  return (
    <div className="case-body">
      <p className="mono">
        N.º {project.inventory} · {project.categoryLabel} · {project.hosting}
      </p>
      <h2 className="case-title">{project.name}</h2>
      <p className="case-sub">
        {project.everydayName}. {project.oneLiner}
      </p>

      <section className="case-block">
        <h4>El problema</h4>
        <p>{project.problem}</p>
        <p>
          <strong>Para quién:</strong> {project.audience}
        </p>
      </section>

      <section className="case-block">
        <h4>Qué entrega</h4>
        <p>{project.outcome}</p>
      </section>

      <section className="case-block">
        <h4>Decisión de arquitectura</h4>
        {project.tradeOffs.map((tradeOff) => (
          <div className="tradeoff" key={tradeOff.chosen}>
            <div>
              <span className="mono label">Elegido</span>
              {tradeOff.chosen}
            </div>
            <div>
              <span className="mono label">Descartado</span>
              <s>{tradeOff.rejected}</s>
            </div>
            <div className="tradeoff-note">
              <span className="mono label">Por qué</span>
              {tradeOff.because}
            </div>
            <div className="tradeoff-note">
              <span className="mono label">Modo de falla aceptado</span>
              {tradeOff.failureMode}
            </div>
          </div>
        ))}
      </section>

      <section className="case-block">
        <h4>Flujo</h4>
        <ol className="flow">
          {project.flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="case-block">
        <h4>Evidencia</h4>
        <ul className="case-list">
          <li>Pruebas automatizadas: {project.testsLabel}</li>
          {project.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="case-block">
        <h4>Stack</h4>
        <ul className="stack-list">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="case-block">
        <h4>Retrospectiva</h4>
        <p>{project.retrospective}</p>
        <p>
          <strong>Siguiente evolución:</strong> {project.nextEvolution}
        </p>
      </section>

      <div className="exhibit-actions">
        <a className="btn btn-solid" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          Abrir en vivo ↗
        </a>
        <a className="btn" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          Código fuente
        </a>
      </div>
    </div>
  );
}
