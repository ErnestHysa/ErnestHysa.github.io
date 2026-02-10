"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Lightbulb } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { PROJECTS } from "@/lib/constants";

const CATEGORY_COLORS: Record<string, string> = {
  "Web App": "#10b981",
  Mobile: "#06b6d4",
  CLI: "#f59e0b",
  "AI/ML": "#8b5cf6",
  Game: "#ef4444",
};

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[project.category] || "#10b981";

  return (
    <BentoCard
      delay={index * 0.08}
      className={project.featured ? "md:col-span-1" : ""}
    >
      {/* Category accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${catColor}80, ${catColor}20, transparent)`,
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <span
          className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg"
          style={{
            backgroundColor: `${catColor}12`,
            color: catColor,
            border: `1px solid ${catColor}20`,
          }}
        >
          {project.category}
        </span>
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          whileHover={{ color: "var(--accent)", scale: 1.1 }}
          aria-label={`View ${project.name} on GitHub`}
        >
          <ArrowUpRight size={16} />
        </motion.a>
      </div>

      <h3
        className="text-lg font-bold mb-2"
        style={{
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
        }}
      >
        {project.name}
      </h3>

      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
      >
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs font-mono px-2.5 py-1 rounded-lg border"
            style={{
              backgroundColor: "var(--surface-hover)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Expandable learnings */}
      <div
        className="border-t pt-3 mt-1"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left cursor-pointer group"
        >
          <Lightbulb
            size={14}
            style={{ color: catColor }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider flex-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            What I Learned
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              size={14}
              style={{ color: "var(--text-tertiary)" }}
            />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p
                className="text-sm leading-relaxed mt-3"
                style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
              >
                {project.learnings}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BentoCard>
  );
}

export function Projects() {
  return (
    <section id="projects" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Portfolio" title="Featured Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
