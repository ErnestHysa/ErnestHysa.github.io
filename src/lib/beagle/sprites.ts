import type { PetState, AnimConfig } from "./types";

export const PET_HEIGHT = 64;
export const PET_WIDTH = Math.round(PET_HEIGHT * (300 / 280));
export const FRAME_STEP = PET_WIDTH;

export const WALK_SPEED = 80;
export const RUN_SPEED = 180;
export const CLOSE_THRESHOLD = 30;
export const RUN_THRESHOLD = 250;
export const SIT_DELAY = 8000;
export const SLEEP_DELAY = 15000;
export const RETURN_TO_BOTTOM_MARGIN = 10;

export const ANIM_CONFIG: Record<PetState, AnimConfig> = {
  idle:             { frames: 4, duration: 1.6, loop: true,  sprite: "/sprites/idle.png" },
  walk:             { frames: 8, duration: 0.8, loop: true,  sprite: "/sprites/walk.png" },
  run:              { frames: 8, duration: 0.5, loop: true,  sprite: "/sprites/run.png" },
  jump:             { frames: 4, duration: 0.4, loop: false, sprite: "/sprites/jump.png" },
  sit:              { frames: 4, duration: 0.8, loop: false, sprite: "/sprites/sit.png" },
  sleep:            { frames: 4, duration: 2.0, loop: true,  sprite: "/sprites/sleep.png" },
  roll:             { frames: 4, duration: 0.6, loop: false, sprite: "/sprites/roll.png" },
  bark:             { frames: 4, duration: 0.5, loop: false, sprite: "/sprites/bark.png" },
  backflip:         { frames: 4, duration: 0.5, loop: false, sprite: "/sprites/backflip.png" },
  drag:             { frames: 4, duration: 1.6, loop: true,  sprite: "/sprites/idle.png" },
  toss:             { frames: 4, duration: 1.6, loop: true,  sprite: "/sprites/jump.png" },
  tumble:           { frames: 4, duration: 0.6, loop: false, sprite: "/sprites/roll.png" },
  fetch_run:        { frames: 8, duration: 0.5, loop: true,  sprite: "/sprites/run.png" },
  fetch_return:     { frames: 8, duration: 0.8, loop: true,  sprite: "/sprites/walk.png" },
  sniff:            { frames: 4, duration: 1.2, loop: false, sprite: "/sprites/idle.png" },
  return_to_bottom: { frames: 8, duration: 0.8, loop: true,  sprite: "/sprites/walk.png" },
};

export const TRICK_CYCLE: PetState[] = ["jump", "roll", "bark", "backflip"];
