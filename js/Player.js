import { JUMP_FORCE, stepVelocity } from './Physics.js';
export class Player {
  constructor(groundY) { this.x = 180; this.width = 42; this.height = 70; this.groundY = groundY; this.reset(); }
  reset() { this.y = this.groundY - this.height; this.vy = 0; this.runningFrame = 0; this.animation = 0; this.dead = false; }
  get onGround() { return this.y >= this.groundY - this.height; }
  jump() { if (!this.dead && this.onGround) { this.vy = JUMP_FORCE; return true; } return false; }
  update(dt) { if (!this.onGround || this.vy) { this.vy = stepVelocity(this.vy, dt); this.y += this.vy * dt; if (this.y >= this.groundY - this.height) { this.y = this.groundY - this.height; this.vy = 0; } } this.animation += dt * 16.67; if (this.animation > 75) { this.runningFrame = (this.runningFrame + 1) % 4; this.animation = 0; } }
  get hitbox() { return { x: this.x + 7, y: this.y + 9, w: 28, h: 58 }; }
}
