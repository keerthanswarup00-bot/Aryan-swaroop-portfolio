export class Input {
  constructor(target) {
    this.jumpPressed = false;
    const press = event => { if (event.type !== 'keydown' || ['Space', 'ArrowUp', 'KeyW'].includes(event.code)) { event.preventDefault(); this.jumpPressed = true; } };
    window.addEventListener('keydown', press, { passive: false });
    target.addEventListener('pointerdown', press, { passive: false });
  }
  consumeJump() { const pressed = this.jumpPressed; this.jumpPressed = false; return pressed; }
}
