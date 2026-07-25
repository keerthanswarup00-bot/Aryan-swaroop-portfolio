export const GRAVITY = 0.7;
export const JUMP_FORCE = -14;
export const TERMINAL_VELOCITY = 18;
export function stepVelocity(velocity, dt) { return Math.min(TERMINAL_VELOCITY, velocity + GRAVITY * dt); }
