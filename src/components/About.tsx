"use client";

import { BentoCard } from "@/components/BentoCard";
import { ABOUT_TEXT } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <BentoCard className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            About Me
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {ABOUT_TEXT}
          </p>
        </BentoCard>
      </div>
    </section>
  );
}
