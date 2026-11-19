"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface CinemaFinaleProps {
  githubUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

export default function CinemaFinale({
  githubUrl,
  copied,
  onCopyLink,
}: CinemaFinaleProps) {
  const finaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = finaleRef.current;
    if (!el || typeof window === "undefined") {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { scale: 0.94, y: 26 },
        {
          scale: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 50%",
            scrub: 0.5,
          },
        },
      );
      return () => {
        tween.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={finaleRef} className="cinema-finale">
      <h2 id="contacto-title" className="cinema-finale-title">
        Conversemos.
      </h2>
      <p className="cinema-finale-lead">
        Todos los repositorios son públicos, auditados y tienen despliegue activo en la nube.
      </p>
      <div className="cinema-actions">
        <MagneticButton>
          <a className="btn btn-solid" href={githubUrl} target="_blank" rel="noopener noreferrer">
            <span>GitHub</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </MagneticButton>
        <button type="button" className="btn" onClick={onCopyLink}>
          {copied ? (
            <>
              <Check size={15} aria-hidden="true" />
              <span>Enlace copiado</span>
            </>
          ) : (
            <>
              <Copy size={15} aria-hidden="true" />
              <span>Copiar enlace del portafolio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
