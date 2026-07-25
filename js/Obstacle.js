const AUTOS = [{ w: 53, h: 42 }, { w: 70, h: 51 }, { w: 90, h: 59 }];
const COW = { w: 58, h: 42 };
const POTHOLE = { w: 58, h: 15 };
export class Obstacle {
  constructor(x, groundY) {
    const roll = Math.random();
    this.type = roll < .55 ? 'auto' : roll < .82 ? 'cow' : 'pothole';
    const size = this.type === 'auto' ? AUTOS[Math.floor(Math.random() * AUTOS.length)] : this.type === 'cow' ? COW : POTHOLE;
    this.x = x; this.width = size.w; this.height = size.h; this.y = groundY - size.h;
  }
  update(speed, dt) { this.x -= speed * dt; }
  get offscreen() { return this.x + this.width < -8; }
  get hitbox() { return this.type === 'pothole' ? { x: this.x + 5, y: this.y + 6, w: this.width - 10, h: 9 } : { x: this.x + 7, y: this.y + 7, w: this.width - 13, h: this.height - 8 }; }
}
