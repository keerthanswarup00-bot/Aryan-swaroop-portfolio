// One quiet landmark at a time: the game keeps the generous empty sky of Dino.
export class Background {
  constructor(groundY, width) { this.groundY=groundY; this.width=width; this.reset(); }
  reset() { this.items=[{x:650,type:'metro'},{x:1320,type:'coconut'}]; }
  update(speed, dt) {
    for (const item of this.items) item.x -= speed*.18*dt;
    for (const item of this.items) {
      if (item.x < -110) {
        const far=Math.max(...this.items.map(entry=>entry.x));
        item.x=far+650;
        item.type=item.type==='metro'?'coconut':'metro';
      }
    }
  }
}
