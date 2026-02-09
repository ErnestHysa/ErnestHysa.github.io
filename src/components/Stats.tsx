"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, Code2, Calendar, Brain } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { STATS } from "@/lib/constants";

const STAT_ICONS = [GitBranch, Code2, Calendar, Brain];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1500;
    const step = duration / value;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, step);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <BentoCard key={stat.label} delay={i * 0.08}>
                <div className="text-center">
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
