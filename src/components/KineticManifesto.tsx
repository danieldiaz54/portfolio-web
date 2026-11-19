"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHT_TOKENS = new Set([
  "problema",
  "humano",
  "real,",
  "dominio",
  "puro",
  "bajo",
  "falla.",
]);

interface KineticManifestoProps {
  text: string;
}

export default function KineticManifesto({ text }: KineticManifestoProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === "undefined") {
      return undefined;
    }

    const targets = stage.querySelectorAll<HTMLElement>(".manifesto-word");
    const bar = stage.querySelector<HTMLElement>(".manifesto-progress-bar");
    const mm = gsap.matchMedia();

    mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 22%",
          end: "+=360",
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        targets,
        { opacity: 0.14, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.045,
          ease: "power2.out",
          duration: 0.85,
        },
        0,
      );

      if (bar) {
        tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.9 }, 0);
      }

      return () => {
        tl.kill();
      };
    });

    mm.add("(max-width: 959px) and (prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        targets,
        { opacity: 0.22 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top 86%",
            end: "top 44%",
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
  }, [text]);

  return (
    <div ref={stageRef} className="manifesto-stage">
      <p className="manifesto-lead">
        {words.map((word, idx) => {
          const isAccent = HIGHLIGHT_TOKENS.has(word.toLowerCase());
          return (
            <span key={`${word}-${idx}`}>
              <span className={`manifesto-word ${isAccent ? "manifesto-accent" : ""}`}>{word}</span>
              {idx < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </p>
      <div className="manifesto-progress-track" aria-hidden="true">
        <div className="manifesto-progress-bar" />
      </div>
    </div>
  );
}
