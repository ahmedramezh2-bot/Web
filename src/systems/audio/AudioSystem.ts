/**
 * AudioSystem — one responsibility: the sound of the void.
 *
 * The entire audio language is synthesized in WebAudio. No files,
 * no samples, nothing borrowed (Creative Bible: Sound). The world
 * breathes through a sub-bass pair and brown-noise static; distant
 * swells arrive off-grid and never loop; interactions speak in the
 * vocabulary of glass, dust and moving air.
 *
 * Nothing plays until the visitor invites it. Autoplay is never
 * attempted.
 */

class AudioSystemImpl {
  enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastTick = 0;

  private ensure(): void {
    if (this.ctx) return;
    const AC = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();

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

    this.buildAmbient();
  }

  /* ---------- the room tone of another dimension ---------- */
  private buildAmbient(): void {
    const ctx = this.ctx!;
    const master = this.master!;

    const ambient = ctx.createGain();
    ambient.gain.value = 0.9;
    ambient.connect(master);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 220;
    lowpass.connect(ambient);

    for (const f of [54, 54.4]) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      osc.connect(g);
      g.connect(lowpass);
      osc.start();
    }

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
    const nf = ctx.createBiquadFilter();
    nf.type = 'lowpass';
    nf.frequency.value = 160;
    const ng = ctx.createGain();
    ng.gain.value = 0.05;
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(ambient);
    noise.start();

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 1 / 53;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain);
    lfoGain.connect(ambient.gain);
    lfo.start();

    this.scheduleSwell();
  }

  private scheduleSwell(): void {
    const delay = 9000 + Math.random() * 14000;
    setTimeout(() => {
      if (this.enabled && this.ctx && this.master) {
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
      this.scheduleSwell();
    }, delay);
  }

  /* ---------- interaction vocabulary ---------- */

  /** A grain of dust striking glass — hover. */
  tick(): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const now = performance.now();
    if (now - this.lastTick < 70) return;
    this.lastTick = now;
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
    src.connect(hp);
    hp.connect(g);
    g.connect(this.master);
    src.start(t);
  }

  /** A switch engineered from glass and brass — click. */
  click(): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, t);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.12);
    this.tick();
  }

  /** Air moving through a door between rooms — transitions. */
  whoosh(opening = true): void {
    if (!this.enabled || !this.ctx || !this.master) return;
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
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(t);
  }

  private chime(): void {
    const ctx = this.ctx!;
    const master = this.master!;
    const t = ctx.currentTime + 0.3;
    [523.25, 784.0].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.12);
      g.gain.linearRampToValueAtTime(0.022, t + i * 0.12 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 1.4);
      osc.connect(g);
      g.connect(master);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 1.5);
    });
  }

  /* ---------- the visitor's hand on the switch ---------- */
  async enable(): Promise<boolean> {
    this.ensure();
    if (!this.ctx || !this.master) return false;
    try {
      await this.ctx.resume();
    } catch {
      return false;
    }
    this.enabled = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.55, t + 1.4);
    this.chime();
    return true;
  }

  disable(): void {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.6);
    setTimeout(() => {
      if (!this.enabled) void this.ctx?.suspend();
    }, 700);
  }

  async toggle(): Promise<boolean> {
    if (this.enabled) {
      this.disable();
      return false;
    }
    return this.enable();
  }
}

export const AudioSystem = new AudioSystemImpl();
