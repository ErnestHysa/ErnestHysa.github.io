"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  alpha: number;
}

const COLORS = [
  "#10b981",
  "#34d399",
  "#14b8a6",
  "#2dd4bf",
  "#059669",
  "#0d9488",
  "#6ee7b7",
  "#5eead4",
];

export function Confetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width ?? canvas.offsetWidth;
    canvas.height = rect?.height ?? canvas.offsetHeight;

    const particles: Particle[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 8 + 4),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 4,
        alpha: 1,
      });
    }

    let raf: number;
    const startTime = performance.now();
    const duration = 3000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.15; // gravity
        p.y += p.vy;
        p.vx *= 0.99; // friction
        p.rotation += p.rotationSpeed;
        p.alpha = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}
