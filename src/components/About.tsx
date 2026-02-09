"use client";

import { BentoCard } from "@/components/BentoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ABOUT_TEXT } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label="About" title="Who I Am" />
        <BentoCard className="max-w-3xl mx-auto">
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
          >
            {ABOUT_TEXT}
          </p>
        </BentoCard>
      </div>
    </section>
  );
}
