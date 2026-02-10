"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface TextParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface ParticleTextProps {
  text: string;
  className?: string;
}

export function ParticleText({ text, className = "" }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<TextParticle[]>([]);
  const animFrameRef = useRef<number>(0);
  const initializedRef = useRef(false);
  const { theme } = useTheme();

  const sampleTextPixels = useCallback(
    (
      text: string,
      width: number,
      height: number,
      isDark: boolean
    ): TextParticle[] => {
      if (width < 10 || height < 10) return [];

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d")!;

      // Responsive font size — fill ~80% of width
      let fontSize = 80;
      offCtx.font = `800 ${fontSize}px "Satoshi", "Inter", system-ui, sans-serif`;
      const measured = offCtx.measureText(text).width;
      if (measured <= 0) return [];

      fontSize = Math.floor((fontSize * width * 0.82) / measured);
      fontSize = Math.min(fontSize, Math.floor(height * 0.72));
      if (fontSize < 8) return [];

      offCtx.font = `800 ${fontSize}px "Satoshi", "Inter", system-ui, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#fff";
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const particles: TextParticle[] = [];

      // Adaptive gap: more particles on larger screens, fewer on mobile
      const gap = width < 500 ? 5 : width < 900 ? 3 : 2;

      const colors = isDark
        ? [
            "rgba(52, 211, 153, 0.95)",
            "rgba(45, 212, 191, 0.85)",
            "rgba(110, 231, 183, 0.9)",
            "rgba(167, 243, 208, 0.75)",
            "rgba(209, 250, 229, 0.6)",
          ]
        : [
            "rgba(16, 185, 129, 0.9)",
            "rgba(13, 148, 136, 0.85)",
            "rgba(5, 150, 105, 0.95)",
            "rgba(20, 184, 166, 0.8)",
            "rgba(4, 120, 87, 0.7)",
          ];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const i = (y * width + x) * 4;
          if (pixels[i + 3] > 128) {
            // Start at target position (visible immediately)
            // then scatter outward and reassemble for entrance effect
            particles.push({
              x,
              y,
              targetX: x,
              targetY: y,
              vx: 0,
              vy: 0,
              size: 1.2 + Math.random() * 1.6,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
        }
      }

      return particles;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();

      if (rect.width < 10 || rect.height < 10) return false;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particles = sampleTextPixels(text, rect.width, rect.height, isDark);
      if (particles.length === 0) return false;

      particlesRef.current = particles;
      initializedRef.current = true;
      return true;
    };

    // Wait for fonts to load, then initialize
    const init = () => {
      if (!setupCanvas()) {
        // Retry after a short delay if setup failed
        setTimeout(init, 150);
      }
    };

    document.fonts.ready.then(init);

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initializedRef.current = false;
        setupCanvas();
      }, 200);
    };
    window.addEventListener("resize", debouncedResize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleLeave);

    // Physics
    const MOUSE_RADIUS = 100;
    const MOUSE_FORCE = 10;
    const SPRING = 0.06;
    const DAMPING = 0.88;

    function draw() {
      const parent = canvas!.parentElement!;
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx!.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force =
            ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring toward target
        p.vx += (p.targetX - p.x) * SPRING;
        p.vy += (p.targetY - p.y) * SPRING;

        // Damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    // Reduced motion: skip animation, draw at target
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
      animFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme, text, sampleTextPixels]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label={text}
      />
      {/* Hidden text for SEO / screen readers */}
      <h1 className="sr-only">{text}</h1>
    </div>
  );
}
