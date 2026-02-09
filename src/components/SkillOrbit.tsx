"use client";

import { useEffect, useRef, useCallback } from "react";
import { ORBIT_SKILLS } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";

interface Particle {
  label: string;
  angle: number;
  radius: number;
  speed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
  size: number;
}

export function SkillOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { theme } = useTheme();

  const initParticles = useCallback(() => {
    const seed = Date.now() % 10000;
    const pseudoRandom = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    return ORBIT_SKILLS.map((label, i): Particle => {
      const baseRadius = 120 + i * 30 + pseudoRandom(i) * 40;
      return {
        label,
        angle: (i / ORBIT_SKILLS.length) * Math.PI * 2 + pseudoRandom(i + 50) * 0.5,
        radius: baseRadius,
        speed: 0.0003 + pseudoRandom(i + 10) * 0.0004,
        wobbleAmp: 10 + pseudoRandom(i + 20) * 20,
        wobbleFreq: 0.5 + pseudoRandom(i + 30) * 0.5,
        phase: pseudoRandom(i + 40) * Math.PI * 2,
        size: 13 + pseudoRandom(i + 60) * 3,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    particlesRef.current = initParticles();
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    const isDark = theme === "dark";
    const textColor = isDark ? "rgba(241, 245, 249, 0.85)" : "rgba(15, 23, 42, 0.75)";
    const pillBg = isDark ? "rgba(129, 140, 248, 0.12)" : "rgba(99, 102, 241, 0.08)";
    const pillBorder = isDark ? "rgba(129, 140, 248, 0.25)" : "rgba(99, 102, 241, 0.2)";
    const lineColor = isDark ? "rgba(129, 140, 248, 0.06)" : "rgba(99, 102, 241, 0.05)";

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx!.clearRect(0, 0, w, h);
      time += 1;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Draw faint orbital paths
      particles.forEach((p) => {
        ctx!.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.05) {
          const wobble = Math.sin(a * p.wobbleFreq + p.phase) * p.wobbleAmp;
          const r = p.radius + wobble;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (a === 0) ctx!.moveTo(px, py);
          else ctx!.lineTo(px, py);
        }
        ctx!.closePath();
        ctx!.strokeStyle = lineColor;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Draw skill pills
      particles.forEach((p) => {
        p.angle += p.speed;
        const wobble =
          Math.sin(p.angle * p.wobbleFreq + p.phase + time * 0.001) *
          p.wobbleAmp;
        const r = p.radius + wobble;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;

        // Mouse proximity effect
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < 50;
        const scale = isHovered ? 1.15 : 1;

        const fontSize = p.size * scale;
        ctx!.font = `500 ${fontSize}px "Inter", system-ui, sans-serif`;
        const metrics = ctx!.measureText(p.label);
        const textW = metrics.width;
        const pillW = textW + 20;
        const pillH = fontSize + 12;

        // Pill background
        const pillX = x - pillW / 2;
        const pillY = y - pillH / 2;
        const radius = pillH / 2;

        ctx!.beginPath();
        ctx!.roundRect(pillX, pillY, pillW, pillH, radius);
        ctx!.fillStyle = isHovered
          ? isDark
            ? "rgba(129, 140, 248, 0.2)"
            : "rgba(99, 102, 241, 0.15)"
          : pillBg;
        ctx!.fill();
        ctx!.strokeStyle = isHovered
          ? isDark
            ? "rgba(129, 140, 248, 0.5)"
            : "rgba(99, 102, 241, 0.4)"
          : pillBorder;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Text
        ctx!.fillStyle = textColor;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(p.label, x, y);
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Draw static layout once
      time = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.font = `500 ${p.size}px "Inter", system-ui, sans-serif`;
        const metrics = ctx.measureText(p.label);
        const textW = metrics.width;
        const pillW = textW + 20;
        const pillH = p.size + 12;
        const pillX = x - pillW / 2;
        const pillY = y - pillH / 2;
        const radius = pillH / 2;

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, radius);
        ctx.fillStyle = pillBg;
        ctx.fill();
        ctx.strokeStyle = pillBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.label, x, y);
      });
    } else {
      animFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      aria-hidden="true"
      role="presentation"
    />
  );
}
