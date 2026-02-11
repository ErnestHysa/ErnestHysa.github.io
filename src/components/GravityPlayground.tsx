"use client";

import { useEffect, useRef, useCallback } from "react";

interface CardPhysics {
  el: HTMLElement;
  origTop: number;
  origLeft: number;
  origWidth: number;
  origHeight: number;
  y: number;
  vy: number;
  rotation: number;
  rotVel: number;
}

export function GravityPlayground() {
  const activeRef = useRef(false);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mouseHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

  const trigger = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    const viewportH = window.innerHeight;
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-bento-card]")
    ).filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < viewportH;
    });

    if (cards.length === 0) {
      activeRef.current = false;
      return;
    }

    const physics: CardPhysics[] = cards.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        origTop: rect.top,
        origLeft: rect.left,
        origWidth: rect.width,
        origHeight: rect.height,
        y: 0,
        vy: 0,
        rotation: 0,
        rotVel: (Math.random() - 0.5) * 200,
      };
    });

    // Freeze cards in place with fixed positioning
    for (const p of physics) {
      const s = p.el.style;
      s.position = "fixed";
      s.top = `${p.origTop}px`;
      s.left = `${p.origLeft}px`;
      s.width = `${p.origWidth}px`;
      s.height = `${p.origHeight}px`;
      s.zIndex = "9998";
      s.transition = "none";
    }

    let lastTime = performance.now();

    const simulate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = now;

      for (const p of physics) {
        p.vy += 980 * dt;
        p.y += p.vy * dt;

        // Bounce off viewport bottom
        if (p.origTop + p.y + p.origHeight > viewportH) {
          p.y = viewportH - p.origHeight - p.origTop;
          p.vy *= -0.6;
        }

        p.rotation += p.rotVel * dt;
        p.rotVel *= 0.99;

        p.el.style.transform = `translateY(${p.y}px) rotate(${p.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(simulate);
    };

    rafRef.current = requestAnimationFrame(simulate);

    // After 3 seconds, spring back
    timeoutRef.current = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);

      for (const p of physics) {
        const s = p.el.style;
        s.transition = "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
        s.transform = "none";
      }

      // After transition, remove all inline styles
      setTimeout(() => {
        for (const p of physics) {
          p.el.style.cssText = "";
        }
        activeRef.current = false;
      }, 850);
    }, 3000);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "g" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        )
      ) {
        trigger();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const history = mouseHistoryRef.current;
      const now = performance.now();
      history.push({ x: e.clientX, y: e.clientY, t: now });

      // Keep last 10 entries for better shake detection
      while (history.length > 10) history.shift();

      // Prune entries older than 500ms
      while (history.length > 2 && now - history[0].t > 500) history.shift();

      if (history.length < 4) return;

      // Count direction changes on X axis (shake = back-and-forth)
      let dirChanges = 0;
      for (let i = 2; i < history.length; i++) {
        const dx1 = history[i - 1].x - history[i - 2].x;
        const dx2 = history[i].x - history[i - 1].x;
        if ((dx1 > 5 && dx2 < -5) || (dx1 < -5 && dx2 > 5)) {
          dirChanges++;
        }
      }

      // Also check Y axis direction changes
      for (let i = 2; i < history.length; i++) {
        const dy1 = history[i - 1].y - history[i - 2].y;
        const dy2 = history[i].y - history[i - 1].y;
        if ((dy1 > 5 && dy2 < -5) || (dy1 < -5 && dy2 > 5)) {
          dirChanges++;
        }
      }

      if (dirChanges >= 3) {
        mouseHistoryRef.current = [];
        trigger();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    if (!isTouchDevice) {
      window.addEventListener("mousemove", onMouseMove);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trigger]);

  return null;
}
