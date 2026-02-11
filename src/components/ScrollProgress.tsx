"use client";

import { useEffect, useRef } from "react";
import { useAudioReactive } from "./AudioReactiveProvider";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const { isPlaying, bands } = useAudioReactive();
  const audioRafRef = useRef<number>(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Energy-reactive glow
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    if (!isPlaying) {
      bar.style.boxShadow = "";
      cancelAnimationFrame(audioRafRef.current);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const animate = () => {
      const energy = bands.current.energy;
      bar.style.boxShadow = `0 0 ${energy * 12}px rgba(16, 185, 129, ${energy * 0.5})`;
      audioRafRef.current = requestAnimationFrame(animate);
    };

    audioRafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(audioRafRef.current);
  }, [isPlaying, bands]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 51,
        transformOrigin: "left",
        transform: "scaleX(0)",
        background:
          "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
        willChange: "transform",
      }}
    />
  );
}
