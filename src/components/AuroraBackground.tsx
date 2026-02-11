"use client";

import { useEffect, useRef } from "react";

// Color phases: emerald → cyan → violet
const PHASES = [
  // 0-30%: Emerald/teal
  [
    { r: 16, g: 185, b: 129 },
    { r: 20, g: 184, b: 166 },
    { r: 52, g: 211, b: 153 },
  ],
  // 30-60%: Cyan/blue
  [
    { r: 6, g: 182, b: 212 },
    { r: 14, g: 165, b: 233 },
    { r: 56, g: 189, b: 248 },
  ],
  // 60-100%: Violet/purple
  [
    { r: 139, g: 92, b: 246 },
    { r: 167, g: 139, b: 250 },
    { r: 124, g: 58, b: 237 },
  ],
];

function lerpColor(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  t: number
) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function getColorAtScroll(scrollPct: number, blobIndex: number) {
  if (scrollPct <= 0.3) {
    const t = scrollPct / 0.3;
    return lerpColor(PHASES[0][blobIndex], PHASES[1][blobIndex], t);
  } else if (scrollPct <= 0.6) {
    const t = (scrollPct - 0.3) / 0.3;
    return lerpColor(PHASES[1][blobIndex], PHASES[2][blobIndex], t);
  } else {
    return PHASES[2][blobIndex];
  }
}

export function AuroraBackground() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;

        blobRefs.current.forEach((blob, i) => {
          if (!blob) return;
          const c = getColorAtScroll(pct, i);
          const opacity = i === 0 ? 0.6 : i === 1 ? 0.5 : 0.45;
          blob.style.background = `radial-gradient(circle, rgba(${c.r}, ${c.g}, ${c.b}, ${opacity}), transparent 70%)`;
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="aurora-container" aria-hidden="true">
      <div
        ref={(el) => { blobRefs.current[0] = el; }}
        className="aurora-blob aurora-1"
      />
      <div
        ref={(el) => { blobRefs.current[1] = el; }}
        className="aurora-blob aurora-2"
      />
      <div
        ref={(el) => { blobRefs.current[2] = el; }}
        className="aurora-blob aurora-3"
      />
    </div>
  );
}
