"use client";

import { motion } from "framer-motion";

interface GradientOrbProps {
  className?: string;
  size?: string;
  color1?: string;
  color2?: string;
}

export function GradientOrb({
  className = "",
  size = "600px",
  color1 = "var(--gradient-start)",
  color2 = "var(--gradient-end)",
}: GradientOrbProps) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color1}20, ${color2}10, transparent 70%)`,
        filter: "blur(80px)",
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -20, 15, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
}
