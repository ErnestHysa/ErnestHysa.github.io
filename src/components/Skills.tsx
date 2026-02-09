"use client";

import { motion } from "framer-motion";
import { Code2, Layers, Wrench, Brain, Puzzle } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SKILL_CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS = [Code2, Layers, Wrench, Brain, Puzzle];

export function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="Expertise" title="Skills & Technologies" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_CATEGORIES.map((category, i) => {
            const Icon = CATEGORY_ICONS[i];
            return (
              <BentoCard
                key={category.title}
                delay={i * 0.08}
                className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.15)",
                    }}
                  >
                    <Icon size={14} className="text-white" />
                  </div>
                  <h3
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      className="text-sm font-mono px-3 py-1.5 rounded-lg border cursor-default"
                      style={{
                        backgroundColor: "var(--surface-hover)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-primary)",
                      }}
                      whileHover={{
                        scale: 1.05,
                        borderColor: "var(--accent)",
                        boxShadow: "0 0 16px rgba(99, 102, 241, 0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
