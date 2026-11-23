import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/types/project";

function plateStyle(project: Project): CSSProperties {
  const { plate } = project;
  return {
    "--p-bg": plate.bg,
    "--p-surface": plate.surface,
    "--p-ink": plate.ink,
    "--p-muted": plate.muted,
    "--p-accent": plate.accent,
    "--p-display": `var(${plate.displayVar}), "${plate.displayFont}", serif`,
  } as CSSProperties;
}

function PdfPreview(): ReactNode {
  return (
    <>
      <div className="pv-bar">
        <span className="pv-brand">PdfCraft</span>
        <span className="pv-chip">0 KB · Firmar</span>
      </div>
      <div className="pv-body">
        <div className="pv-thumbs">
          <i />
          <i className="on" />
          <i />
          <i />
        </div>
        <div className="pv-page">
          <b className="w80" />
          <b className="w60" />
          <b className="hl" />
          <b className="w70" />
          <span className="pv-sign">D. Díaz · 2/4</span>
        </div>
      </div>
    </>
  );
}

function CatalogPreview(): ReactNode {
  const items: readonly [string, string][] = [
    ["Anillo Sol", "$ 120"],
    ["Seda Nº 4", "$ 86"],
    ["Ámbar 50 ml", "$ 64"],
  ];
  return (
    <>
      <div className="pv-bar">
        <span className="pv-brand">Merkat</span>
        <span className="pv-chip">Joyería</span>
      </div>
      <div className="pv-tiles">
        {items.map(([label, price]) => (
          <div className="pv-tile" key={label}>
            <i />
            <span>{label}</span>
            <em>{price}</em>
          </div>
        ))}
      </div>
    </>
  );
}

function KanbanPreview(): ReactNode {
  return (
    <>
      <div className="pv-bar">
        <span className="pv-brand">PulseFlow</span>
        <span className="pv-presence" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="pv-cols">
        <div className="pv-col">
          <span>Por hacer</span>
          <i />
          <i />
        </div>
        <div className="pv-col">
          <span>En curso</span>
          <i className="on" />
        </div>
        <div className="pv-col">
          <span>Hecho</span>
          <i />
        </div>
      </div>
    </>
  );
}

function ChatPreview(): ReactNode {
  return (
    <>
      <div className="pv-bar">
        <span className="pv-brand">Cortex</span>
        <span className="pv-chip">manual.pdf</span>
      </div>
      <div className="pv-q">¿Cada cuánto se cambia el filtro?</div>
      <div className="pv-a">
        Cada 500 horas de uso.<span className="pv-cite">p. 12</span>
      </div>
      <div className="pv-src">«…reemplace el filtro cada 500 horas de operación…» — manual.pdf, p. 12</div>
    </>
  );
}

function WalletPreview(): ReactNode {
  return (
    <>
      <div className="pv-bar">
        <span className="pv-brand">LedgerCore</span>
        <span className="pv-chip">Saldo</span>
      </div>
      <div className="pv-balance">$ 2.480,00</div>
      <div className="pv-row">
        <span>Envío a Ana</span>
        <em>− 120,00</em>
      </div>
      <div className="pv-row">
        <span>Reverso automático</span>
        <em>+ 45,00</em>
      </div>
      <div className="pv-actions">
        <span>Enviar</span>
        <span>Recibir</span>
      </div>
    </>
  );
}

function PhonePreview(): ReactNode {
  return (
    <div className="pv-device">
      <div className="pv-offline">Sin conexión · 3 en cola</div>
      <div className="pv-note">
        <b>Poste 14</b>
        <span>Tensión normal</span>
      </div>
      <div className="pv-note">
        <b>Válvula B</b>
        <span>Fuga leve</span>
      </div>
      <div className="pv-fab">+ Nota</div>
    </div>
  );
}

function PreviewContent({ project }: { project: Project }): ReactNode {
  switch (project.previewKind) {
    case "pdf":
      return <PdfPreview />;
    case "catalog":
      return <CatalogPreview />;
    case "kanban":
      return <KanbanPreview />;
    case "chat":
      return <ChatPreview />;
    case "wallet":
      return <WalletPreview />;
    case "phone":
      return <PhonePreview />;
  }
}

export default function PreviewPlate({ project }: { project: Project }) {
  return (
    <div
      className={`pv pv-${project.previewKind}`}
      style={plateStyle(project)}
      role="img"
      aria-label={`Miniatura de ${project.name} en su paleta y tipografía ${project.plate.displayFont}`}
    >
      <PreviewContent project={project} />
    </div>
  );
}
