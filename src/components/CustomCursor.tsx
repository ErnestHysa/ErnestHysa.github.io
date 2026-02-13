"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a,button,[role='button'],input,textarea,select,[tabindex]:not([tabindex='-1'])";

const SPARK_COLORS = [
  "rgba(16, 185, 129, 0.8)",
  "rgba(52, 211, 153, 0.7)",
  "rgba(20, 184, 166, 0.8)",
  "rgba(45, 212, 191, 0.6)",
  "rgba(110, 231, 183, 0.5)",
];

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const MAX_SPARKS = 30;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
  const visibleRef = useRef(false);
  const [canRender, setCanRender] = useState(false);

  /* First effect: detect device capabilities */
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!isCoarse && !reduced) setCanRender(true);
  }, []);

  /* Second effect: set up listeners once elements are mounted */
  useEffect(() => {
    if (!canRender) return;

    const dot = dotRef.current;
    const glow = glowRef.current;
    const sparkCanvas = sparkCanvasRef.current;
    if (!dot || !glow || !sparkCanvas) return;

    const sparkCtx = sparkCanvas.getContext("2d");
    if (!sparkCtx) return;

    // Size canvas to viewport
    const resizeCanvas = () => {
      sparkCanvas.width = window.innerWidth;
      sparkCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Spark particle pool (ring buffer)
    const sparks: Spark[] = [];
    let sparkIndex = 0;
    let moveCount = 0;

    const emitSpark = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const maxLife = 0.4 + Math.random() * 0.4; // 0.4-0.8s

      const spark: Spark = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        life: 0,
        maxLife,
        size: 2 + Math.random() * 1.5,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      };

      if (sparks.length < MAX_SPARKS) {
        sparks.push(spark);
      } else {
        sparks[sparkIndex] = spark;
      }
      sparkIndex = (sparkIndex + 1) % MAX_SPARKS;
    };

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!visibleRef.current) {
        visibleRef.current = true;
        dot.style.opacity = "1";
        glow.style.opacity = "1";
      }

      /* Detect interactive elements */
      const target = e.target as HTMLElement;
      const hovering = !!target.closest(INTERACTIVE);
      if (hovering !== hoveringRef.current) {
        hoveringRef.current = hovering;
        dot.classList.toggle("cursor-hover", hovering);
      }

      // Emit spark every 3rd move event
      moveCount++;
      if (moveCount % 3 === 0) {
        emitSpark(e.clientX, e.clientY);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      dot.style.opacity = "0";
      glow.style.opacity = "0";
    };

    /* Combined lerp + spark animation loop */
    let raf: number;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      const dt = lastTime ? (timestamp - lastTime) / 1000 : 0.016;
      lastTime = timestamp;

      // Glow lerp
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.12;
      glow.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;

      // Draw sparks
      sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.maxLife) continue; // skip dead — ring buffer will overwrite

        s.x += s.vx;
        s.vy += 0.5 * dt; // slight gravity
        s.y += s.vy;
        s.vx *= 0.98; // friction
        s.alpha = 1 - s.life / s.maxLife;

        sparkCtx.beginPath();
        sparkCtx.arc(s.x, s.y, s.size * s.alpha, 0, Math.PI * 2);
        sparkCtx.fillStyle = s.color;
        sparkCtx.globalAlpha = s.alpha;
        sparkCtx.fill();
      }
      sparkCtx.globalAlpha = 1;

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);
    document.documentElement.classList.add("cursor-hidden");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [canRender]);

  if (!canRender) return null;

  return (
    <>
      <canvas
        ref={sparkCanvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  );
}
