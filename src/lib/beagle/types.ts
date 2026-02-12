export type PetState =
  | "idle"
  | "walk"
  | "run"
  | "jump"
  | "sit"
  | "sleep"
  | "roll"
  | "bark"
  | "backflip"
  | "drag"
  | "toss"
  | "tumble"
  | "fetch_run"
  | "fetch_return"
  | "sniff"
  | "return_to_bottom";

export interface AnimConfig {
  frames: number;
  duration: number;
  loop: boolean;
  sprite: string;
}

export interface EmotionBubble {
  emoji: string;
  x: number;
  y: number;
  vy: number;
  alpha: number;
  life: number;
}

export interface PawPrint {
  x: number;
  y: number;
  alpha: number;
  rotation: number;
  side: "left" | "right";
}

export interface FetchBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  phase: "arc" | "landed" | "fade";
  alpha: number;
}

export interface Vec2 {
  x: number;
  y: number;
}
