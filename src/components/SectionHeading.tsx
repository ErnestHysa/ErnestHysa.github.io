"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
}

export function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <div className="text-center mb-16">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-xs font-mono font-medium uppercase tracking-[0.2em] mb-3"
        style={{ color: "var(--accent)" }}
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          background: "linear-gradient(to bottom right, var(--text-primary), var(--text-tertiary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </motion.h2>
    </div>
  );
}
