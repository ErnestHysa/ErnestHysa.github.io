"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SITE } from "@/lib/constants";
import { SkillOrbit } from "@/components/SkillOrbit";
import { GradientOrb } from "@/components/GradientOrb";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ambient gradient orbs */}
      <GradientOrb
        className="top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        size="800px"
      />
      <GradientOrb
        className="bottom-0 right-0"
        size="400px"
        color1="rgba(168, 85, 247, 0.5)"
        color2="rgba(99, 102, 241, 0.3)"
      />

      {/* Skill orbit background */}
      <SkillOrbit />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-mono font-medium tracking-[0.15em] uppercase mb-6"
            style={{ color: "var(--accent)" }}
          >
            Portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
            }}
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-shimmer text-lg sm:text-xl font-medium mb-10 max-w-2xl mx-auto"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.a
              href="#projects"
              className="relative px-7 py-3 text-sm font-semibold rounded-xl text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-7 py-3 text-sm font-semibold rounded-xl border backdrop-blur-sm"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                backgroundColor: "var(--surface)",
              }}
              whileHover={{
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-xs font-medium tracking-wider uppercase"
            style={{ color: "var(--text-tertiary)" }}
          >
            Scroll
          </span>
          <div
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
            style={{ borderColor: "var(--border)" }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
