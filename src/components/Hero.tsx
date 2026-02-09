"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SITE } from "@/lib/constants";
import { SkillOrbit } from "@/components/SkillOrbit";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Skill orbit background */}
      <SkillOrbit />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {SITE.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl font-medium mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-2.5 text-sm font-medium rounded-lg transition-all"
            style={{
              backgroundColor: "var(--accent)",
              color: "white",
            }}
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-2.5 text-sm font-medium rounded-lg border transition-all"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            size={24}
            style={{ color: "var(--text-secondary)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
