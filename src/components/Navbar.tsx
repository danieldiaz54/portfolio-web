"use client";

import Link from "next/link";

interface NavbarProps {
  onOpenCmdk?: () => void;
  liveCount?: number;
}

export default function Navbar({ onOpenCmdk, liveCount }: NavbarProps) {
  return (
    <header className="masthead">
      <div className="shell masthead-inner">
        <Link href="/" className="wordmark">
          Daniel Díaz <span className="mono">/ Exposición</span>
        </Link>
        <div className="masthead-right">
          <nav aria-label="Secciones" className="mono">
            <Link href="/#laboratorio">Laboratorio</Link>
            <Link href="/#exposicion">Exposición</Link>
            <Link href="/#matriz" className="hide-sm">
              Matriz
            </Link>
            <a
              href="https://github.com/danieldiaz54"
              target="_blank"
              rel="noopener noreferrer"
              className="hide-sm"
            >
              GitHub
            </a>
          </nav>
          {onOpenCmdk ? (
            <button
              type="button"
              className="cmdk-trigger"
              onClick={onOpenCmdk}
              aria-label="Abrir paleta de comandos y telemetría (Ctrl+K o Cmd+K)"
            >
              {typeof liveCount === "number" ? (
                <span className="pulse-dot is-live" aria-hidden="true" />
              ) : null}
              <span>Paleta</span>
              <span className="kbd">⌘K</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
