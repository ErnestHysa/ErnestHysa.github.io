"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BentoCard({
  children,
  className = "",
  delay = 0,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shineX: 50, shineY: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const normalX =
      (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const normalY =
      (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    setTilt({
      x: -normalY * 10,
      y: normalX * 10,
      shineX: ((e.clientX - rect.left) / rect.width) * 100,
      shineY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0, shineX: 50, shineY: 50 });
  };

  return (
    /* Outer: Framer Motion entrance animation only */
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay }}
    >
      {/* Inner: 3D tilt + all visual styling (no transform conflict) */}
      <div
        ref={cardRef}
        className={`relative rounded-2xl border p-6 overflow-hidden backdrop-blur-xl ${className}`}
        style={{
          backgroundColor: "var(--surface)",
          borderColor: hovered ? "var(--accent-glow)" : "var(--border)",
          boxShadow: hovered
            ? "0 20px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 40px rgba(16, 185, 129, 0.08)"
            : "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -6 : 0}px)`,
          transition: hovered
            ? "transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease"
            : "transform 0.4s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
          willChange: hovered ? "transform" : "auto",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shine overlay — follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.15), transparent 50%)`,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Top edge highlight — glass effect */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-px"
          style={{
            background: "var(--highlight-gradient)",
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
