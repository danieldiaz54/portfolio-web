"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { HeroEffectId, Project, TelemetryMap } from "@/types/project";

interface CommandPaletteProps {
  open: boolean;
  projects: readonly Project[];
  telemetry: TelemetryMap;
  heroEffect: HeroEffectId;
  onClose: () => void;
  onPingAll: () => void;
  onChangeHeroEffect: (next: HeroEffectId) => void;
  onSelectLab: (slug: string) => void;
  onOpenCase: (slug: string) => void;
}

interface PaletteItem {
  id: string;
  group: string;
  label: string;
  sub: string;
  run: () => void;
}

export default function CommandPalette({
  open,
  projects,
  telemetry,
  heroEffect,
  onClose,
  onPingAll,
  onChangeHeroEffect,
  onSelectLab,
  onOpenCase,
}: CommandPaletteProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const actions: PaletteItem[] = [
      {
        id: "action-ping",
        group: "Telemetría en vivo",
        label: "Re-ping en vivo a los 5 servicios en Railway",
        sub: "CORS GET /api/v1/health",
        run: () => {
          onPingAll();
          onClose();
        },
      },
      {
        id: "fx-grid",
        group: "Motor visual (taste-skill 2.5.1)",
        label: "Hero shader: Señales sobre retícula (grid-pulse)",
        sub: heroEffect === "grid-pulse" ? "Activo" : "Cambiar",
        run: () => {
          onChangeHeroEffect("grid-pulse");
          onClose();
        },
      },
      {
        id: "fx-contour",
        group: "Motor visual (taste-skill 2.5.1)",
        label: "Hero shader: Curvas topográficas GLSL (contour-lines)",
        sub: heroEffect === "contour-lines" ? "Activo" : "Cambiar",
        run: () => {
          onChangeHeroEffect("contour-lines");
          onClose();
        },
      },
      {
        id: "fx-off",
        group: "Motor visual (taste-skill 2.5.1)",
        label: "Hero estático sin animación WebGL/Canvas",
        sub: heroEffect === "off" ? "Activo" : "Papel limpio",
        run: () => {
          onChangeHeroEffect("off");
          onClose();
        },
      },
    ];

    const projectItems: PaletteItem[] = projects.flatMap((project) => {
      const entry = telemetry[project.slug];
      const lat = !project.healthUrl
        ? "local"
        : entry?.status === "live" && entry.latencyMs !== null
          ? `${entry.latencyMs} ms`
          : project.hosting;
      return [
        {
          id: `lab-${project.slug}`,
          group: "Laboratorios interactivos",
          label: `Probar ${project.name} — ${project.everydayName}`,
          sub: `${project.matrix.paradigm} · ${lat}`,
          run: () => {
            onSelectLab(project.slug);
            onClose();
          },
        },
        {
          id: `case-${project.slug}`,
          group: "Fichas de caso",
          label: `Ficha de arquitectura: ${project.name}`,
          sub: project.testsLabel,
          run: () => {
            onOpenCase(project.slug);
            onClose();
          },
        },
      ];
    });

    const all = [...actions, ...projectItems];
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return all;
    }
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) ||
        item.sub.toLowerCase().includes(needle) ||
        item.group.toLowerCase().includes(needle),
    );
  }, [projects, telemetry, heroEffect, query, onPingAll, onChangeHeroEffect, onSelectLab, onOpenCase, onClose]);

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
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
    <div className="cmdk-backdrop" onClick={onClose}>
      <div
        className="cmdk-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos y telemetría"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <span className="mono">⌘K</span>
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
            placeholder="Buscar proyecto, paradigma, Redis, Saga, shader o ping…"
            aria-label="Filtrar comandos"
          />
          <button type="button" className="pulse-ping-btn" onClick={onClose}>
            Esc
          </button>
        </div>

        <div className="cmdk-list" role="listbox" aria-label="Comandos disponibles">
          {items.length === 0 ? (
            <div className="cmdk-group-label mono">Sin coincidencias para &ldquo;{query}&rdquo;</div>
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
          <span>↑↓ navegar · Enter ejecutar · Esc cerrar</span>
          <span>6 productos · 5 APIs Railway</span>
        </div>
      </div>
    </div>
  );
}
