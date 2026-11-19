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

const KINETIC_PALETTE: FxPalette = {
  bg: "#fafaf8",
  surface: "#ffffff",
  ink: "#0b0f19",
  muted: "#475569",
  accent: "#2563eb",
};

const EFFECT_PARAMS: Record<Exclude<HeroEffectId, "off">, Record<string, number>> = {
  "fluted-glass": {
    ribWidth: 30,
    angle: -6,
    distortion: 0.34,
    highlight: 0.14,
    shadow: 0.08,
    background: 0,
    blur: 0.18,
    speed: 0.025,
    clear: 0.38,
    calm: 0.56,
    calmX: 0.24,
    calmY: 0.48,
  },
  "grain-gradient": {
    speed: 0.35,
    softness: 0.55,
    warp: 0.42,
    grain: 0.38,
    scatter: 0.4,
    tint: 0.35,
    contrast: 0.32,
    calm: 0.62,
    calmX: 0.24,
    calmY: 0.5,
    grainMotion: 1,
  },
  "grid-pulse": {
    cell: 56,
    lineOpacity: 0.09,
    pulses: 4,
    tail: 2.4,
    speed: 110,
    calm: 0.62,
    calmX: 0.28,
    calmY: 0.46,
  },
  "contour-lines": {
    levels: 20,
    opacity: 0.24,
    indexEvery: 5,
    speed: 0.02,
    tint: 0.55,
    calm: 0.62,
    calmX: 0.28,
    calmY: 0.46,
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
    const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const normalizedBase =
      rawBase && rawBase !== "/" ? rawBase.replace(/\/$/, "") : "";
    const fxUrl = `${window.location.origin}${normalizedBase}/assets/effects/fx.js`;

    loadFxRuntime(fxUrl)
      .then((fx) =>
        fx.mount(el, effect, {
          palette: KINETIC_PALETTE,
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
        // Permanece el lienzo luminoso #FAFAF8
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
