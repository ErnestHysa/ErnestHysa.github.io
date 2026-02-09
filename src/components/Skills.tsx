"use client";

import { motion } from "framer-motion";
import { BentoCard } from "@/components/BentoCard";
import { SKILL_CATEGORIES } from "@/lib/constants";

export function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Skills & Technologies
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_CATEGORIES.map((category, i) => (
            <BentoCard
              key={category.title}
              delay={i * 0.1}
              className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <h3
                className="text-sm font-bold uppercase tracking-wider mb-4"
                style={{ color: "var(--accent)" }}
              >
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-mono px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: "var(--surface-hover)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {skill}
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
