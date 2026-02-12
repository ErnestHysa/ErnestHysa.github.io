import type { FetchBall } from "./types";

const BALL_RADIUS = 5;
const BALL_COLOR = "#e53e3e";
const ARC_GRAVITY = 600;

export function createBall(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
): FetchBall {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const time = Math.max(0.6, dist / 350);

  const vx = dx / time;
  // Launch upward with enough arc to look good
  const vy = (dy - 0.5 * ARC_GRAVITY * time * time) / time;

  return {
    x: startX,
    y: startY,
    vx,
    vy,
    targetX,
    targetY,
    phase: "arc",
    alpha: 1,
    peaked: false,
  };
}

export function updateBall(
  ball: FetchBall,
  dt: number,
): FetchBall | null {
  if (ball.phase === "arc") {
    const prevVy = ball.vy;
    ball.vy += ARC_GRAVITY * dt;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Detect peak: velocity changed from upward (negative) to downward (positive)
    if (prevVy < 0 && ball.vy >= 0) {
      ball.peaked = true;
    }

    // Only land after the ball has peaked and is descending
    const canLand = ball.peaked && ball.vy > 0;

    if (canLand && (ball.y >= ball.targetY || ball.y >= window.innerHeight - BALL_RADIUS)) {
      ball.y = Math.min(ball.targetY, window.innerHeight - BALL_RADIUS);
      ball.x = Math.min(Math.max(ball.x, BALL_RADIUS), window.innerWidth - BALL_RADIUS);
      ball.phase = "landed";
      ball.vx = 0;
      ball.vy = 0;
    }

    // Safety: if ball goes way off screen, force land
    if (ball.y > window.innerHeight + 100) {
      ball.y = window.innerHeight - BALL_RADIUS;
      ball.x = Math.min(Math.max(ball.x, BALL_RADIUS), window.innerWidth - BALL_RADIUS);
      ball.phase = "landed";
      ball.vx = 0;
      ball.vy = 0;
    }
  } else if (ball.phase === "carried") {
    // Ball position is updated externally by the fetch_return handler
  } else if (ball.phase === "fade") {
    ball.alpha -= dt * 2;
    if (ball.alpha <= 0) return null;
  }

  return ball;
}

export function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: FetchBall,
): void {
  ctx.save();
  ctx.globalAlpha = ball.alpha;
  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "#fc8181";
  ctx.beginPath();
  ctx.arc(ball.x - 1.5, ball.y - 1.5, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
