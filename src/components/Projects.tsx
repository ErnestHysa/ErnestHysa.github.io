"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((project, i) => (
            <BentoCard
              key={project.name}
              delay={i * 0.1}
              className={
                project.featured ? "md:col-span-1 md:row-span-1" : ""
              }
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className="text-xs font-mono font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[project.category]}15`,
                    color: CATEGORY_COLORS[project.category],
                  }}
                >
                  {project.category}
                </span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label={`View ${project.name} on GitHub`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {project.name}
              </h3>

              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--surface-hover)",
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
