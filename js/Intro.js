export class Intro {
  constructor() { this.time = 0; this.ready = false; this.instructing = false; this.instructTime = 0; }
  update(dt) { this.time += dt * 16.67; if (this.time > 1500) this.ready = true; if (this.instructing) this.instructTime += dt * 16.67; }
  get phase() { return this.time; }
  get instructDone() { return this.instructTime > 2500; }
}
