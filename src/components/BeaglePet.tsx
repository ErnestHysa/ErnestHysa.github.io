"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAudioReactive } from "./AudioReactiveProvider";

type PetState = "idle" | "walk" | "run" | "jump" | "sit" | "sleep";

interface AnimConfig {
  frames: number;
  duration: number;
  loop: boolean;
  sprite: string;
}

const ANIM_CONFIG: Record<PetState, AnimConfig> = {
  idle:  { frames: 4, duration: 1.6, loop: true,  sprite: "/sprites/idle.png" },
  walk:  { frames: 8, duration: 0.8, loop: true,  sprite: "/sprites/walk.png" },
  run:   { frames: 8, duration: 0.5, loop: true,  sprite: "/sprites/run.png" },
  jump:  { frames: 4, duration: 0.4, loop: false, sprite: "/sprites/jump.png" },
  sit:   { frames: 4, duration: 0.8, loop: false, sprite: "/sprites/sit.png" },
  sleep: { frames: 4, duration: 2.0, loop: true,  sprite: "/sprites/sleep.png" },
};

const PET_HEIGHT = 64;
const PET_WIDTH = Math.round(PET_HEIGHT * (300 / 280));
const FRAME_STEP = PET_HEIGHT * (300 / 280); // precise float for bg-position stepping
const WALK_SPEED = 80;
const RUN_SPEED = 180;
const CLOSE_THRESHOLD = 30;
const RUN_THRESHOLD = 250;
const SIT_DELAY = 8000;
const SLEEP_DELAY = 15000;

export function BeaglePet() {
  const { isPlaying } = useAudioReactive();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const elRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<PetState>("idle");
  const xRef = useRef(0);
  const targetXRef = useRef(0);
  const facingLeftRef = useRef(false);
  const cursorXRef = useRef(0);
  const lastCursorMoveRef = useRef(0);
  const jumpTimerRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isMobileRef = useRef(false);
  const paceTargetRef = useRef(0);
  const animElapsedRef = useRef(0);
  const currentSpriteRef = useRef("");

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    isMobileRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    xRef.current = window.innerWidth / 2;
    cursorXRef.current = window.innerWidth / 2;
    targetXRef.current = window.innerWidth / 2;
    lastCursorMoveRef.current = Date.now();
    setMounted(true);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(jumpTimerRef.current);
    };
  }, []);

  // Cursor tracking
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorXRef.current = e.clientX;
      lastCursorMoveRef.current = Date.now();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reducedMotion, mounted]);

  const setStateRef = useCallback((newState: PetState) => {
    if (stateRef.current === newState) return;
    stateRef.current = newState;
    animElapsedRef.current = 0;
  }, []);

  // Main rAF loop — handles movement, state transitions, AND frame stepping
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const el = elRef.current;
    if (!el) return;

    const pickPaceTarget = () => {
      const margin = 100;
      const maxX = window.innerWidth - PET_WIDTH;
      return Math.max(0, Math.min(maxX, margin + Math.random() * (window.innerWidth - margin * 2)));
    };

    const clampPaceTarget = () => {
      const maxX = window.innerWidth - PET_WIDTH;
      if (paceTargetRef.current > maxX || paceTargetRef.current < 0) {
        paceTargetRef.current = pickPaceTarget();
      }
    };

    paceTargetRef.current = pickPaceTarget();

    const loop = (timestamp: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const dt = Math.min((timestamp - lastFrameRef.current) / 1000, 0.1);
      lastFrameRef.current = timestamp;

      const state = stateRef.current;
      const now = Date.now();
      const timeSinceCursor = now - lastCursorMoveRef.current;
      const musicActive = isPlayingRef.current;
      const isMobile = isMobileRef.current;
      const cursorActive = timeSinceCursor < 200;

      // Clamp pace target on every frame (handles window resize)
      clampPaceTarget();

      // --- Targeting ---
      if (state !== "jump") {
        if (cursorActive) {
          // Cursor recently moved — follow it (works on any device)
          targetXRef.current = cursorXRef.current;
        } else if (
          musicActive &&
          (state === "idle" ||
            state === "sit" ||
            state === "sleep" ||
            state === "walk")
        ) {
          if (Math.abs(xRef.current - paceTargetRef.current) < CLOSE_THRESHOLD)
            paceTargetRef.current = pickPaceTarget();
          targetXRef.current = paceTargetRef.current;
        } else if (isMobile && !musicActive) {
          if (Math.abs(xRef.current - paceTargetRef.current) < CLOSE_THRESHOLD)
            paceTargetRef.current = pickPaceTarget();
          targetXRef.current = paceTargetRef.current;
        }
      }

      const dist = Math.abs(xRef.current - targetXRef.current);
      const direction = targetXRef.current > xRef.current ? 1 : -1;

      // --- State transitions ---
      if (state !== "jump") {
        if (cursorActive) {
          if (dist > RUN_THRESHOLD) {
            setStateRef("run");
          } else if (dist > CLOSE_THRESHOLD) {
            setStateRef("walk");
          } else if (state === "sit" || state === "sleep") {
            // Wake up when cursor moves, even if close
            setStateRef("idle");
          } else if (state === "walk" || state === "run") {
            setStateRef("idle");
          }
        } else if (musicActive || isMobile) {
          if (state === "sit" || state === "sleep") setStateRef("walk");
          if (dist > CLOSE_THRESHOLD) {
            setStateRef("walk");
          } else if (state === "walk" || state === "run") {
            setStateRef("idle");
            paceTargetRef.current = pickPaceTarget();
            targetXRef.current = paceTargetRef.current;
          }
        } else if (!isMobile) {
          if ((state === "walk" || state === "run") && dist < CLOSE_THRESHOLD) {
            setStateRef("idle");
          }
          if (state === "idle" && timeSinceCursor > SIT_DELAY) {
            setStateRef("sit");
          }
          if (state === "sit" && timeSinceCursor > SIT_DELAY + SLEEP_DELAY) {
            setStateRef("sleep");
          }
        }
      }

      // --- Movement ---
      if (state === "walk" || state === "run") {
        const speed = state === "run" ? RUN_SPEED : WALK_SPEED;
        xRef.current += speed * dt * direction;
        xRef.current = Math.max(
          0,
          Math.min(window.innerWidth - PET_WIDTH, xRef.current)
        );
        facingLeftRef.current = direction < 0;
      }

      // --- Animation frame stepping ---
      const config = ANIM_CONFIG[stateRef.current];
      animElapsedRef.current += dt;

      let frameIndex: number;
      if (config.loop) {
        const progress =
          (animElapsedRef.current % config.duration) / config.duration;
        frameIndex = Math.floor(progress * config.frames) % config.frames;
      } else {
        const progress = Math.min(
          animElapsedRef.current / config.duration,
          1 - 1e-6
        );
        frameIndex = Math.floor(progress * config.frames);
      }

      const bgPosX = -(frameIndex * FRAME_STEP);

      // --- Apply to DOM directly (avoid React re-renders in rAF) ---
      const sprite = config.sprite;
      if (currentSpriteRef.current !== sprite) {
        el.style.backgroundImage = `url(${sprite})`;
        currentSpriteRef.current = sprite;
      }
      el.style.left = `${xRef.current}px`;
      el.style.backgroundPositionX = `${bgPosX}px`;
      el.style.transform = facingLeftRef.current ? "scaleX(-1)" : "none";

      rafRef.current = requestAnimationFrame(loop);
    };

    // Set initial sprite and position before first frame
    const initConfig = ANIM_CONFIG[stateRef.current];
    el.style.backgroundImage = `url(${initConfig.sprite})`;
    el.style.left = `${xRef.current}px`;
    currentSpriteRef.current = initConfig.sprite;
    lastFrameRef.current = 0;

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion, mounted, setStateRef]);

  // Click / tap → jump
  const handleInteraction = useCallback(() => {
    if (reducedMotion || stateRef.current === "jump") return;
    setStateRef("jump");
    clearTimeout(jumpTimerRef.current);
    jumpTimerRef.current = window.setTimeout(() => {
      setStateRef("idle");
      lastCursorMoveRef.current = Date.now();
    }, 400);
  }, [reducedMotion, setStateRef]);

  if (!mounted) return null;

  if (reducedMotion) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 47,
          width: PET_WIDTH,
          height: PET_HEIGHT,
          backgroundImage: `url(${ANIM_CONFIG.idle.sprite})`,
          backgroundSize: `auto ${PET_HEIGHT}px`,
          backgroundPosition: "0 0",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div
      ref={elRef}
      onClick={handleInteraction}
      onTouchStart={(e) => {
        e.preventDefault();
        handleInteraction();
      }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 47,
        width: PET_WIDTH,
        height: PET_HEIGHT,
        backgroundSize: `auto ${PET_HEIGHT}px`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0",
        imageRendering: "pixelated",
        cursor: "pointer",
      }}
    />
  );
}
