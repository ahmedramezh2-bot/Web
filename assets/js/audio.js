/* ============================================================
   HEBRA — The Sound of the Void
   ------------------------------------------------------------
   One audio language, synthesized entirely in WebAudio.
   No files. No gaming sounds. No beeps. Every tone is built
   from sine waves and filtered noise — the vocabulary of deep
   space, silence, and expensive machinery.

   Nothing plays until the visitor invites it (the SOUND toggle
   in the header). Autoplay is never attempted.
   ============================================================ */

export class HebraAudio {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this._lastTick = 0;
  }

  _ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();

    // master chain: gain → gentle compressor → out
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -28;
    comp.knee.value = 24;
    comp.ratio.value = 6;
    comp.attack.value = 0.02;
    comp.release.value = 0.4;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);

    this._buildAmbient();
  }

  /* ---------- the room tone of another dimension ---------- */
  _buildAmbient() {
    const ctx = this.ctx;
    this.ambient = ctx.createGain();
    this.ambient.gain.value = 0.9;
    this.ambient.connect(this.master);

    // sub-bass pair, barely detuned — an engine very far away
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 220;
    lowpass.connect(this.ambient);

    [54, 54.4].forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      osc.connect(g);
      g.connect(lowpass);
      osc.start();
    });

    // brown-noise bed through a deep lowpass — cosmic static
    const seconds = 6;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 160;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambient);
    noise.start();

    // the bed breathes — a whole-minute swell cycle
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 53;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambient.gain);
    lfo.start();

    this._scheduleSwell();
  }

  /* occasional distant tones — never on a grid, never looping */
  _scheduleSwell() {
    const delay = 9000 + Math.random() * 14000;
    this._swellTimer = setTimeout(() => {
      if (this.enabled && this.ctx) {
        const ctx = this.ctx;
        const t = ctx.currentTime;
        const f = 160 + Math.random() * 180;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.linearRampToValueAtTime(f * (0.96 + Math.random() * 0.08), t + 7);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 700;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.028, t + 3.2);
        g.gain.linearRampToValueAtTime(0, t + 7);
        osc.connect(filter);
        filter.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + 7.2);
      }
      this._scheduleSwell();
    }, delay);
  }

  /* ---------- interaction vocabulary ---------- */

  /* a grain of dust striking glass — hover */
  tick() {
    if (!this.enabled || !this.ctx) return;
    const now = performance.now();
    if (now - this._lastTick < 70) return;   // never machine-gun
    this._lastTick = now;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 5200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.012, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp); hp.connect(g); g.connect(this.master);
    src.start(t);
  }

  /* a switch engineered from glass and brass — click */
  click() {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, t);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + 0.12);
    this.tick();
  }

  /* air moving through a door between rooms — menu */
  whoosh(opening = true) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const dur = 0.5;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(opening ? 220 : 1600, t);
    bp.frequency.exponentialRampToValueAtTime(opening ? 1600 : 220, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t);
  }

  /* the quiet confirmation that sound now exists */
  _chime() {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.3;
    [523.25, 784.0].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.12);
      g.gain.linearRampToValueAtTime(0.022, t + i * 0.12 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 1.4);
      osc.connect(g); g.connect(this.master);
      osc.start(t + i * 0.12); osc.stop(t + i * 0.12 + 1.5);
    });
  }

  /* ---------- the visitor's hand on the switch ---------- */
  async enable() {
    this._ensure();
    if (!this.ctx) return false;
    try { await this.ctx.resume(); } catch { return false; }
    this.enabled = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.55, t + 1.4);
    this._chime();
    return true;
  }

  disable() {
    if (!this.ctx) { this.enabled = false; return; }
    this.enabled = false;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.6);
    setTimeout(() => { if (!this.enabled && this.ctx) this.ctx.suspend(); }, 700);
  }

  async toggle() {
    if (this.enabled) { this.disable(); return false; }
    return this.enable();
  }
}
