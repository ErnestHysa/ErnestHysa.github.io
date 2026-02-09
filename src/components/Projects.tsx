"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { PROJECTS } from "@/lib/constants";

const CATEGORY_COLORS: Record<string, string> = {
  "Web App": "#6366f1",
  Mobile: "#06b6d4",
  CLI: "#f59e0b",
  "AI/ML": "#8b5cf6",
  Game: "#ef4444",
};

export function Projects() {
  return (
    <section id="projects" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Portfolio" title="Featured Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <BentoCard
              key={project.name}
              delay={i * 0.08}
              className={project.featured ? "md:col-span-1" : ""}
            >
              {/* Category accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, ${CATEGORY_COLORS[project.category]}80, ${CATEGORY_COLORS[project.category]}20, transparent)`,
                }}
              />

              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[project.category]}12`,
                    color: CATEGORY_COLORS[project.category],
                    border: `1px solid ${CATEGORY_COLORS[project.category]}20`,
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

              <div className="flex flex-wrap gap-1.5">
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
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
