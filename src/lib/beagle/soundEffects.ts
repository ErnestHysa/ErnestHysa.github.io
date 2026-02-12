let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initSoundEffects(): void {
  getCtx();
}

function playTone(
  frequency: number,
  endFreq: number,
  duration: number,
  type: OscillatorType,
  volume = 0.02,
): void {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(endFreq, ctx.currentTime + duration);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playBark(): void {
  playTone(600, 400, 0.12, "square", 0.015);
  setTimeout(() => playTone(550, 350, 0.1, "square", 0.012), 130);
}

export function playJump(): void {
  playTone(200, 500, 0.15, "triangle", 0.02);
}

export function playWhimper(): void {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);

  // Wobble
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 8;
  lfoGain.gain.value = 30;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  lfo.start();

  gain.gain.setValueAtTime(0.015, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
  lfo.stop(ctx.currentTime + 0.3);
}

let lastPantTime = 0;
export function playPanting(): void {
  const now = Date.now();
  if (now - lastPantTime < 2000) return;
  lastPantTime = now;

  const ctx = getCtx();
  if (!ctx) return;

  for (let i = 0; i < 3; i++) {
    const t = ctx.currentTime + i * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(i % 2 === 0 ? 400 : 300, t);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }
}

export function cleanupSoundEffects(): void {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}
