export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;
export const TILE_SIZE = 16;

export const PHYSICS = {
  GRAVITY: 1400,
  RUN_SPEED: 140,
  SPRINT_SPEED: 220,
  ACCEL_GROUND: 1200,
  FRICTION_GROUND: 1000,
  AIR_CONTROL: 0.6,
  JUMP_VELOCITY: -430,
  VARIABLE_JUMP_MULT: 0.5,
  COYOTE_TIME: 100,
  JUMP_BUFFER: 120,
  STOMP_BOUNCE: -250
} as const;

export const CLOCK = {
  REAL_SECONDS: 180,
  START_HOUR: 14,
  END_HOUR: 17,
  ESCALATION_HOUR: 16
} as const;

export const COLORS = {
  SKY: 0x87ceeb,
  GROUND: 0x4a4a4a,
  BRICK: 0x6b7fa3,
  QUESTION: 0xf5c842,
  USED: 0x888888,
  PLATFORM: 0x8b6914,
  SPIKE: 0x222222,
  VPN: 0x8b44cc,
  CHECKPOINT: 0x22cc44,
  GOAL: 0xdddddd
} as const;

export const COMBO = {
  TIMEOUT_MS: 2500,
  MAX_MULTIPLIER: 8
} as const;

export const SHOP_PRICES = {
  EXTRA_LIFE: 300,
  EXTRA_SPEED: 400,
  FASTER_FIRE: 500,
  START_SHIELD: 350
} as const;

export const TOTAL_LEVELS = 3;
