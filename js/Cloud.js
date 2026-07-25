import { rand } from './Utils.js';
export class Cloud {
  constructor(x) { this.x = x; this.y = rand(38, 126); this.w = rand(82, 136); }
  update(dt) { this.x -= .62 * dt; }
  get offscreen() { return this.x + this.w < 0; }
}
