export class Sound {
  constructor(button) {
    this.button = button;
    this.context = null;
    this.muted = localStorage.getItem('game_muted') !== 'false';
    this._musicGain = null;
    this._musicNodes = [];
    this._musicPlaying = false;
    this._loopTimer = null;
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._updateButton();
    button.onclick = e => { e.stopPropagation(); this.toggle(); };
  }

  _ensureCtx() {
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') this.context.resume();
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('game_muted', this.muted);
    this._updateButton();
    if (this.muted) this.stopMusic(); else if (this._musicShouldPlay) this.startMusic();
  }

  _updateButton() {
    this.button.textContent = this.muted ? '🔇' : '♪';
  }

  play(type) {
    if (this.muted) return;
    this._ensureCtx();
    const osc = this.context.createOscillator(), gain = this.context.createGain();
    const tones = { jump: [440, .06], score: [720, .035], over: [110, .24], honk: [230, .12], whistle: [980, .12] };
    const [freq, duration] = tones[type] || tones.score;
    osc.frequency.value = freq;
    osc.type = type === 'over' ? 'sawtooth' : 'square';
    gain.gain.setValueAtTime(.025, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + duration);
    osc.connect(gain).connect(this.context.destination);
    osc.start(); osc.stop(this.context.currentTime + duration);
  }

  startMusic() {
    if (this.muted || this._musicPlaying) return;
    this._ensureCtx();
    this._musicShouldPlay = true;
    this._musicPlaying = true;
    this._musicGain = this.context.createGain();
    this._musicGain.gain.value = this._reducedMotion ? 0.01 : 0.018;
    this._musicGain.connect(this.context.destination);
    this._playLoop();
  }

  stopMusic() {
    this._musicShouldPlay = false;
    this._musicPlaying = false;
    if (this._loopTimer) { clearTimeout(this._loopTimer); this._loopTimer = null; }
    this._musicNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this._musicNodes = [];
    if (this._musicGain) { try { this._musicGain.disconnect(); } catch(e) {} this._musicGain = null; }
  }

  _playLoop() {
    if (!this._musicPlaying || this.muted) return;
    const ctx = this.context;
    const t = ctx.currentTime + 0.05;
    const bpm = 140;
    const beat = 60 / bpm;
    const bar = beat * 4;
    const loopLen = bar * 2;

    const bassNotes = [
      130.81, 130.81, 164.81, 164.81,
      146.83, 146.83, 174.61, 174.61,
      130.81, 130.81, 164.81, 164.81,
      110.00, 110.00, 146.83, 146.83
    ];

    const melodyNotes = [
      523.25, 0, 659.25, 0, 783.99, 0, 659.25, 523.25,
      587.33, 0, 698.46, 0, 783.99, 0, 698.46, 0,
      523.25, 0, 659.25, 0, 783.99, 880.00, 783.99, 659.25,
      523.25, 0, 587.33, 0, 523.25, 0, 0, 0
    ];

    const arpNotes = [
      261.63, 329.63, 392.00, 329.63,
      293.66, 349.23, 440.00, 349.23,
      261.63, 329.63, 392.00, 329.63,
      220.00, 277.18, 329.63, 277.18
    ];

    const playNote = (freq, start, dur, type, vol) => {
      if (freq === 0) return;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(vol, t + start + 0.01);
      g.gain.setValueAtTime(vol, t + start + dur * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
      osc.connect(g).connect(this._musicGain);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.01);
      this._musicNodes.push(osc);
    };

    for (let i = 0; i < 16; i++) {
      const s = i * beat * 0.5;
      playNote(bassNotes[i], s, beat * 0.5, 'square', 0.012);
      playNote(melodyNotes[i], s, beat * 0.5, 'square', 0.006);
      playNote(arpNotes[i], s, beat * 0.25, 'triangle', 0.005);
    }

    this._loopTimer = setTimeout(() => {
      this._musicNodes = [];
      this._playLoop();
    }, loopLen * 1000 - 50);
  }
}
