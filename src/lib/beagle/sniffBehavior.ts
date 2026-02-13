import { PET_WIDTH, PET_HEIGHT } from "./sprites";

const SNIFF_COOLDOWN = 30000;
const SNIFF_CHANCE = 0.1; // per second

let lastSniffTime = 0;

export function shouldSniff(idleDuration: number, dt: number): boolean {
  const now = Date.now();
  if (now - lastSniffTime < SNIFF_COOLDOWN) return false;
  if (idleDuration < 5) return false;
  return Math.random() < SNIFF_CHANCE * dt;
}

export function markSniffed(): void {
  lastSniffTime = Date.now();
}

export function findNearbyElement(
  dogX: number,
): { x: number; y: number } | null {
  const selectors = "section[id], h2, [data-bento]";
  const elements = document.querySelectorAll(selectors);
  if (elements.length === 0) return null;

  let closest: { x: number; y: number; dist: number } | null = null;
  const dogCenterX = dogX + PET_WIDTH / 2;
  const bottomY = window.innerHeight - PET_HEIGHT;

  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    // Only consider elements near the bottom half of viewport
    if (rect.top < window.innerHeight * 0.3) continue;

    const elX = rect.left + rect.width / 2 - PET_WIDTH / 2;
    const dist = Math.abs(elX - dogCenterX);

    // Skip if too far (more than half the screen)
    if (dist > window.innerWidth * 0.5) continue;

    if (!closest || dist < closest.dist) {
      closest = { x: Math.max(0, Math.min(elX, window.innerWidth - PET_WIDTH)), y: bottomY, dist };
    }
  }

  return closest ? { x: closest.x, y: closest.y } : null;
}

export function resetSniffCooldown(): void {
  lastSniffTime = 0;
}
