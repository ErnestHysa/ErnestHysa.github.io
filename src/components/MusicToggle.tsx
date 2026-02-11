"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioReactive } from "./AudioReactiveProvider";

export function MusicToggle() {
  const { isPlaying, toggle } = useAudioReactive();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6"
      style={{ zIndex: 52 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            {isPlaying ? "Pause music" : "Play lo-fi"}
          </motion.span>
        )}
      </AnimatePresence>

      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={isPlaying ? "Pause music" : "Play lo-fi music"}
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 48,
          height: 48,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          cursor: "pointer",
          boxShadow: isPlaying
            ? "0 0 16px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          borderColor: isPlaying ? "var(--accent-glow)" : "var(--border)",
        }}
      >
        {isPlaying ? <EqualizerBars /> : <MusicNoteIcon />}
      </button>
    </motion.div>
  );
}

function MusicNoteIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--text-secondary)" }}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
      <span
        className="equalizer-bar"
        style={{
          width: 3,
          borderRadius: 1,
          backgroundColor: "var(--accent)",
          animation: "eq-bar1 0.6s ease-in-out infinite alternate",
        }}
      />
      <span
        className="equalizer-bar"
        style={{
          width: 3,
          borderRadius: 1,
          backgroundColor: "var(--accent)",
          animation: "eq-bar2 0.5s ease-in-out infinite alternate",
        }}
      />
      <span
        className="equalizer-bar"
        style={{
          width: 3,
          borderRadius: 1,
          backgroundColor: "var(--accent)",
          animation: "eq-bar3 0.7s ease-in-out infinite alternate",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes eq-bar1 { 0% { height: 4px } 100% { height: 16px } }
            @keyframes eq-bar2 { 0% { height: 8px } 100% { height: 12px } }
            @keyframes eq-bar3 { 0% { height: 6px } 100% { height: 14px } }
          `,
        }}
      />
    </div>
  );
}
