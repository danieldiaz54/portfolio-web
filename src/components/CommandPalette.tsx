"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import type { HeroEffectId, Project } from "@/types/project";

interface CommandPaletteProps {
  open: boolean;
  projects: readonly Project[];
  heroEffect: HeroEffectId;
  onClose: () => void;
  onPingAll: () => void;
  onChangeHeroEffect: (next: HeroEffectId) => void;
  onOpenStudio: (slug: string) => void;
}

interface PaletteItem {
  id: string;
  label: string;
  sub: string;
  keywords?: string;
  run: () => void;
}

const SHADER_KEYWORDS = "shader webgl glsl fondo atmosfera";

export default function CommandPalette({
  open,
  projects,
  heroEffect,
  onClose,
  onPingAll,
  onChangeHeroEffect,
  onOpenStudio,
}: CommandPaletteProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const projectItems: PaletteItem[] = projects.map((project) => ({
      id: `studio-${project.slug}`,
      label: `${project.name} — ${project.everydayName}`,
      sub: project.matrix.paradigm,
      keywords: `${project.categoryLabel} ${project.stack.join(" ")}`,
      run: () => {
        onOpenStudio(project.slug);
        onClose();
      },
    }));

    const utils: PaletteItem[] = [
      {
        id: "action-ping",
        label: "Comprobar salud en vivo (Railway)",
        sub: "5 servicios",
        keywords: "health ping railway estado",
        run: () => {
          onPingAll();
          onClose();
        },
      },
      {
        id: "fx-prism",
        label: "Atmósfera: Prisma espectral WebGL",
        sub: heroEffect === "prism-dispersion" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} prism`,
        run: () => {
          onChangeHeroEffect("prism-dispersion");
          onClose();
        },
      },
      {
        id: "fx-spotlight",
        label: "Atmósfera: Reflector escénico WebGL",
        sub: heroEffect === "spotlight-cone" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} spotlight`,
        run: () => {
          onChangeHeroEffect("spotlight-cone");
          onClose();
        },
      },
      {
        id: "fx-rays",
        label: "Atmósfera: Haces de luz WebGL",
        sub: heroEffect === "god-rays" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} rays god-rays`,
        run: () => {
          onChangeHeroEffect("god-rays");
          onClose();
        },
      },
      {
        id: "fx-fluted",
        label: "Atmósfera: Vidrio estriado WebGL",
        sub: heroEffect === "fluted-glass" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} fluted-glass`,
        run: () => {
          onChangeHeroEffect("fluted-glass");
          onClose();
        },
      },
      {
        id: "fx-grid",
        label: "Atmósfera: Señales sobre retícula",
        sub: heroEffect === "grid-pulse" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} grid-pulse`,
        run: () => {
          onChangeHeroEffect("grid-pulse");
          onClose();
        },
      },
      {
        id: "fx-contour",
        label: "Atmósfera: Curvas topográficas GLSL",
        sub: heroEffect === "contour-lines" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} contour-lines`,
        run: () => {
          onChangeHeroEffect("contour-lines");
          onClose();
        },
      },
      {
        id: "fx-off",
        label: "Atmósfera: Obsidiana pura sin shader",
        sub: heroEffect === "off" ? "Activo" : "Cambiar",
        keywords: `${SHADER_KEYWORDS} off apagado`,
        run: () => {
          onChangeHeroEffect("off");
          onClose();
        },
      },
    ];

    const all = [...projectItems, ...utils];
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return all;
    }
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) ||
        item.sub.toLowerCase().includes(needle) ||
        Boolean(item.keywords && item.keywords.toLowerCase().includes(needle)),
    );
  }, [projects, heroEffect, query, onOpenStudio, onPingAll, onChangeHeroEffect, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    setQuery("");
    setSelectedIndex(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = items[selectedIndex];
      if (target) {
        target.run();
      }
    }
  };

  return (
    <div className="cmdk-backdrop" data-lenis-prevent onClick={onClose}>
      <div
        className="cmdk-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Navegación rápida"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <Search size={16} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="cmdk-input"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKey}
            placeholder="Ir a proyecto, salud en vivo o shader…"
            aria-label="Filtrar comandos"
          />
          <button type="button" className="studio-nav-btn" onClick={onClose}>
            Esc
          </button>
        </div>

        <div className="cmdk-list" data-lenis-prevent role="listbox" aria-label="Resultados">
          {items.length === 0 ? (
            <div className="cmdk-group-label mono">Sin coincidencias</div>
          ) : (
            items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={idx === selectedIndex}
                className="cmdk-item"
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={item.run}
              >
                <span>{item.label}</span>
                <span className="cmdk-item-sub">{item.sub}</span>
              </button>
            ))
          )}
        </div>

        <div className="cmdk-foot mono">
          <span>↑↓ mover · Enter abrir · Esc cerrar</span>
          <span>6 proyectos · ⌘K</span>
        </div>
      </div>
    </div>
  );
}
