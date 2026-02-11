"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GitBranch, Code2, Calendar, Brain } from "lucide-react";
import { BentoCard } from "@/components/BentoCard";
import { STATS } from "@/lib/constants";

const STAT_ICONS = [GitBranch, Code2, Calendar, Brain];

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setCount(value);
      setDone(true);
      return;
    }

    const duration = 2000;
    let start: number | null = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(t);
      setCount(Math.round(eased * value));

      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      animate={
        done
          ? {
              scale: [1, 1.05, 1],
              textShadow: [
                "0 0 0px transparent",
                "0 0 16px rgba(16, 185, 129, 0.5)",
                "0 0 0px transparent",
              ],
            }
          : undefined
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ display: "inline-block" }}
    >
      {count.toLocaleString()}
      {suffix}
    </motion.span>
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
