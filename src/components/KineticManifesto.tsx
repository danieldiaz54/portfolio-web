"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface KineticManifestoProps {
  text: string;
}

export default function KineticManifesto({ text }: KineticManifestoProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return undefined;
    }
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return undefined;
    }

    const targets = el.querySelectorAll<HTMLElement>(".manifesto-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0.28 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            end: "top 44%",
            scrub: 0.6,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={containerRef} className="manifesto-lead">
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`}>
          <span className="manifesto-word">{word}</span>
          {idx < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
