"use client";

import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
