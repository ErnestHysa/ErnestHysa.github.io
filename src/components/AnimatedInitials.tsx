"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.2, ease: "easeInOut" as const, delay },
      opacity: { duration: 0.2, delay },
    },
  }),
};

const fillVariants = {
  hidden: { fillOpacity: 0 },
  visible: (delay: number) => ({
    fillOpacity: 0.15,
    transition: { duration: 0.8, delay: delay + 1.2 },
  }),
};

export function AnimatedInitials() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(true); // default to reduced to prevent flash

  useEffect(() => {
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(isReduced);
    setMounted(true);
  }, []);

  // Before mount, render nothing to avoid hydration mismatch
  if (!mounted) return null;

  // Static version for reduced motion — show the letters immediately
  if (reduced) {
    return (
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 sm:h-16 w-auto mx-auto mb-4"
        aria-label="EH initials"
      >
        <path
          d="M8 8 H38 M8 8 V52 M8 30 H32 M8 52 H38"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 8 H38 V30 H8 V52 H38"
          fill="var(--accent)"
          fillOpacity="0.15"
        />
        <path
          d="M68 8 V52 M68 30 H98 M98 8 V52"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M68 8 H98 V52 H68 Z"
          fill="var(--accent)"
          fillOpacity="0.15"
        />
      </svg>
    );
  }

  // Animated version
  return (
    <motion.svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-14 sm:h-16 w-auto mx-auto mb-4"
      initial="hidden"
      animate="visible"
      aria-label="EH initials"
    >
      {/* E - geometric letter */}
      <motion.path
        d="M8 8 H38 M8 8 V52 M8 30 H32 M8 52 H38"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
        custom={0}
      />
      <motion.path
        d="M8 8 H38 V30 H8 V52 H38"
        fill="var(--accent)"
        variants={fillVariants}
        custom={0}
      />

      {/* H - geometric letter */}
      <motion.path
        d="M68 8 V52 M68 30 H98 M98 8 V52"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
        custom={0.4}
      />
      <motion.path
        d="M68 8 H98 V52 H68 Z"
        fill="var(--accent)"
        variants={fillVariants}
        custom={0.4}
      />
    </motion.svg>
  );
}
