import { PET_WIDTH, PET_HEIGHT, WALK_SPEED } from "./sprites";

const GRAVITY = 1200;
const BOUNCE_DAMPING = 0.7;
const FRICTION_PER_SECOND = 0.3;
const SETTLE_THRESHOLD = 20;

export interface TossState {
  vx: number;
  vy: number;
}

export function move2D(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  speed: number,
  dt: number,
): { x: number; y: number; dirX: number; dirY: number; arrived: boolean } {
  const dx = targetX - x;
  const dy = targetY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 5) {
    return { x: targetX, y: targetY, dirX: 0, dirY: 0, arrived: true };
  }

  const dirX = dx / dist;
  const dirY = dy / dist;
  const step = speed * dt;

  if (step >= dist) {
    return { x: targetX, y: targetY, dirX, dirY, arrived: true };
  }

  return {
    x: x + step * dirX,
    y: y + step * dirY,
    dirX,
    dirY,
    arrived: false,
  };
}

export function updateToss(
  x: number,
  y: number,
  toss: TossState,
  dt: number,
): { x: number; y: number; toss: TossState; settled: boolean } {
  let { vx, vy } = toss;

  vy += GRAVITY * dt;
  vx *= Math.pow(FRICTION_PER_SECOND, dt);

  let nx = x + vx * dt;
  let ny = y + vy * dt;

  const maxX = window.innerWidth - PET_WIDTH;
  const maxY = window.innerHeight - PET_HEIGHT;
  let settled = false;

  // Bounce off sides
  if (nx < 0) {
    nx = 0;
    vx = -vx * BOUNCE_DAMPING;
  } else if (nx > maxX) {
    nx = maxX;
    vx = -vx * BOUNCE_DAMPING;
  }

  // Bounce off bottom
  if (ny > maxY) {
    ny = maxY;
    vy = -vy * BOUNCE_DAMPING;
    if (Math.abs(vy) < SETTLE_THRESHOLD && Math.abs(vx) < SETTLE_THRESHOLD) {
      vy = 0;
      vx = 0;
      settled = true;
    }
  }

  // Bounce off top
  if (ny < 0) {
    ny = 0;
    vy = -vy * BOUNCE_DAMPING;
  }

  return { x: nx, y: ny, toss: { vx, vy }, settled };
}

export function returnToBottom(
  x: number,
  y: number,
  dt: number,
): { x: number; y: number; arrived: boolean } {
  const targetY = window.innerHeight - PET_HEIGHT;
  return move2D(x, y, x, targetY, WALK_SPEED, dt);
}
