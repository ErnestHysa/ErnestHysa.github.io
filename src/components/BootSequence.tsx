"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const BOOT_LINES = [
  "> Initializing system...",
  "> Loading modules... ",
  "> Establishing connection...",
  "> Welcome.",
  ">",
  "> ERNEST HYSA",
  "> Full-Stack Developer",
];

const PROGRESS_LINE_INDEX = 1;
const PROGRESS_BLOCKS = 12;

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const currentTextRef = useRef("");

  // Keep ref in sync with state
  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  const shouldSkip = useCallback(() => {
    if (typeof window === "undefined") return true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return true;
    try {
      if (sessionStorage.getItem("boot-seen")) return true;
    } catch {
      // sessionStorage not available
    }
    return false;
  }, []);

  useEffect(() => {
    if (shouldSkip()) {
      setVisible(false);
      onCompleteRef.current();
      return;
    }

    // Prevent scrolling during boot sequence
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cursorTimer = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    let lineIdx = 0;
    let charIdx = 0;
    let progressCount = 0;
    let phase: "typing" | "progress" | "pause" = "typing";
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const line = BOOT_LINES[lineIdx];

      if (phase === "typing") {
        if (charIdx <= line.length) {
          const text = line.slice(0, charIdx);
          setCurrentText(text);
          currentTextRef.current = text;
          charIdx++;
          timeout = setTimeout(tick, 25 + Math.random() * 15);
        } else {
          if (lineIdx === PROGRESS_LINE_INDEX) {
            phase = "progress";
            progressCount = 0;
            timeout = setTimeout(tick, 50);
          } else {
            phase = "pause";
            timeout = setTimeout(tick, 200);
          }
        }
      } else if (phase === "progress") {
        if (progressCount <= PROGRESS_BLOCKS) {
          const bar =
            "\u2588".repeat(progressCount) +
            "\u2591".repeat(PROGRESS_BLOCKS - progressCount);
          const pct = Math.round((progressCount / PROGRESS_BLOCKS) * 100);
          const text = `${line}${bar} ${pct}%`;
          setCurrentText(text);
          currentTextRef.current = text;
          progressCount++;
          timeout = setTimeout(tick, 60);
        } else {
          phase = "pause";
          timeout = setTimeout(tick, 200);
        }
      } else if (phase === "pause") {
        const finishedText = currentTextRef.current;
        setLines((prev) => [...prev, finishedText]);
        setCurrentText("");
        currentTextRef.current = "";
        lineIdx++;
        charIdx = 0;
        phase = "typing";

        if (lineIdx >= BOOT_LINES.length) {
          setTimeout(() => {
            if (cancelled) return;
            setFadeOut(true);
            setTimeout(() => {
              if (cancelled) return;
              document.body.style.overflow = prevOverflow;
              setVisible(false);
              try {
                sessionStorage.setItem("boot-seen", "1");
              } catch {
                // ignore
              }
              onCompleteRef.current();
            }, 600);
          }, 500);
          return;
        }

        timeout = setTimeout(tick, 100);
      }
    };

    timeout = setTimeout(tick, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearInterval(cursorTimer);
      document.body.style.overflow = prevOverflow;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSkip]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          lineHeight: "1.8",
          color: "#34d399",
          maxWidth: "500px",
          width: "100%",
          padding: "24px",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div>
          {currentText}
          <span style={{ opacity: cursorVisible ? 1 : 0 }}>_</span>
        </div>
      </div>
    </div>
  );
}
