import { Input } from './Input.js';
import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';
import { Ground } from './Ground.js';
import { Cloud } from './Cloud.js';
import { Background } from './Background.js';
import { Score } from './Score.js';
import { Sound } from './Sound.js';
import { Renderer } from './Renderer.js';
import { Particle } from './Particle.js';
import { Intro } from './Intro.js';
import { rand } from './Utils.js';

export class Game {
  constructor(canvas, mute) {
    this.canvas=canvas; this.renderer=new Renderer(canvas.getContext('2d')); this.input=new Input(canvas); this.sound=new Sound(mute);
    this.ground=new Ground(290,1000); this.background=new Background(290,1000); this.player=new Player(290); this.score=new Score();
    this.obstacles=[]; this.clouds=[new Cloud(520),new Cloud(900)]; this.particles=[]; this.intro=new Intro(); this.mode='intro';
    this.running=true; this.last=0; this.nextObstacle=850; this.nextCloud=430; this.dustTimer=0; this.runIn=0; this.shake=0; this.flash=0; this.honked=false; this.whistled=false;
  }
  start() { requestAnimationFrame(t=>this.loop(t)); }
  restart() { this.mode='play'; this.running=true; this.player.reset(); this.obstacles.length=0; this.particles.length=0; this.background.reset(); this.score.reset(); this.nextObstacle=750; this.runIn=0; this.flash=10; }
  loop(now) { const dt=Math.min(2.2,(now-this.last||16.67)/16.67); this.last=now; this.update(dt); this.render(); requestAnimationFrame(t=>this.loop(t)); }
  update(dt) {
    if (this.mode==='intro') {
      this.intro.update(dt); this.ground.update(1.1,dt); this.clouds.forEach(c=>c.update(dt));
      if (this.intro.instructing) {
        if (this.intro.instructDone) { this.mode='play'; this.runIn=0; this.flash=12; }
        return;
      }
      if (this.input.consumeJump() && this.intro.ready) { this.intro.instructing = true; this.intro.instructTime = 0; return; }
      return;
    }
    if (this.input.consumeJump()) { if (!this.running) this.restart(); else if (this.player.jump()) this.sound.play('jump'); }
    if (!this.running) return;
    this.runIn+=dt; const base=Math.min(13,6+Math.floor(this.score.value/100)*.75); const speed=(2+(base-2)*Math.min(1,this.runIn/120))*0.9;
    this.player.update(dt); this.ground.update(speed,dt); this.background.update(speed,dt); this.score.update(dt);
    if(this.score.milestone) { this.sound.play('score'); this.flash=18; }
    this.flash=Math.max(0,this.flash-dt); this.shake=Math.max(0,this.shake-dt);
    for(const o of this.obstacles) o.update(speed,dt); this.obstacles=this.obstacles.filter(o=>!o.offscreen);
    for(const c of this.clouds)c.update(dt); this.clouds=this.clouds.filter(c=>!c.offscreen);
    for(const p of this.particles)p.update(dt); this.particles=this.particles.filter(p=>p.life>0);
    this.dustTimer-=dt; if(this.player.onGround && this.dustTimer<=0) { this.particles.push(new Particle(this.player.x+8,286)); this.dustTimer=7; }
    this.nextObstacle-=speed*dt; this.nextCloud-=dt*3;
    if(this.nextObstacle<=0) { this.obstacles.push(new Obstacle(1030,290)); this.nextObstacle=rand(Math.max(300,590-speed*18),Math.max(535,920-speed*15)); }
    if(this.nextCloud<=0 && this.clouds.length<3) { this.clouds.push(new Cloud(1030)); this.nextCloud=rand(450,750); }
    if(this.obstacles.some(o=>this.collides(this.player.hitbox,o.hitbox))) { this.running=false; this.player.dead=true; this.shake=16; this.sound.play('over'); }
  }
  collides(a,b) { return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
  tone() { return ['#ffffff','#fdfcf9','#faf8f2','#f6f3ee'][Math.floor(this.score.value/250)%4]; }
  render() {
    const r=this.renderer, ctx=r.ctx; r.clear(this.tone());
    ctx.save(); if(this.shake>0) ctx.translate(((this.shake|0)%2)*2-1,0);
    if(this.mode==='intro') { for(const c of this.clouds)r.cloud(c); r.ground(this.ground); r.intro(this.intro,this.player); ctx.restore(); return; }
    r.background(this.background); for(const c of this.clouds)r.cloud(c); r.ground(this.ground); r.dust(this.particles);
    for(const o of this.obstacles) { if(o.type==='auto') r.auto(o); else if(o.type==='cow') r.cow(o); else r.pothole(o); }
    r.player(this.player); ctx.globalAlpha=this.flash>0 ? .42 : 1; r.text(this.score.text(),978,32,15,'right'); ctx.globalAlpha=1;
    if(!this.running)r.gameOver(); ctx.restore();
  }
}
