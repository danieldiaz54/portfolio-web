"use client";

import type { CSSProperties } from "react";
import type { HeroEffectId } from "@/types/project";
import HeroShader from "@/components/HeroShader";

interface FixedBackdropProps {
  effect: HeroEffectId;
  accent: string;
}

export default function FixedBackdrop({ effect, accent }: FixedBackdropProps) {
  return (
    <div
      className="cinema-backdrop"
      style={{ "--scene-accent": accent } as CSSProperties}
      aria-hidden="true"
    >
      <HeroShader effect={effect} />
      <div className="cinema-chroma-wash" />
      <div className="cinema-vignette" />
    </div>
  );
}
