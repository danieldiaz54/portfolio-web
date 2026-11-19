"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, ServerCog, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface CriterionItem {
  id: "human" | "spec" | "ops";
  title: string;
  text: string;
}

interface EditorialMethodProps {
  items: readonly CriterionItem[];
}

function renderMethodIcon(id: CriterionItem["id"]) {
  if (id === "human") {
    return <Compass size={19} aria-hidden="true" />;
  }
  if (id === "spec") {
    return <ShieldCheck size={19} aria-hidden="true" />;
  }
  return <ServerCog size={19} aria-hidden="true" />;
}

export default function EditorialMethod({ items }: EditorialMethodProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof window === "undefined") {
      return undefined;
    }

    const rows = Array.from(list.querySelectorAll<HTMLElement>(".editorial-row"));
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      rows.forEach((row) => {
        const rule = row.querySelector<HTMLElement>(".editorial-rule");
        const content = row.querySelector<HTMLElement>(".editorial-row-body");

        if (rule) {
          const ruleTween = gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 90%",
                once: true,
              },
            },
          );
          if (ruleTween.scrollTrigger) {
            triggers.push(ruleTween.scrollTrigger);
          }
        }

        if (content) {
          const bodyTween = gsap.fromTo(
            content,
            { y: 16 },
            {
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: row,
                start: "top 92%",
                once: true,
              },
            },
          );
          if (bodyTween.scrollTrigger) {
            triggers.push(bodyTween.scrollTrigger);
          }
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
    <div ref={listRef} className="editorial-list">
      {items.map((item) => (
        <article key={item.id} className="editorial-row">
          <div className="editorial-rule" aria-hidden="true" />
          <div className="editorial-row-body">
            <div className="editorial-row-lead">
              <span className="editorial-icon">{renderMethodIcon(item.id)}</span>
              <h3>{item.title}</h3>
            </div>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
      <div className="editorial-rule editorial-rule-end" aria-hidden="true" />
    </div>
  );
}
