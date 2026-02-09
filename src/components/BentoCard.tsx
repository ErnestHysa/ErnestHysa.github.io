"use client";

import { motion } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({ children, className = "", delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay }}
      className={`relative rounded-2xl border p-6 overflow-hidden backdrop-blur-xl ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 40px rgba(16, 185, 129, 0.08)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Top edge highlight — glass effect */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-px"
        style={{
          background: "var(--highlight-gradient)",
        }}
      />
      {children}
    </motion.div>
  );
}
