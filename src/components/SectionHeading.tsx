"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
}

const wordVariants = {
  hidden: { opacity: 0, y: 20, rotateX: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 14,
      delay: 0.15 + i * 0.08,
    },
  }),
};

export function SectionHeading({ label, title }: SectionHeadingProps) {
  const words = title.split(" ");

  return (
    <div className="text-center mb-16" style={{ perspective: "600px" }}>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-xs font-mono font-medium uppercase tracking-[0.2em] mb-3"
        style={{ color: "var(--accent)" }}
      >
        {label}
      </motion.p>
      <h2
        className="text-4xl md:text-5xl font-bold tracking-tight flex flex-wrap justify-center gap-x-[0.3em]"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={wordVariants}
            style={{
              display: "inline-block",
              background:
                "linear-gradient(to bottom right, var(--text-primary), var(--text-tertiary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {word}
          </motion.span>
        ))}
      </h2>
    </div>
  );
}
