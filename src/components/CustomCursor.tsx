"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  "a,button,[role='button'],input,textarea,select,[tabindex]:not([tabindex='-1'])";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
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
    if (!dot || !glow) return;

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      dot.style.opacity = "1";
      glow.style.opacity = "1";

      /* Detect interactive elements */
      const target = e.target as HTMLElement;
      const hovering = !!target.closest(INTERACTIVE);
      if (hovering !== hoveringRef.current) {
        hoveringRef.current = hovering;
        dot.classList.toggle("cursor-hover", hovering);
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      glow.style.opacity = "0";
    };

    /* Lerp loop for the glow follower */
    let raf: number;
    const animate = () => {
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.12;
      glow.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);
    document.documentElement.classList.add("cursor-hidden");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [canRender]);

  if (!canRender) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  );
}
