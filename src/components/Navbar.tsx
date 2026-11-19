import Link from "next/link";

export default function Navbar() {
  return (
    <header className="masthead">
      <div className="shell masthead-inner">
        <Link href="/" className="wordmark">
          Daniel Díaz <span className="mono">/ Exposición</span>
        </Link>
        <nav aria-label="Secciones" className="mono">
          <Link href="/#exposicion">Exposición</Link>
          <Link href="/#matriz" className="hide-sm">
            Matriz
          </Link>
          <Link href="/#metodo" className="hide-sm">
            Método
          </Link>
          <a href="https://github.com/danieldiaz54" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
