import Link from "next/link";

export default function Navbar() {
  return (
    <header className="masthead">
      <div className="shell masthead-inner">
        <Link href="/" className="wordmark">
          Daniel Díaz
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/#proyectos">Proyectos</Link>
          <Link href="/#criterio">Criterio</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
