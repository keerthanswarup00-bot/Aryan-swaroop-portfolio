import { rand } from './Utils.js';
export class Ground {
  constructor(y, width) { this.y = y; this.width = width; this.offset = 0; this.bits = Array.from({ length: 86 }, () => ({ x: rand(0, width), w: rand(2, 10), y: rand(5, 24) })); }
  update(speed, dt) { this.offset = (this.offset + speed * dt) % this.width; }
}
