"use client";

import { useEffect, useRef } from "react";
import type { HeroEffectId } from "@/types/project";

interface FxHandle {
  destroy: () => void;
}

interface FxPalette {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
}

interface FxModule {
  mount: (
    el: HTMLElement,
    effectId: string,
    opts: { palette: FxPalette; params?: Record<string, number>; seed?: number },
  ) => Promise<FxHandle>;
}

const GALLERY_PALETTE: FxPalette = {
  bg: "#f7f7f5",
  surface: "#ffffff",
  ink: "#0a0a0a",
  muted: "#3f3f46",
  accent: "#0044cc",
};

const EFFECT_PARAMS: Record<Exclude<HeroEffectId, "off">, Record<string, number>> = {
  "grid-pulse": {
    cell: 56,
    lineOpacity: 0.09,
    pulses: 4,
    tail: 2.4,
    speed: 110,
    calm: 0.62,
    calmX: 0.3,
    calmY: 0.45,
  },
  "contour-lines": {
    levels: 20,
    opacity: 0.24,
    indexEvery: 5,
    speed: 0.02,
    tint: 0.55,
    calm: 0.62,
    calmX: 0.3,
    calmY: 0.45,
  },
};

function loadFxRuntime(url: string): Promise<FxModule> {
  return import(/* webpackIgnore: true */ url) as Promise<FxModule>;
}

export default function HeroShader({ effect }: { effect: HeroEffectId }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || effect === "off") {
      return undefined;
    }

    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return undefined;
    }

    let cancelled = false;
    let handle: FxHandle | null = null;
    const baseDir = window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
    const fxUrl = new URL("assets/effects/fx.js", baseDir).href;

    loadFxRuntime(fxUrl)
      .then((fx) =>
        fx.mount(el, effect, {
          palette: GALLERY_PALETTE,
          params: EFFECT_PARAMS[effect],
          seed: 7,
        }),
      )
      .then((mounted) => {
        if (cancelled) {
          mounted.destroy();
          return;
        }
        handle = mounted;
      })
      .catch(() => {
        // Permanece el lienzo de papel #F7F7F5
      });

    return () => {
      cancelled = true;
      if (handle) {
        handle.destroy();
      }
    };
  }, [effect]);

  return <div ref={hostRef} className="hero-shader" aria-hidden="true" />;
}
