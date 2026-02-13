"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAudioReactive } from "./AudioReactiveProvider";
import { useTheme } from "./ThemeProvider";
import type { PetState, EmotionBubble, PawPrint, FetchBall } from "../lib/beagle/types";
import {
  PET_HEIGHT, PET_WIDTH, FRAME_STEP,
  WALK_SPEED, RUN_SPEED, CLOSE_THRESHOLD, RUN_THRESHOLD,
  SIT_DELAY, SLEEP_DELAY, RETURN_TO_BOTTOM_MARGIN,
  ANIM_CONFIG, TRICK_CYCLE,
} from "../lib/beagle/sprites";
import { move2D, updateToss, returnToBottom, type TossState } from "../lib/beagle/physics";
import {
  createBubble, updateBubbles, drawBubbles,
  shouldEmitPaw, createPawPrint, updatePawPrints, drawPawPrints,
} from "../lib/beagle/particles";
import { initSoundEffects, playBark, playJump, playWhimper, startWalking, stopWalking, setRunning, cleanupSoundEffects } from "../lib/beagle/soundEffects";
import { createBall, updateBall, drawBall } from "../lib/beagle/fetchGame";
import { shouldSniff, markSniffed, findNearbyElement, resetSniffCooldown } from "../lib/beagle/sniffBehavior";

// --- Trick / non-interruptible states ---
const TRICK_STATES: Set<PetState> = new Set(["jump", "roll", "bark", "backflip", "tumble"]);
const NON_INTERRUPT_STATES: Set<PetState> = new Set([
  "jump", "roll", "bark", "backflip", "tumble", "drag", "toss",
  "fetch_run", "fetch_return", "sniff",
]);

// --- Drag detection ---
const DRAG_THRESHOLD = 5;
const POINTER_HISTORY_SIZE = 5;

export function BeaglePet() {
  // Read context values — sync into refs immediately so re-renders don't matter
  const { isPlaying } = useAudioReactive();
  const { theme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // DOM refs
  const elRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Position + state
  const stateRef = useRef<PetState>("idle");
  const xRef = useRef(0);
  const yRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const facingLeftRef = useRef(false);
  const cursorXRef = useRef(0);
  const cursorYRef = useRef(0);
  const lastCursorMoveRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const animElapsedRef = useRef(0);
  const currentSpriteRef = useRef("");
  const isMobileRef = useRef(false);

  // Synced props — never read isPlaying/theme directly in rAF, use these refs
  const isPlayingRef = useRef(false);
  const themeRef = useRef(theme);
  const prevThemeRef = useRef(theme);

  // Pacing (music / mobile)
  const paceTargetRef = useRef(0);

  // Idle timers
  const idleStartRef = useRef(0);

  // Trick cycle
  const trickIndexRef = useRef(0);

  // Click vs drag
  const pointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const pointerHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);

  // Toss physics
  const tossRef = useRef<TossState>({ vx: 0, vy: 0 });

  // Scroll
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Particles
  const bubblesRef = useRef<EmotionBubble[]>([]);
  const pawsRef = useRef<PawPrint[]>([]);
  const lastPawPosRef = useRef({ x: 0, y: 0 });
  const pawSideRef = useRef<"left" | "right">("left");

  // Fetch game
  const fetchBallRef = useRef<FetchBall | null>(null);

  // Sniff
  const sniffTargetRef = useRef<{ x: number; y: number } | null>(null);

  // Preloaded sprite images (kept alive to prevent GC / cache eviction)
  const preloadedRef = useRef<HTMLImageElement[]>([]);

  // Click debounce (distinguish click from dblclick)
  const clickTimerRef = useRef(0);

  // Walking sound state
  const isWalkingSoundRef = useRef(false);

  // Sound function refs — always point to latest imports (survives HMR)
  const soundRef = useRef({ init: initSoundEffects, bark: playBark, jump: playJump, whimper: playWhimper, startWalk: startWalking, stopWalk: stopWalking, setRunning, cleanup: cleanupSoundEffects });
  soundRef.current = { init: initSoundEffects, bark: playBark, jump: playJump, whimper: playWhimper, startWalk: startWalking, stopWalk: stopWalking, setRunning, cleanup: cleanupSoundEffects };

  // --- Sync external state into refs (no visual effect, just ref writes) ---
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // --- Theme change reaction (detected in rAF loop instead to avoid effect timing) ---
  // Moved to rAF loop to avoid re-render dependency issues.

  // --- Init ---
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    isMobileRef.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const bottomY = window.innerHeight - PET_HEIGHT;
    xRef.current = window.innerWidth / 2;
    yRef.current = bottomY;
    cursorXRef.current = window.innerWidth / 2;
    cursorYRef.current = bottomY;
    targetXRef.current = window.innerWidth / 2;
    targetYRef.current = bottomY;
    lastCursorMoveRef.current = Date.now();
    idleStartRef.current = Date.now();
    lastPawPosRef.current = { x: xRef.current, y: yRef.current };

    // Set initial position on the element before mount to prevent FOUC
    const el = elRef.current;
    if (el) {
      el.style.left = `${xRef.current}px`;
      el.style.top = `${yRef.current}px`;
    }

    setMounted(true);

    // Start loading bark MP3 early (AudioContext may be suspended until first click)
    soundRef.current.init();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(clickTimerRef.current);
      isWalkingSoundRef.current = false;
      soundRef.current.cleanup();
      resetSniffCooldown();
    };
  }, []);

  const setStateRef = useCallback((newState: PetState) => {
    if (stateRef.current === newState) return;
    const prev = stateRef.current;
    stateRef.current = newState;
    animElapsedRef.current = 0;
    if (newState === "idle") {
      idleStartRef.current = Date.now();
    }
    if (newState === "sleep" && prev !== "sleep") soundRef.current.whimper();
    // Clear stale sniff target when walk is interrupted
    if (prev === "walk" && newState !== "sniff") {
      sniffTargetRef.current = null;
    }
  }, []);

  // --- Cursor tracking ---
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorXRef.current = e.clientX;
      cursorYRef.current = e.clientY;
      lastCursorMoveRef.current = Date.now();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reducedMotion, mounted]);

  // --- Scroll tracking ---
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const onScroll = () => {
      const now = Date.now();
      const dt = (now - lastScrollTimeRef.current) / 1000;
      if (dt > 0) {
        const vel = Math.abs(window.scrollY - lastScrollYRef.current) / dt;
        if (vel > 2000 && !NON_INTERRUPT_STATES.has(stateRef.current)) {
          if (stateRef.current === "walk") {
            sniffTargetRef.current = null;
          }
          stateRef.current = "tumble";
          animElapsedRef.current = 0;
        }
      }
      lastScrollYRef.current = window.scrollY;
      lastScrollTimeRef.current = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion, mounted]);

  // --- Double-click for fetch ---
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const onDblClick = (e: MouseEvent) => {
      if (fetchBallRef.current && fetchBallRef.current.phase !== "fade") return;
      if (NON_INTERRUPT_STATES.has(stateRef.current)) return;

      clearTimeout(clickTimerRef.current);

      const ball = createBall(
        xRef.current + PET_WIDTH / 2,
        yRef.current + PET_HEIGHT / 2,
        e.clientX,
        e.clientY,
      );
      fetchBallRef.current = ball;
      // Don't change state yet — wait for ball to land, then fetch_run kicks in

      soundRef.current.init(); // Ensure AudioContext resumed during user gesture
      soundRef.current.jump();
    };

    window.addEventListener("dblclick", onDblClick);
    return () => window.removeEventListener("dblclick", onDblClick);
  }, [reducedMotion, mounted]);

  // --- Canvas resize ---
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mounted]);

  // --- Main rAF loop ---
  useEffect(() => {
    if (reducedMotion || !mounted) return;

    const el = elRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bottomY = () => window.innerHeight - PET_HEIGHT;

    const pickPaceTarget = () => {
      const margin = 100;
      const maxX = window.innerWidth - PET_WIDTH;
      return Math.max(0, Math.min(maxX, margin + Math.random() * (window.innerWidth - margin * 2)));
    };

    paceTargetRef.current = pickPaceTarget();

    const loop = (timestamp: number) => {
      if (!lastFrameRef.current) lastFrameRef.current = timestamp;
      const dt = Math.min((timestamp - lastFrameRef.current) / 1000, 0.1);
      lastFrameRef.current = timestamp;

      const now = Date.now();
      const timeSinceCursor = now - lastCursorMoveRef.current;
      const musicActive = isPlayingRef.current;
      const isMobile = isMobileRef.current;
      const cursorActive = timeSinceCursor < 200;
      const maxX = window.innerWidth - PET_WIDTH;
      const bot = bottomY();

      // === THEME CHANGE DETECTION (done in rAF to avoid React re-render issues) ===
      const currentTheme = themeRef.current;
      if (prevThemeRef.current !== currentTheme) {
        prevThemeRef.current = currentTheme;
        if (!NON_INTERRUPT_STATES.has(stateRef.current)) {
          stateRef.current = "bark";
          animElapsedRef.current = 0;
          bubblesRef.current.push(
            createBubble("❗", xRef.current + PET_WIDTH / 2, yRef.current)
          );
          soundRef.current.bark();
        }
      }

      // === FETCH BALL UPDATE ===
      if (fetchBallRef.current) {
        const ball = updateBall(fetchBallRef.current, dt);
        if (!ball) {
          fetchBallRef.current = null;
        } else {
          fetchBallRef.current = ball;
          // Transition: ball landed -> dog runs to it (wait for non-interruptible states to finish)
          if (ball.phase === "landed" && stateRef.current !== "fetch_run" && stateRef.current !== "fetch_return" && !NON_INTERRUPT_STATES.has(stateRef.current)) {
            targetXRef.current = ball.x - PET_WIDTH / 2;
            targetYRef.current = ball.y - PET_HEIGHT / 2;
            stateRef.current = "fetch_run";
            animElapsedRef.current = 0;
          }
        }
      }

      // === STATE MACHINE (always read stateRef.current fresh, not a cached variable) ===
      const state = stateRef.current;

      if (state === "drag") {
        // Follow pointer directly — handled in pointer events
      } else if (state === "toss") {
        const result = updateToss(xRef.current, yRef.current, tossRef.current, dt);
        xRef.current = result.x;
        yRef.current = result.y;
        tossRef.current = result.toss;
        if (result.settled) {
          setStateRef("return_to_bottom");
        }
      } else if (state === "return_to_bottom") {
        const result = returnToBottom(xRef.current, yRef.current, dt);
        xRef.current = result.x;
        yRef.current = result.y;
        if (result.arrived || Math.abs(yRef.current - bot) < RETURN_TO_BOTTOM_MARGIN) {
          yRef.current = bot;
          setStateRef("idle");
        }
      } else if (state === "tumble") {
        if (animElapsedRef.current >= ANIM_CONFIG.tumble.duration) {
          setStateRef("idle");
        }
      } else if (state === "fetch_run") {
        if (fetchBallRef.current && fetchBallRef.current.phase === "landed") {
          const ballX = fetchBallRef.current.x - PET_WIDTH / 2;
          const ballY = fetchBallRef.current.y - PET_HEIGHT / 2;
          const result = move2D(xRef.current, yRef.current, ballX, ballY, RUN_SPEED * 1.2, dt);
          xRef.current = Math.max(0, Math.min(maxX, result.x));
          yRef.current = Math.max(0, Math.min(bot, result.y));
          if (result.dirX !== 0) facingLeftRef.current = result.dirX < 0;
          if (result.arrived) {
            // Dog picked up the ball — carry it in mouth
            fetchBallRef.current.phase = "carried";
            targetXRef.current = cursorXRef.current;
            targetYRef.current = cursorYRef.current;
            stateRef.current = "fetch_return";
            animElapsedRef.current = 0;
          }
        } else if (!fetchBallRef.current) {
          setStateRef("idle");
        }
      } else if (state === "fetch_return") {
        const result = move2D(xRef.current, yRef.current, cursorXRef.current, cursorYRef.current, WALK_SPEED * 1.2, dt);
        xRef.current = result.x;
        yRef.current = result.y;
        if (result.dirX !== 0) facingLeftRef.current = result.dirX < 0;

        // Move carried ball to dog's mouth position
        if (fetchBallRef.current && fetchBallRef.current.phase === "carried") {
          const mouthX = facingLeftRef.current
            ? xRef.current - 3
            : xRef.current + PET_WIDTH + 3;
          fetchBallRef.current.x = mouthX;
          fetchBallRef.current.y = yRef.current + PET_HEIGHT * 0.4;
        }

        if (result.arrived) {
          // Drop the ball — switch to fade phase
          if (fetchBallRef.current) {
            fetchBallRef.current.phase = "fade";
          }
          bubblesRef.current.push(createBubble("🐾", xRef.current + PET_WIDTH / 2, yRef.current));
          setStateRef("idle");
        }
      } else if (state === "sniff") {
        if (animElapsedRef.current >= ANIM_CONFIG.sniff.duration) {
          bubblesRef.current.push(createBubble("👃", xRef.current + PET_WIDTH / 2, yRef.current));
          setStateRef("idle");
        }
      } else if (TRICK_STATES.has(state)) {
        const config = ANIM_CONFIG[state];
        if (!config.loop && animElapsedRef.current >= config.duration) {
          setStateRef("idle");
          lastCursorMoveRef.current = Date.now();
        }
      } else {
        // === IDLE / WALK / RUN / SIT / SLEEP — normal behavior ===

        // Clamp pace target on resize
        if (paceTargetRef.current > maxX || paceTargetRef.current < 0) {
          paceTargetRef.current = pickPaceTarget();
        }

        // --- Targeting (Y always stays at bottom during normal behavior) ---
        if (cursorActive) {
          targetXRef.current = cursorXRef.current;
          targetYRef.current = cursorYRef.current;
        } else if (musicActive && (state === "idle" || state === "sit" || state === "sleep" || state === "walk")) {
          if (Math.abs(xRef.current - paceTargetRef.current) < CLOSE_THRESHOLD) {
            paceTargetRef.current = pickPaceTarget();
          }
          targetXRef.current = paceTargetRef.current;
          targetYRef.current = bot;
        } else if (isMobile && !musicActive) {
          if (Math.abs(xRef.current - paceTargetRef.current) < CLOSE_THRESHOLD) {
            paceTargetRef.current = pickPaceTarget();
          }
          targetXRef.current = paceTargetRef.current;
          targetYRef.current = bot;
        }

        // 2D distance for state transitions (dog moves freely across screen)
        const dx2 = targetXRef.current - xRef.current;
        const dy2 = targetYRef.current - yRef.current;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        // --- State transitions ---
        if (cursorActive) {
          if (dist > RUN_THRESHOLD) {
            setStateRef("run");
          } else if (dist > CLOSE_THRESHOLD) {
            setStateRef("walk");
          } else if (state === "sit" || state === "sleep") {
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

        // Return to bottom if idle and off-bottom for 3+ seconds
        if (state === "idle" && Math.abs(yRef.current - bot) > RETURN_TO_BOTTOM_MARGIN && !cursorActive) {
          const idleDur = (now - idleStartRef.current) / 1000;
          if (idleDur > 3) {
            setStateRef("return_to_bottom");
          }
        }

        // Sniff behavior (desktop only, at bottom, idle 5+ seconds)
        if (!isMobile && state === "idle" && Math.abs(yRef.current - bot) < RETURN_TO_BOTTOM_MARGIN) {
          const idleDur = (now - idleStartRef.current) / 1000;
          if (shouldSniff(idleDur, dt)) {
            const target = findNearbyElement(xRef.current);
            if (target) {
              sniffTargetRef.current = target;
              targetXRef.current = target.x;
              targetYRef.current = target.y;
              markSniffed();
              setStateRef("walk");
            }
          }
        }

        // --- Movement ---
        const currentState = stateRef.current;
        if (currentState === "walk" || currentState === "run") {
          const speed = currentState === "run" ? RUN_SPEED : WALK_SPEED;
          const result = move2D(xRef.current, yRef.current, targetXRef.current, targetYRef.current, speed, dt);
          xRef.current = Math.max(0, Math.min(maxX, result.x));
          yRef.current = Math.max(0, Math.min(bot, result.y));
          if (result.dirX !== 0) facingLeftRef.current = result.dirX < 0;

          // Arrived at sniff target?
          if (sniffTargetRef.current && result.arrived) {
            sniffTargetRef.current = null;
            stateRef.current = "sniff";
            animElapsedRef.current = 0;
          }
        }
      }

      // === WALKING SOUND ===
      const curMovState = stateRef.current;
      const shouldPlayWalk = curMovState === "walk" || curMovState === "run"
        || curMovState === "fetch_run" || curMovState === "fetch_return"
        || curMovState === "return_to_bottom";
      if (shouldPlayWalk && !isWalkingSoundRef.current) {
        soundRef.current.startWalk();
        isWalkingSoundRef.current = true;
      } else if (!shouldPlayWalk && isWalkingSoundRef.current) {
        soundRef.current.stopWalk();
        isWalkingSoundRef.current = false;
      }
      if (shouldPlayWalk) {
        soundRef.current.setRunning(curMovState === "run" || curMovState === "fetch_run");
      }

      // === ANIMATION FRAME ===
      const config = ANIM_CONFIG[stateRef.current];
      animElapsedRef.current += dt;

      let frameIndex: number;
      if (config.loop) {
        const progress = (animElapsedRef.current % config.duration) / config.duration;
        frameIndex = Math.floor(progress * config.frames) % config.frames;
      } else {
        const progress = Math.min(animElapsedRef.current / config.duration, 1 - 1e-6);
        frameIndex = Math.min(Math.floor(progress * config.frames), config.frames - 1);
      }

      // Round to avoid sub-pixel jitter with image-rendering: pixelated
      const bgPosX = Math.round(-(frameIndex * FRAME_STEP));

      // === APPLY TO DOM (imperative — never set top/left in JSX) ===
      const sprite = config.sprite;
      if (currentSpriteRef.current !== sprite) {
        el.style.backgroundImage = `url(${sprite})`;
        currentSpriteRef.current = sprite;
      }
      el.style.left = `${Math.round(xRef.current)}px`;
      el.style.top = `${Math.round(yRef.current)}px`;
      el.style.backgroundPosition = `${bgPosX}px 0px`;
      el.style.transform = facingLeftRef.current ? "scaleX(-1)" : "none";

      // === EMOTION BUBBLES ===
      const curState = stateRef.current;
      if (musicActive && (curState === "walk" || curState === "run") && Math.random() < 0.02) {
        bubblesRef.current.push(
          createBubble("🎵", xRef.current + PET_WIDTH / 2, yRef.current)
        );
      }
      if (curState === "sleep" && Math.random() < 0.015) {
        bubblesRef.current.push(
          createBubble("💤", xRef.current + PET_WIDTH / 2, yRef.current)
        );
      }

      // === PAW PRINTS ===
      if (curState === "walk" || curState === "run" || curState === "fetch_run" || curState === "fetch_return") {
        if (shouldEmitPaw(lastPawPosRef.current.x, lastPawPosRef.current.y, xRef.current, yRef.current)) {
          const side = pawSideRef.current;
          pawsRef.current.push(
            createPawPrint(xRef.current + PET_WIDTH / 2, yRef.current + PET_HEIGHT, side, facingLeftRef.current)
          );
          pawSideRef.current = side === "left" ? "right" : "left";
          lastPawPosRef.current = { x: xRef.current, y: yRef.current };
        }
      }

      // === CANVAS DRAW ===
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updatePawPrints(pawsRef.current, dt);
      drawPawPrints(ctx, pawsRef.current);

      updateBubbles(bubblesRef.current, dt);
      drawBubbles(ctx, bubblesRef.current);

      if (fetchBallRef.current) {
        drawBall(ctx, fetchBallRef.current);
      }

      // Sunglasses in light mode
      if (currentTheme === "light" && curState !== "sleep" && curState !== "drag" && curState !== "toss") {
        drawSunglasses(ctx, xRef.current, yRef.current, facingLeftRef.current);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // Preload + decode all sprite images to prevent white flash on state change.
    // decode() ensures the image is in the GPU rendering cache, not just HTTP cache.
    // References are kept in preloadedRef to prevent garbage collection.
    const imgs: HTMLImageElement[] = [];
    const spritesToPreload = new Set(Object.values(ANIM_CONFIG).map(c => c.sprite));
    spritesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
      imgs.push(img);
    });
    preloadedRef.current = imgs;

    // Set initial styles before first frame (all dynamic props are imperative-only)
    const initConfig = ANIM_CONFIG[stateRef.current];
    el.style.backgroundImage = `url(${initConfig.sprite})`;
    el.style.backgroundPosition = "0px 0px";
    el.style.left = `${Math.round(xRef.current)}px`;
    el.style.top = `${Math.round(yRef.current)}px`;
    currentSpriteRef.current = initConfig.sprite;
    lastFrameRef.current = 0;

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion, mounted, setStateRef]);

  // --- Pointer events (click cycle + drag/toss) ---
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (reducedMotion) return;
    e.preventDefault();

    soundRef.current.init(); // Ensure AudioContext resumed during user gesture

    pointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    pointerHistoryRef.current = [{ x: e.clientX, y: e.clientY, t: Date.now() }];

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [reducedMotion]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      isDraggingRef.current = true;
      clearTimeout(clickTimerRef.current);
      stateRef.current = "drag";
      animElapsedRef.current = 0;
    }

    if (isDraggingRef.current) {
      xRef.current = e.clientX - PET_WIDTH / 2;
      yRef.current = e.clientY - PET_HEIGHT / 2;

      const hist = pointerHistoryRef.current;
      hist.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (hist.length > POINTER_HISTORY_SIZE) hist.shift();
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* pointer already released */ }

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      const hist = pointerHistoryRef.current;
      if (hist.length >= 2) {
        const first = hist[0];
        const last = hist[hist.length - 1];
        const elapsed = Math.max((last.t - first.t) / 1000, 0.016);
        tossRef.current = {
          vx: (last.x - first.x) / elapsed,
          vy: (last.y - first.y) / elapsed,
        };
      } else {
        tossRef.current = { vx: 0, vy: 0 };
      }
      stateRef.current = "toss";
      animElapsedRef.current = 0;
    } else {
      // Click — debounce to distinguish from dblclick
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = window.setTimeout(() => {
        if (NON_INTERRUPT_STATES.has(stateRef.current)) return;

        const trick = TRICK_CYCLE[trickIndexRef.current % TRICK_CYCLE.length];
        trickIndexRef.current++;
        stateRef.current = trick;
        animElapsedRef.current = 0;

        if (trick === "bark") soundRef.current.bark();
        else if (trick === "jump") soundRef.current.jump();

        if (trick === "jump" || trick === "backflip") {
          bubblesRef.current.push(
            createBubble("❤️", xRef.current + PET_WIDTH / 2, yRef.current)
          );
        }
      }, 250);
    }
  }, []);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* already released */ }

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      tossRef.current = { vx: 0, vy: 0 };
      stateRef.current = "toss";
      animElapsedRef.current = 0;
    }
  }, []);

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
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 46,
          pointerEvents: "none",
        }}
      />
      {/*
        IMPORTANT: Do NOT set top, left, backgroundPosition, backgroundImage,
        or transform in this style object. They are managed imperatively in
        the rAF loop. React re-renders (isPlaying/theme context changes)
        would reset them for one paint frame, causing visible flashes.
      */}
      <div
        ref={elRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          position: "fixed",
          zIndex: 47,
          width: PET_WIDTH,
          height: PET_HEIGHT,
          backgroundSize: `auto ${PET_HEIGHT}px`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          cursor: "pointer",
          touchAction: "none",
        }}
      />
    </>
  );
}

// --- Sunglasses drawing ---
function drawSunglasses(
  ctx: CanvasRenderingContext2D,
  dogX: number,
  dogY: number,
  facingLeft: boolean,
): void {
  ctx.save();

  const faceOffsetX = facingLeft ? PET_WIDTH * 0.3 : PET_WIDTH * 0.55;
  const faceOffsetY = PET_HEIGHT * 0.42;
  const cx = dogX + faceOffsetX;
  const cy = dogY + faceOffsetY;

  ctx.translate(cx, cy);
  if (facingLeft) ctx.scale(-1, 1);

  ctx.fillStyle = "#1a1a1a";

  // Left lens
  ctx.fillRect(-7, -2, 5, 4);
  // Right lens
  ctx.fillRect(2, -2, 5, 4);
  // Bridge
  ctx.fillRect(-2, -1, 4, 2);
  // Arms
  ctx.fillRect(-8, -1, 2, 1);
  ctx.fillRect(7, -1, 2, 1);

  ctx.restore();
}
