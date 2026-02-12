"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

interface Bands {
  bass: number;
  mid: number;
  high: number;
  energy: number;
}

interface AudioReactiveContextType {
  isPlaying: boolean;
  toggle: () => void;
  frequencyData: React.RefObject<Float32Array | null>;
  bands: React.RefObject<Bands>;
}

const AudioReactiveContext = createContext<AudioReactiveContextType | null>(
  null
);

export function useAudioReactive() {
  const ctx = useContext(AudioReactiveContext);
  if (!ctx) {
    throw new Error(
      "useAudioReactive must be used within AudioReactiveProvider"
    );
  }
  return ctx;
}

const SMOOTHING = 0.15;
const DEFAULT_BANDS: Bands = { bass: 0, mid: 0, high: 0, energy: 0 };

export function AudioReactiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const frequencyData = useRef<Float32Array | null>(null);
  const bands = useRef<Bands>({ ...DEFAULT_BANDS });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const byteDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check sessionStorage for previous playing state
    try {
      if (sessionStorage.getItem("audio-playing") === "true") {
        // Will be initialized on first toggle
      }
    } catch {
      // sessionStorage unavailable
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.0265;
    gainRef.current = gain;

    const audio = new Audio("/audio/chill.mp3");
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audioElRef.current = audio;

    const source = audioCtx.createMediaElementSource(audio);
    sourceRef.current = source;

    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(audioCtx.destination);

    frequencyData.current = new Float32Array(analyser.frequencyBinCount);
    byteDataRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, []);

  const updateBands = useCallback(() => {
    const analyser = analyserRef.current;
    const data = frequencyData.current;
    const byteData = byteDataRef.current;
    if (!analyser || !data || !byteData) return;

    if (reducedMotionRef.current) {
      bands.current = { ...DEFAULT_BANDS };
      return; // stop the loop entirely in reduced motion
    }

    analyser.getByteFrequencyData(byteData);

    // Bass: bins 1-5
    let bassSum = 0;
    for (let i = 1; i <= 5; i++) bassSum += byteData[i];
    const rawBass = bassSum / (5 * 255);

    // Mid: bins 6-30
    let midSum = 0;
    for (let i = 6; i <= 30; i++) midSum += byteData[i];
    const rawMid = midSum / (25 * 255);

    // High: bins 31-64
    let highSum = 0;
    for (let i = 31; i <= 64; i++) highSum += byteData[i];
    const rawHigh = highSum / (34 * 255);

    // Energy: all bins
    let totalSum = 0;
    for (let i = 0; i < byteData.length; i++) totalSum += byteData[i];
    const rawEnergy = totalSum / (byteData.length * 255);

    // Exponential moving average
    const prev = bands.current;
    bands.current = {
      bass: prev.bass + SMOOTHING * (rawBass - prev.bass),
      mid: prev.mid + SMOOTHING * (rawMid - prev.mid),
      high: prev.high + SMOOTHING * (rawHigh - prev.high),
      energy: prev.energy + SMOOTHING * (rawEnergy - prev.energy),
    };

    rafRef.current = requestAnimationFrame(updateBands);
  }, []);

  const toggle = useCallback(() => {
    initAudio();

    const audio = audioElRef.current;
    const audioCtx = audioCtxRef.current;
    if (!audio || !audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (audio.paused) {
      if (playPromiseRef.current) return; // guard against rapid double-toggle
      const promise = audio.play();
      playPromiseRef.current = promise;
      promise.then(() => {
        playPromiseRef.current = null;
        if (!audio.paused) {
          setIsPlaying(true);
          try { sessionStorage.setItem("audio-playing", "true"); } catch {}
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(updateBands);
        }
      }).catch(() => {
        playPromiseRef.current = null;
      });
    } else {
      audio.pause();
      playPromiseRef.current = null;
      setIsPlaying(false);
      try { sessionStorage.setItem("audio-playing", "false"); } catch {}
      cancelAnimationFrame(rafRef.current);
      bands.current = { ...DEFAULT_BANDS };
    }
  }, [initAudio, updateBands]);

  return (
    <AudioReactiveContext.Provider
      value={{ isPlaying, toggle, frequencyData, bands }}
    >
      {children}
    </AudioReactiveContext.Provider>
  );
}
