"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ProjectCategory } from "@/types/project";
import { CATEGORY_FILTERS, PROJECTS } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import CaseStudy from "@/components/CaseStudy";

type FilterId = ProjectCategory | "all";

interface ExhibitionHubProps {
  onOpenCase?: (slug: string) => void;
  onSelectLab?: (slug: string) => void;
}

export default function ExhibitionHub({ onOpenCase, onSelectLab }: ExhibitionHubProps) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [localSlug, setLocalSlug] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const visible = useMemo(
    () => PROJECTS.filter((project) => filter === "all" || project.category === filter),
    [filter],
  );
  const openProject = onOpenCase
    ? undefined
    : PROJECTS.find((project) => project.slug === localSlug);

  const close = useCallback(() => setLocalSlug(null), []);

  useEffect(() => {
    if (!openProject) {
      return undefined;
    }
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openProject, close]);

  const handleOpen = (slug: string) => {
    if (onOpenCase) {
      onOpenCase(slug);
    } else {
      setLocalSlug(slug);
    }
  };

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filtrar por tipo de sistema">
        {CATEGORY_FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="exhibit-grid">
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onOpenCase={handleOpen}
            onSelectLab={onSelectLab}
          />
        ))}
      </div>

      {openProject ? (
        <>
          <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`Ficha de caso: ${openProject.name}`}
          >
            <div className="drawer-head">
              <Link className="mono link-case" href={`/projects/${openProject.slug}`}>
                Página completa →
              </Link>
              <button ref={closeRef} type="button" className="btn" onClick={close}>
                Cerrar (Esc)
              </button>
            </div>
            <div className="case-body">
              <CaseStudy project={openProject} />
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
