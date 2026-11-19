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
  { id: "proyectos", href: "/#proyectos", label: "Obras" },
  { id: "criterio", href: "/#criterio", label: "Método" },
  { id: "contacto", href: "/#contacto", label: "Contacto" },
];

export default function Navbar({ activeSection = "hero", onOpenCmdk }: NavbarProps) {
  const { scrollTo } = useSmoothScroll();

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof document === "undefined") {
      return;
    }
    if (!document.getElementById("proyectos")) {
      return;
    }
    event.preventDefault();
    scrollTo(0, { duration: 0.85 });
  };

  const handleAnchor = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (typeof document === "undefined") {
      return;
    }
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    scrollTo(`#${id}`, {
      offset: id === "proyectos" ? 0 : -24,
      duration: 0.9,
    });
  };

  return (
    <motion.header
      className="hud-nav"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shell hud-nav-inner">
        <Link href="/" className="wordmark" onClick={handleBrandClick}>
          Daniel Díaz
        </Link>

        <nav aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`hud-link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => handleAnchor(event, item.id)}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="hud-underline"
                    className="hud-underline"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}

          {onOpenCmdk ? (
            <button
              type="button"
              className="hud-cmdk mono"
              onClick={onOpenCmdk}
              aria-label="Abrir paleta de comandos"
              title="Navegación rápida (Ctrl/⌘ K)"
            >
              ⌘K
            </button>
          ) : null}
        </nav>
      </div>
    </motion.header>
  );
}
