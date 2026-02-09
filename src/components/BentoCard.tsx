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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
      whileHover={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </motion.div>
  );
}
