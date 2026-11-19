"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
}

interface ScrollContextValue {
  scrollTo: (target: string | number, opts?: ScrollToOptions) => void;
}

function nativeScrollFallback(target: string | number, opts?: ScrollToOptions) {
  if (typeof window === "undefined") {
    return;
  }
  const offset = opts?.offset ?? 0;
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(target);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollTo: nativeScrollFallback,
});

export function useSmoothScroll(): ScrollContextValue {
  return useContext(ScrollContext);
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let cancelled = false;
    if (document.fonts && typeof document.fonts.ready?.then === "function") {
      void document.fonts.ready.then(() => {
        if (!cancelled) {
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      cancelled = true;
      lenisRef.current = null;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const scrollTo = useCallback((target: string | number, opts?: ScrollToOptions) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: opts?.offset ?? 0,
        duration: opts?.duration ?? 0.9,
      });
      return;
    }
    nativeScrollFallback(target, opts);
  }, []);

  const value = useMemo<ScrollContextValue>(() => ({ scrollTo }), [scrollTo]);

  return (
    <ScrollContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ScrollContext.Provider>
  );
}
