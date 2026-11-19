import Navbar from "@/components/Navbar";
import ExhibitionHub from "@/components/ExhibitionHub";
import { OWNER, PROJECTS, SUPPORTING_REPO } from "@/data/projects";

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

export default function HomePage() {
  const liveCount = PROJECTS.length;
  const paradigmCount = new Set(PROJECTS.map((project) => project.matrix.paradigm)).size;

  return (
    <>
      <a className="skip-link" href="#exposicion">
        Saltar a la exposición
      </a>
      <Navbar />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shell">
            <p className="hero-kicker mono">
              {OWNER.name} — {OWNER.role}
            </p>
            <h1 id="hero-title" className="hero-title">
              Seis problemas cotidianos. <em>Seis arquitecturas.</em>
            </h1>
            <div className="hero-grid">
              <div>
                <p className="hero-thesis">{OWNER.thesis}</p>
                <div className="hero-actions">
                  <a className="btn btn-solid" href="#exposicion">
                    Ver la exposición ↓
                  </a>
                  <a className="btn" href={OWNER.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </div>
              </div>
              <div className="hero-figures">
                <div>
                  <strong>{liveCount}</strong>
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
          </div>
        </section>

        <section id="exposicion" className="section" aria-labelledby="exposicion-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="exposicion-title">I — Exposición</h2>
              <p>
                Cada placa muestra el producto con su propia paleta y tipografía. Ábrela para leer la
                ficha: el problema, la decisión que tomé, la alternativa que descarté y lo que cambiaría.
              </p>
            </div>
            <ExhibitionHub />
          </div>
        </section>

        <section id="matriz" className="section" aria-labelledby="matriz-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="matriz-title">II — Matriz de paradigmas</h2>
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
                  {PROJECTS.map((project) => (
                    <tr key={project.slug}>
                      <td>
                        <span className="swatch" style={{ background: project.plate.accent }} />
                        {project.name}
                      </td>
                      <td>{project.matrix.paradigm}</td>
                      <td>{project.matrix.persistence}</td>
                      <td>{project.matrix.consistency}</td>
                      <td>{project.hosting}</td>
                      <td>{project.testsLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="metodo" className="section" aria-labelledby="metodo-title">
          <div className="shell">
            <div className="section-head">
              <h2 id="metodo-title">III — Método</h2>
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
              <h2 id="colofon-title">IV — Colofón</h2>
              <p>Cómo está hecho este sitio y qué hay detrás del telón.</p>
            </div>
            <div className="colophon">
              <div>
                <h3>Tipografía</h3>
                <p>
                  Archivo para titulares, Hanken Grotesk para texto y JetBrains Mono para metadatos. Las
                  placas usan la tipografía real de cada producto.
                </p>
              </div>
              <div>
                <h3>Construcción</h3>
                <p>
                  Next.js 15, React 19 y TypeScript estricto. Versión estática en GitHub Pages con DOM
                  construido nodo a nodo, sin inyectar HTML.
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
          <span>© {OWNER.name}</span>
          <a href={OWNER.github} target="_blank" rel="noopener noreferrer">
            github.com/danieldiaz54
          </a>
        </div>
      </footer>
    </>
  );
}
