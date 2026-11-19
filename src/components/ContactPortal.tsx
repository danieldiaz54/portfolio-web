"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface ContactPortalProps {
  githubUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

export default function ContactPortal({
  githubUrl,
  copied,
  onCopyLink,
}: ContactPortalProps) {
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = portalRef.current;
    if (!el || typeof window === "undefined") {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { scale: 0.94, y: 32 },
        {
          scale: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 52%",
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

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mx = `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`;
    const my = `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`;
    event.currentTarget.style.setProperty("--mx", mx);
    event.currentTarget.style.setProperty("--my", my);
  };

  return (
    <div ref={portalRef} className="contact-band" onMouseMove={handleMouseMove}>
      <div>
        <h2 id="contacto-title">Conversemos</h2>
        <p>Todos los repositorios son públicos, auditados y tienen despliegue activo en la nube.</p>
      </div>
      <div className="contact-actions">
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
