"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ThemeTransitionProps {
  onMidpoint: () => void;
}

export function ThemeTransition({ onMidpoint }: ThemeTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [clipPath, setClipPath] = useState("");
  const [bgColor, setBgColor] = useState("");
  const midpointFired = useRef(false);
  // Track timers so we can cancel on re-trigger
  const midpointTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const completeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const trigger = useCallback(
    (rect: DOMRect, newThemeBg: string) => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) {
        onMidpoint();
        return;
      }

      // Cancel any in-progress animation timers
      clearTimeout(midpointTimer.current);
      clearTimeout(completeTimer.current);

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      setBgColor(newThemeBg);
      setClipPath(`circle(0px at ${cx}px ${cy}px)`);
      setActive(false); // force reset so effect re-fires
      midpointFired.current = false;

      // Use rAF to ensure the reset renders before starting new animation
      requestAnimationFrame(() => {
        setActive(true);
        requestAnimationFrame(() => {
          setClipPath(`circle(150vmax at ${cx}px ${cy}px)`);
        });
      });
    },
    [onMidpoint]
  );

  // Expose trigger via DOM property so ThemeProvider can call it
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    (el as unknown as { __trigger: typeof trigger }).__trigger = trigger;
  }, [trigger]);

  // Handle midpoint and completion
  useEffect(() => {
    if (!active) return;

    midpointTimer.current = setTimeout(() => {
      if (!midpointFired.current) {
        midpointFired.current = true;
        onMidpoint();
      }
    }, 480); // ~60% of 800ms

    completeTimer.current = setTimeout(() => {
      setActive(false);
    }, 850);

    return () => {
      clearTimeout(midpointTimer.current);
      clearTimeout(completeTimer.current);
    };
  }, [active, onMidpoint]);

  return (
    <div
      ref={overlayRef}
      id="theme-transition-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        pointerEvents: "none",
        backgroundColor: bgColor,
        clipPath: active ? clipPath : "circle(0px at 0px 0px)",
        transition: active
          ? "clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
          : "none",
        visibility: active ? "visible" : "hidden",
      }}
    />
  );
}
