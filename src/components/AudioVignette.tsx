"use client";

import { useEffect, useRef } from "react";
import { useAudioReactive } from "./AudioReactiveProvider";

export function AudioVignette() {
  const { isPlaying, bands } = useAudioReactive();
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (!isPlaying) {
      overlay.style.opacity = "0";
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    overlay.style.opacity = "1";

    const animate = () => {
      const energy = bands.current.energy;
      const opacity = energy * 0.35;
      overlay.style.boxShadow = `inset 0 0 ${80 + energy * 60}px rgba(16, 185, 129, ${opacity})`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, bands]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 48,
        opacity: 0,
        transition: "opacity 0.5s ease",
      }}
    />
  );
}
