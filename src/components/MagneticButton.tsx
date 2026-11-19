"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.22,
}: MagneticButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 24, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 320, damping: 24, mass: 0.4 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = hostRef.current;
    if (!node) {
      return;
    }
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    rawX.set(dx * strength);
    rawY.set(dy * strength);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={hostRef}
      className={`magnetic-wrap ${className}`.trim()}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
