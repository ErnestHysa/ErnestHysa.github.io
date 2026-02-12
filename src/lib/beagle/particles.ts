import type { EmotionBubble, PawPrint } from "./types";

const MAX_BUBBLES = 10;
const MAX_PAW_PRINTS = 30;
const BUBBLE_LIFE = 1.5;
const PAW_FADE = 2.0;
const PAW_EMIT_DIST = 25;

export function createBubble(
  emoji: string,
  x: number,
  y: number,
): EmotionBubble {
  return {
    emoji,
    x: x + (Math.random() - 0.5) * 20,
    y,
    vy: -(40 + Math.random() * 20),
    alpha: 1,
    life: BUBBLE_LIFE,
  };
}

export function updateBubbles(
  bubbles: EmotionBubble[],
  dt: number,
): EmotionBubble[] {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.y += b.vy * dt;
    b.life -= dt;
    b.alpha = Math.max(0, b.life / BUBBLE_LIFE);
    if (b.life <= 0) bubbles.splice(i, 1);
  }
  while (bubbles.length > MAX_BUBBLES) bubbles.shift();
  return bubbles;
}

export function drawBubbles(
  ctx: CanvasRenderingContext2D,
  bubbles: EmotionBubble[],
): void {
  for (const b of bubbles) {
    ctx.globalAlpha = b.alpha;
    ctx.font = "16px serif";
    ctx.fillText(b.emoji, b.x, b.y);
  }
  ctx.globalAlpha = 1;
}

export function shouldEmitPaw(
  lastPawX: number,
  lastPawY: number,
  x: number,
  y: number,
): boolean {
  const dx = x - lastPawX;
  const dy = y - lastPawY;
  return dx * dx + dy * dy >= PAW_EMIT_DIST * PAW_EMIT_DIST;
}

export function createPawPrint(
  x: number,
  y: number,
  side: "left" | "right",
  facingLeft: boolean,
): PawPrint {
  const offset = side === "left" ? -4 : 4;
  return {
    x: x + (facingLeft ? -offset : offset),
    y,
    alpha: 0.5,
    rotation: (Math.random() - 0.5) * 0.3,
    side,
  };
}

export function updatePawPrints(
  paws: PawPrint[],
  dt: number,
): PawPrint[] {
  for (let i = paws.length - 1; i >= 0; i--) {
    paws[i].alpha -= dt / PAW_FADE;
    if (paws[i].alpha <= 0) paws.splice(i, 1);
  }
  while (paws.length > MAX_PAW_PRINTS) paws.shift();
  return paws;
}

export function drawPawPrints(
  ctx: CanvasRenderingContext2D,
  paws: PawPrint[],
): void {
  for (const p of paws) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "#8B6914";

    // Pad (bottom ellipse)
    ctx.beginPath();
    ctx.ellipse(0, 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Three toes
    for (const tx of [-3, 0, 3]) {
      ctx.beginPath();
      ctx.arc(tx, -3, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
