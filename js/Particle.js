export class Particle { constructor(x, y) { this.x=x; this.y=y; this.life=1; } update(dt) { this.x -= 5 * dt; this.life -= .04 * dt; } }
