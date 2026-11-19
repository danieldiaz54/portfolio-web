"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, ServerCog, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface CriterionItem {
  id: "human" | "spec" | "ops";
  title: string;
  text: string;
}

interface CriteriaStackProps {
  items: readonly CriterionItem[];
}

function renderCriterionIcon(id: CriterionItem["id"]) {
  if (id === "human") {
    return <Compass size={19} aria-hidden="true" />;
  }
  if (id === "spec") {
    return <ShieldCheck size={19} aria-hidden="true" />;
  }
  return <ServerCog size={19} aria-hidden="true" />;
}

export default function CriteriaStack({ items }: CriteriaStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = stackRef.current;
    if (!container || typeof window === "undefined") {
      return undefined;
    }

    const cards = Array.from(container.querySelectorAll<HTMLElement>(".criteria-card"));
    const mm = gsap.matchMedia();

    mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      cards.forEach((card, idx) => {
        const nextCard = cards[idx + 1];
        if (!nextCard) {
          return;
        }
        const tween = gsap.to(card, {
          scale: 0.94,
          opacity: 0.76,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 82%",
            end: "top 24%",
            scrub: true,
          },
        });
        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    });

    mm.add("(max-width: 959px) and (prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      cards.forEach((card) => {
        const tween = gsap.fromTo(
          card,
          { y: 18, scale: 0.97 },
          {
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              once: true,
            },
          },
        );
        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, [items.length]);

  return (
    <div ref={stackRef} className="criteria-stack">
      {items.map((item, idx) => (
        <article
          key={item.id}
          className="criteria-card"
          style={{ "--card-idx": idx } as CSSProperties}
        >
          <div className="criteria-card-head">
            <span className="criteria-icon">{renderCriterionIcon(item.id)}</span>
            <h3>{item.title}</h3>
          </div>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}
