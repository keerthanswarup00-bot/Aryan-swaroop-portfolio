import { padScore } from './Utils.js';
export class Score {
  constructor() { this.high = Number(localStorage.getItem('auto-run-high') || 0); this.value = 0; this.lastMilestone = 0; }
  reset() { this.value = 0; this.lastMilestone = 0; }
  update(dt) { this.value += dt * .6; if (this.value > this.high) { this.high = Math.floor(this.value); localStorage.setItem('auto-run-high', this.high); } }
  get milestone() { const point = Math.floor(this.value / 100) * 100; if (point > 0 && point > this.lastMilestone) { this.lastMilestone = point; return true; } return false; }
  text() { return `HI ${padScore(this.high)}  ${padScore(this.value)}`; }
}
