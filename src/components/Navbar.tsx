"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";

export type ActiveSectionId = "hero" | "proyectos" | "criterio" | "contacto";

interface NavbarProps {
  activeSection?: ActiveSectionId;
  onOpenCmdk?: () => void;
}

const NAV_ITEMS: readonly { id: Exclude<ActiveSectionId, "hero">; href: string; label: string }[] = [
  { id: "proyectos", href: "/#proyectos", label: "Proyectos" },
  { id: "criterio", href: "/#criterio", label: "Criterio" },
  { id: "contacto", href: "/#contacto", label: "Contacto" },
];

export default function Navbar({ activeSection = "hero", onOpenCmdk }: NavbarProps) {
  const { scrollTo } = useSmoothScroll();

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof document === "undefined") {
      return;
    }
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    scrollTo(`#${id}`, { duration: 0.95 });
  };

  return (
    <motion.header
      className="masthead-floating"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shell">
        <div className="masthead-pill">
          <Link href="/" className="wordmark">
            Daniel Díaz
          </Link>

          <nav aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => handleAnchor(event, item.id)}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {onOpenCmdk ? (
            <button
              type="button"
              className="cmdk-chip mono"
              onClick={onOpenCmdk}
              aria-label="Abrir paleta de comandos"
              title="Navegación rápida (Ctrl/⌘ K)"
            >
              ⌘K
            </button>
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}
