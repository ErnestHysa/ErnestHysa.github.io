"use client";

import { useEffect, useRef, useCallback } from "react";
import { ORBIT_SKILLS } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";

interface Particle {
  label: string;
  angle: number;
  radius: number;
  speed: number;
  baseSpeed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
  size: number;
  // Magnetic pull state
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  hovered: boolean;
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
      const baseRadius = 140 + i * 35 + pseudoRandom(i) * 40;
      const speed = 0.0003 + pseudoRandom(i + 10) * 0.0004;
      return {
        label,
        angle: (i / ORBIT_SKILLS.length) * Math.PI * 2 + pseudoRandom(i + 50) * 0.5,
        radius: baseRadius,
        speed,
        baseSpeed: speed,
        wobbleAmp: 10 + pseudoRandom(i + 20) * 20,
        wobbleFreq: 0.5 + pseudoRandom(i + 30) * 0.5,
        phase: pseudoRandom(i + 40) * Math.PI * 2,
        size: 14 + pseudoRandom(i + 60) * 3,
        offsetX: 0,
        offsetY: 0,
        velocityX: 0,
        velocityY: 0,
        hovered: false,
      };
    });
  }, []);

  // Keep theme in a ref so the rAF loop always reads the latest without re-running the effect
  const isDarkRef = useRef(theme === "dark");
  isDarkRef.current = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only init particles on mount — not on theme change
    if (particlesRef.current.length === 0) {
      particlesRef.current = initParticles();
    }
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Theme colors are computed per-frame from isDarkRef so they respond
    // to theme changes without re-running the effect (which would reset particles).
    function themeColors() {
      const d = isDarkRef.current;
      return {
        textColor: d ? "rgba(241, 245, 249, 0.9)" : "rgba(15, 23, 42, 0.8)",
        pillBg: d ? "rgba(52, 211, 153, 0.1)" : "rgba(16, 185, 129, 0.07)",
        pillBorder: d ? "rgba(52, 211, 153, 0.22)" : "rgba(16, 185, 129, 0.18)",
        pillHoverBg: d ? "rgba(52, 211, 153, 0.22)" : "rgba(16, 185, 129, 0.15)",
        pillHoverBorder: d ? "rgba(52, 211, 153, 0.5)" : "rgba(16, 185, 129, 0.4)",
        lineColor: d ? "rgba(52, 211, 153, 0.07)" : "rgba(16, 185, 129, 0.06)",
        lineHoverColor: d ? "rgba(52, 211, 153, 0.15)" : "rgba(16, 185, 129, 0.12)",
        glowColor: d ? "rgba(52, 211, 153, 0.3)" : "rgba(16, 185, 129, 0.2)",
      };
    }

    // Spring physics constants
    const SPRING_STIFFNESS = 0.04;
    const SPRING_DAMPING = 0.82;
    const MAGNETIC_RANGE = 120;
    const MAGNETIC_STRENGTH = 0.35;
    const REPEL_RANGE = 80;
    const REPEL_STRENGTH = 0.15;

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w / 2;
      const cy = h / 2;

      ctx!.clearRect(0, 0, w, h);
      time += 1;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const isDark = isDarkRef.current;
      const { textColor, pillBg, pillBorder, pillHoverBg, pillHoverBorder, lineColor, lineHoverColor, glowColor } = themeColors();

      // Find which particle is closest to cursor
      let hoveredIndex = -1;
      let closestDist = 60; // max hover detection range
      particles.forEach((p, i) => {
        const wobble = Math.sin(p.angle * p.wobbleFreq + p.phase + time * 0.001) * p.wobbleAmp;
        const r = p.radius + wobble;
        const x = cx + Math.cos(p.angle) * r + p.offsetX;
        const y = cy + Math.sin(p.angle) * r + p.offsetY;

        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          hoveredIndex = i;
        }
      });

      // Draw orbital paths with varying opacity
      particles.forEach((p, i) => {
        const isThisHovered = i === hoveredIndex;
        ctx!.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.04) {
          const wobble = Math.sin(a * p.wobbleFreq + p.phase) * p.wobbleAmp;
          const r = p.radius + wobble;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (a === 0) ctx!.moveTo(px, py);
          else ctx!.lineTo(px, py);
        }
        ctx!.closePath();
        ctx!.strokeStyle = isThisHovered ? lineHoverColor : lineColor;
        ctx!.lineWidth = isThisHovered ? 2.5 : 1.5;
        ctx!.stroke();
      });

      // Draw center dot
      ctx!.beginPath();
      ctx!.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx!.fillStyle = isDark ? "rgba(52, 211, 153, 0.25)" : "rgba(16, 185, 129, 0.2)";
      ctx!.fill();

      // Update and draw skill pills
      particles.forEach((p, i) => {
        const isThisHovered = i === hoveredIndex;

        // Slow down when hovered, speed up slightly when not
        if (isThisHovered) {
          p.speed = p.baseSpeed * 0.15;
        } else {
          p.speed += (p.baseSpeed - p.speed) * 0.05;
        }

        p.angle += p.speed;
        const wobble = Math.sin(p.angle * p.wobbleFreq + p.phase + time * 0.001) * p.wobbleAmp;
        const r = p.radius + wobble;
        const baseX = cx + Math.cos(p.angle) * r;
        const baseY = cy + Math.sin(p.angle) * r;

        // Magnetic pull physics
        const dx = mouse.x - (baseX + p.offsetX);
        const dy = mouse.y - (baseY + p.offsetY);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (isThisHovered && dist < MAGNETIC_RANGE) {
          // Pull toward cursor
          const pullForce = MAGNETIC_STRENGTH * (1 - dist / MAGNETIC_RANGE);
          p.velocityX += dx * pullForce * 0.03;
          p.velocityY += dy * pullForce * 0.03;
        } else if (!isThisHovered && hoveredIndex !== -1 && dist < REPEL_RANGE) {
          // Gently push non-hovered pills away from cursor
          const repelForce = REPEL_STRENGTH * (1 - dist / REPEL_RANGE);
          p.velocityX -= dx * repelForce * 0.01;
          p.velocityY -= dy * repelForce * 0.01;
        }

        // Spring back to origin
        p.velocityX += -p.offsetX * SPRING_STIFFNESS;
        p.velocityY += -p.offsetY * SPRING_STIFFNESS;

        // Apply damping
        p.velocityX *= SPRING_DAMPING;
        p.velocityY *= SPRING_DAMPING;

        // Update position
        p.offsetX += p.velocityX;
        p.offsetY += p.velocityY;

        const x = baseX + p.offsetX;
        const y = baseY + p.offsetY;

        const scale = isThisHovered ? 1.2 : 1;
        const fontSize = p.size * scale;
        ctx!.font = `600 ${fontSize}px "Inter", system-ui, sans-serif`;
        const metrics = ctx!.measureText(p.label);
        const textW = metrics.width;
        const pillW = textW + 24;
        const pillH = fontSize + 14;

        // Pill background
        const pillX = x - pillW / 2;
        const pillY = y - pillH / 2;
        const cornerRadius = pillH / 2;

        // Glow effect for hovered pill
        if (isThisHovered) {
          ctx!.shadowColor = glowColor;
          ctx!.shadowBlur = 20;
        }

        ctx!.beginPath();
        ctx!.roundRect(pillX, pillY, pillW, pillH, cornerRadius);
        ctx!.fillStyle = isThisHovered ? pillHoverBg : pillBg;
        ctx!.fill();
        ctx!.strokeStyle = isThisHovered ? pillHoverBorder : pillBorder;
        ctx!.lineWidth = isThisHovered ? 1.5 : 1;
        ctx!.stroke();

        // Reset shadow
        ctx!.shadowColor = "transparent";
        ctx!.shadowBlur = 0;

        // Draw connecting line from pill to center when hovered
        if (isThisHovered) {
          ctx!.beginPath();
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(x, y);
          ctx!.strokeStyle = lineHoverColor;
          ctx!.lineWidth = 1;
          ctx!.setLineDash([4, 6]);
          ctx!.stroke();
          ctx!.setLineDash([]);
        }

        // Text
        ctx!.fillStyle = isThisHovered
          ? (isDark ? "rgba(52, 211, 153, 1)" : "rgba(13, 148, 136, 1)")
          : textColor;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(p.label, x, y);

        p.hovered = isThisHovered;
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
      const { textColor: tc, pillBg: pb, pillBorder: pbo, lineColor: lc } = themeColors();

      ctx.clearRect(0, 0, w, h);

      // Draw orbital paths
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.04) {
          const wobble = Math.sin(a * p.wobbleFreq + p.phase) * p.wobbleAmp;
          const r = p.radius + wobble;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = lc;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw pills
      particlesRef.current.forEach((p) => {
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.font = `600 ${p.size}px "Inter", system-ui, sans-serif`;
        const metrics = ctx.measureText(p.label);
        const textW = metrics.width;
        const pillW = textW + 24;
        const pillH = p.size + 14;
        const pillX = x - pillW / 2;
        const pillY = y - pillH / 2;
        const cornerRadius = pillH / 2;

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, cornerRadius);
        ctx.fillStyle = pb;
        ctx.fill();
        ctx.strokeStyle = pbo;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = tc;
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
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      aria-hidden="true"
      role="presentation"
    />
  );
}
