export class Sound {
  constructor(button) { this.muted = false; this.context = null; button.onclick = e => { e.stopPropagation(); this.muted = !this.muted; button.textContent = this.muted ? '×' : '♪'; }; }
  play(type) {
    if (this.muted) return;
    this.context ??= new AudioContext();
    const osc = this.context.createOscillator(), gain = this.context.createGain();
    const tones = { jump: [440, .06], score: [720, .035], over: [110, .24], honk: [230, .12], whistle: [980, .12] };
    const [freq, duration] = tones[type] || tones.score;
    osc.frequency.value = freq; osc.type = type === 'over' ? 'sawtooth' : 'square'; gain.gain.setValueAtTime(.025, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + duration);
    osc.connect(gain).connect(this.context.destination); osc.start(); osc.stop(this.context.currentTime + duration);
  }
}
