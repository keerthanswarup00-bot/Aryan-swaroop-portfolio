export class Renderer {
  constructor(ctx) { this.ctx = ctx; ctx.imageSmoothingEnabled = false; }
  clear(tone='#fff') { this.ctx.fillStyle=tone; this.ctx.fillRect(0,0,1000,350); this.ctx.fillStyle = '#111'; }
  rect(x,y,w,h) { this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  text(text,x,y,size=16,align='left') { const c=this.ctx; c.font=`${size}px monospace`; c.textAlign=align; c.fillText(text, x, y); }
  cloud(cloud) { const {x,y,w}=cloud; this.ctx.globalAlpha=.25; this.rect(x,y+13,w,2); this.rect(x+8,y+9,w-16,4); this.rect(x+20,y+5,w-40,4); this.rect(x+31,y+2,w-62,3); this.ctx.globalAlpha=1; }
  background(scene) {
    this.ctx.fillStyle='#111'; this.ctx.globalAlpha=.12;
    const sx=786, sy=62; this.rect(sx-8,sy-17,16,3); this.rect(sx-14,sy-11,28,22); this.rect(sx-8,sy+11,16,3);
    // Sparse local flavour, kept close to the horizon like Dino's cacti.
    this.ctx.globalAlpha=.10;
    for (const item of scene.items) {
      const x=item.x, base=scene.groundY-19;
      if(item.type==='metro') { this.rect(x,base-32,104,2); this.rect(x+17,base-30,3,30); this.rect(x+82,base-30,3,30); }
      else { this.rect(x,base-38,3,38); this.rect(x-12,base-28,27,3); this.rect(x-7,base-34,17,4); this.rect(x-3,base-39,9,4); }
    }
    this.ctx.globalAlpha = 1;
  }
  ground(ground) { this.rect(0,ground.y,1000,2); for (const b of ground.bits) { const x=(b.x-ground.offset+1000)%1000; this.rect(x,ground.y+b.y,b.w,2); if(b.w>6) this.rect(x+b.w+5,ground.y+b.y+4,2,2); } }
  player(p) {
    // Original pixel sprite, closely following the supplied runner's cap, backpack and folded-arm pose.
    const x=p.x, y=p.y, frame=p.runningFrame, stride=[0,5,1,7][frame], bob=[0,1,0,-1][frame];
    // backwards cap and head
    this.rect(x+11,y+2+bob,19,5); this.rect(x+7,y+7+bob,26,9); this.rect(x+3,y+14+bob,12,5);
    this.ctx.fillStyle='#fff'; this.rect(x+19,y+11,12,14); this.rect(x+15,y+17,17,9);
    this.ctx.fillStyle='#111'; this.rect(x+28,y+15,7,4); this.rect(x+27,y+23,5,5); this.rect(x+28,y+17,2,2);
    // backpack, shirt, and the crossed hands from the reference
    this.rect(x+8,y+28+bob,13,20); this.rect(x+5,y+33+bob,8,10); this.rect(x+16,y+30,13,16);
    this.ctx.fillStyle='#fff'; this.rect(x+19,y+33,6,8); this.rect(x+22,y+39,12,4); this.rect(x+29,y+35,7,4);
    this.ctx.fillStyle='#111'; this.rect(x+29,y+31,5,5); this.rect(x+34,y+37,6,5); this.rect(x+26,y+42,10,4);
    // shorts and animated running legs
    this.rect(x+13,y+47,19,8); this.rect(x+10,y+53,9,7); this.rect(x+25,y+53,8,7);
    if (frame===1 || frame===3) { this.rect(x+7,y+58,11,6); this.rect(x+2,y+64,15,5); this.rect(x+27,y+57,7,9); this.rect(x+31,y+65,12,5); }
    else { this.rect(x+10,y+58,7,9); this.rect(x+4,y+66,13,4); this.rect(x+26,y+58,11,5); this.rect(x+34+stride,y+63,10,7); }
  }
  auto(o) {
    // Left-facing Indian auto rickshaw: narrow nose, open cabin, black hood and two exposed wheels.
    const x=o.x,y=o.y,w=o.width,h=o.height, sx=w/70, sy=h/62;
    const R=(a,b,c,d)=>this.rect(x+a*sx,y+b*sy,c*sx,d*sy);
    R(17,0,39,5); R(16,5,45,7); R(12,11,5,27); R(8,32,9,10); R(5,40,11,9); // roof/front
    R(14,39,51,14); R(18,50,47,4); R(58,12,7,31); R(62,19,5,26); // body/rear
    R(12,28,6,5); R(17,35,7,4); R(7,48,58,6);
    // window opening and the broad white door panel seen in the source image
    this.ctx.fillStyle='#fff'; R(20,13,14,24); R(39,13,16,25); R(23,38,15,13); R(9,34,6,4);
    this.ctx.fillStyle='#111'; R(36,12,3,28); R(17,27,8,3); R(16,37,5,4); R(35,34,5,4);
    // Slightly offset wheels, a headlight, windshield, bumper, and tiny cabin rider.
    R(5,52,14,10); R(53,52,14,10); this.ctx.fillStyle='#fff'; R(9,55,6,5); R(57,55,6,5); R(10,38,3,3); this.ctx.fillStyle='#111'; R(3,48,8,2); R(16,14,3,12);
    R(23,18,4,5); R(21,23,7,7); R(30,21,2,3);
  }
  cow(o) {
    const x=o.x, y=o.y;
    // Strong square silhouette with horns, muzzle, tail, and separated legs.
    this.rect(x+10,y+12,35,23); this.rect(x+40,y+7,13,21); this.rect(x+50,y+12,8,13); this.rect(x+5,y+17,7,16);
    this.rect(x+43,y+4,3,5); this.rect(x+51,y+5,4,4); this.rect(x+2,y+9,6,3);
    this.rect(x+13,y+34,6,8); this.rect(x+34,y+34,6,8); this.rect(x+48,y+25,5,17); this.rect(x+4,y+29,4,11);
    this.ctx.fillStyle='#fff'; this.rect(x+25,y+17,7,8); this.rect(x+32,y+27,8,4); this.rect(x+50,y+15,4,4); this.rect(x+13,y+39,4,3); this.rect(x+36,y+39,3,3); this.ctx.fillStyle='#111';
  }
  pothole(o) {
    const x=o.x,y=o.y,w=o.width;
    // Wide, broken road edge with an irregular white centre to read as a real hazard at speed.
    this.rect(x+8,y+5,w-16,8); this.rect(x+15,y+2,w-30,13); this.rect(x+3,y+8,10,4); this.rect(x+w-13,y+7,10,5);
    this.ctx.fillStyle='#fff'; this.rect(x+15,y+7,w-30,4); this.rect(x+24,y+4,w-43,3); this.rect(x+w-21,y+10,7,3); this.ctx.fillStyle='#111';
  }
  dust(particles) { this.ctx.globalAlpha=.45; for(const p of particles) this.rect(p.x,p.y,3,2); this.ctx.globalAlpha=1; }
  intro(intro, player) {
    const t=intro.phase;
    if (intro.instructing) {
      this.text('CATCH THE BMTC.',500,130,16,'center');
      this.text('JUMP AUTOS.',500,160,13,'center');
      return;
    }
    this.text('WELCOME TO',500,119,13,'center');
    this.text('BENGALURU',500,153,29,'center');
    if (intro.ready) {
      const bx=450, by=195, bw=100, bh=32;
      this.rect(bx,by,bw,bh);
      this.ctx.fillStyle='#fff'; this.text('START',500,216,12,'center'); this.ctx.fillStyle='#111';
    }
  }
  gameOver() { this.text('GAME OVER',500,135,18,'center'); this.text('YOU MISSED BMTC',500,158,11,'center'); this.text('SPACE TO RETRY',500,178,10,'center'); }
}
