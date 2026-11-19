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

const CINEMA_PALETTE: FxPalette = {
  bg: "#06080d",
  surface: "#0c111d",
  ink: "#f8fafc",
  muted: "#94a3b8",
  accent: "#3b82f6",
};

const EFFECT_PARAMS: Record<Exclude<HeroEffectId, "off">, Record<string, number>> = {
  "prism-dispersion": {
    splitX: 0.68,
    splitY: 0.34,
    bend: 32,
    fanSpread: 0.44,
    hueSpread: 45,
    beamWidth: 0.006,
    haze: 0.46,
    intensity: 1.05,
    sway: 0.025,
    calm: 0.58,
    calmX: 0.24,
    calmY: 0.5,
  },
  "spotlight-cone": {
    x: 0.68,
    lean: 0.34,
    width: 0.24,
    poolY: 0.84,
    haze: 0.46,
    edge: 0.55,
    intensity: 1.05,
    breathe: 0.18,
    speed: 0.14,
    calm: 0.58,
    calmX: 0.24,
    calmY: 0.48,
  },
  "god-rays": {
    originX: 0.72,
    originY: -0.18,
    tilt: -18,
    spread: 58,
    density: 0.38,
    intensity: 0.78,
    falloff: 1.25,
    speed: 0.04,
    dust: 0.34,
    tint: 0.55,
    calm: 0.58,
    calmX: 0.24,
    calmY: 0.5,
  },
  "fluted-glass": {
    ribWidth: 30,
    angle: -6,
    distortion: 0.36,
    highlight: 0.16,
    shadow: 0.12,
    background: 0,
    blur: 0.18,
    speed: 0.025,
    clear: 0.42,
    calm: 0.6,
    calmX: 0.26,
    calmY: 0.48,
  },
  "grid-pulse": {
    cell: 56,
    lineOpacity: 0.1,
    pulses: 4,
    tail: 2.4,
    speed: 110,
    calm: 0.62,
    calmX: 0.28,
    calmY: 0.46,
  },
  "contour-lines": {
    levels: 20,
    opacity: 0.22,
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
          palette: CINEMA_PALETTE,
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
        // Permanece el lienzo obsidiana #06080D
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
