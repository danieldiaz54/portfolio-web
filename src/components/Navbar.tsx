"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.header
      className="masthead"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
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
    </motion.header>
  );
}
