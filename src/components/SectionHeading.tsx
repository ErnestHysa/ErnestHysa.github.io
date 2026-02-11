"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  label: string;
  title: string;
}

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function useScrambleText(text: string, inView: boolean) {
  const [display, setDisplay] = useState(text);
  const hasRun = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout | typeof setInterval>[]>(
    []
  );

  useEffect(() => {
    if (!inView || hasRun.current) return;
    hasRun.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setDisplay(text);
      return;
    }

    const chars = text.split("");
    const current = chars.map((c) =>
      c === " "
        ? " "
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    );

    setDisplay(current.join(""));

    const staggerMs = 50;
    const scrambleDuration = 300;
    const scrambleInterval = 50;

    chars.forEach((targetChar, i) => {
      if (targetChar === " ") return;

      const charDelay = i * staggerMs;

      const outerTimer = setTimeout(() => {
        const scrambleTimer = setInterval(() => {
          current[i] =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          setDisplay(current.join(""));
        }, scrambleInterval);
        timers.current.push(scrambleTimer);

        const settleTimer = setTimeout(() => {
          clearInterval(scrambleTimer);
          current[i] = targetChar;
          setDisplay(current.join(""));
        }, scrambleDuration);
        timers.current.push(settleTimer);
      }, charDelay);
      timers.current.push(outerTimer);
    });

    return () => {
      timers.current.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
      });
      timers.current = [];
    };
  }, [inView, text]);

  return display;
}

export function SectionHeading({ label, title }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const scrambledTitle = useScrambleText(title, inView);

  return (
    <div ref={ref} className="text-center mb-16">
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-xs font-mono font-medium uppercase tracking-[0.2em] mb-3"
        style={{ color: "var(--accent)" }}
      >
        {label}
      </motion.p>
      <h2
        className="text-4xl md:text-5xl font-bold tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          background:
            "linear-gradient(to bottom right, var(--text-primary), var(--text-tertiary))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {scrambledTitle}
      </h2>
    </div>
  );
}
