/* ============================================================
   HEBRA — The Witness
   A single eye, drawn entirely in the fragment shader:
   fibrous iris, wet cornea, breathing pupil, soft lids.
   It follows the visitor's hand, wanders when ignored,
   and blinks on its own time. Never repetitive.
   ============================================================ */

import * as THREE from './vendor/three.module.min.js';

const NOISE_GLSL = /* glsl */`
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

export class EyeScene {
  constructor(canvas, { lowPower = false } = {}) {
    this.canvas = canvas;
    this.lowPower = lowPower;
    this.gazeTarget = new THREE.Vector2(0, 0);
    this.gaze = new THREE.Vector2(0, 0);
    this.gazeVel = new THREE.Vector2(0, 0);
    this.pupilTarget = 0.13;
    this.blink = { value: 0 };
    this.lastPointerAt = 0;
    this.running = false;
    this.clock = new THREE.Clock();
    this._build();
    this._scheduleBlink();
  }

  _build() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;

    this.uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uGaze: { value: this.gaze },
      uPupil: { value: 0.13 },
      uBlink: { value: 0 },
      uAwake: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        precision highp float;
        ${NOISE_GLSL}
        uniform float uTime;
        uniform float uAspect;
        uniform vec2 uGaze;
        uniform float uPupil;
        uniform float uBlink;
        uniform float uAwake;
        varying vec2 vUv;

        float fbm(vec3 p) {
          float s = 0.0, a = 0.5;
          for (int i = 0; i < 4; i++) { s += a * snoise(p); p *= 2.11; a *= 0.5; }
          return s;
        }

        void main() {
          // centred, aspect-true coordinates; the eyeball has radius ~0.72
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= uAspect;

          float rBall = 0.94;
          float dBall = length(uv);
          if (dBall > 1.4) { discard; }

          // fake sphere normal for shading
          float zBall = sqrt(max(0.0, rBall * rBall - dBall * dBall));
          vec3 N = normalize(vec3(uv, zBall + 0.0001));
          vec3 L = normalize(vec3(-0.35, 0.55, 0.75));
          float lambert = clamp(dot(N, L), 0.0, 1.0);

          // ---------- gaze ----------
          vec2 gaze = uGaze * 0.26;
          vec2 p = uv - gaze;
          float rp = length(p);
          float ang = atan(p.y, p.x);

          float irisR = 0.335;
          float pupilR = uPupil * (1.0 + snoise(vec3(uTime * 0.6, 3.3, 7.7)) * 0.035);

          // ---------- sclera ----------
          float scleraShade = 0.62 + lambert * 0.38;
          // subtle vascular web, denser toward the corners
          float vein = fbm(vec3(uv * 7.0, 11.0));
          vein = smoothstep(0.38, 0.62, vein) * smoothstep(0.30, 0.75, dBall);
          vec3 sclera = vec3(0.82, 0.83, 0.86) * scleraShade;
          sclera = mix(sclera, vec3(0.62, 0.42, 0.44), vein * 0.16);
          // shadow pooling at the ball's edge
          sclera *= 1.0 - smoothstep(0.52, 0.80, dBall) * 0.55;

          // ---------- iris ----------
          // fibres: radial strands at two frequencies, pulled slightly by time
          float fib1 = snoise(vec3(ang * 7.0, rp * 26.0, 2.0 + uTime * 0.015));
          float fib2 = snoise(vec3(ang * 21.0, rp * 60.0, 5.0));
          float fib = fib1 * 0.6 + fib2 * 0.4;
          float ringGrad = smoothstep(pupilR, irisR, rp);
          vec3 irisDeep = vec3(0.07, 0.10, 0.17);
          vec3 irisMid  = vec3(0.16, 0.23, 0.38);
          vec3 irisEdge = vec3(0.38, 0.48, 0.72);
          vec3 iris = mix(irisDeep, irisMid, ringGrad);
          iris = mix(iris, irisEdge, smoothstep(0.35, 0.95, fib) * ringGrad * 0.85);
          iris += vec3(0.30, 0.38, 0.62) * pow(max(fib, 0.0), 3.0) * 0.35;
          // collarette — the bright inner ring around the pupil
          iris += vec3(0.42, 0.5, 0.72) * smoothstep(0.10, 0.0, abs(rp - pupilR * 1.55)) * 0.35;
          // limbal ring — the dark rim that makes an eye feel alive
          iris *= 1.0 - smoothstep(irisR * 0.78, irisR, rp) * 0.75;
          iris *= 0.35 + lambert * 0.75;

          // iris occupies its disc
          float irisMask = smoothstep(irisR + 0.008, irisR - 0.008, rp);
          vec3 col = mix(sclera, iris, irisMask);

          // ---------- pupil ----------
          float pupilMask = smoothstep(pupilR + 0.012, pupilR - 0.012, rp);
          col = mix(col, vec3(0.004, 0.005, 0.010), pupilMask);
          // faint retro-glow deep inside
          col += vec3(0.05, 0.07, 0.13) * smoothstep(pupilR, 0.0, rp) * 0.35;

          // ---------- cornea: moisture and reflections ----------
          // primary catchlight
          vec2 hl1 = uv - vec2(-0.16, 0.20) - gaze * 0.55;
          col += vec3(1.0) * exp(-dot(hl1, hl1) * 520.0) * 0.9;
          // secondary soft window reflection
          vec2 hl2 = uv - vec2(0.14, -0.03) - gaze * 0.4;
          col += vec3(0.5, 0.6, 0.85) * exp(-dot(hl2, hl2) * 900.0) * 0.30;
          // lower moisture arc
          float moist = smoothstep(0.015, 0.0, abs(dBall - rBall * 0.86)) *
                        smoothstep(0.0, -0.35, uv.y) * 0.35;
          col += vec3(0.9, 0.93, 1.0) * moist;

          // ---------- eyelids ----------
          // lids close as uBlink rises; upper lid does most of the travel
          float lidCurve = uv.x * uv.x * 0.55;
          float upper = mix(0.62, -0.10, uBlink) - lidCurve;
          float lower = mix(-0.60, -0.16, uBlink * 0.55) + lidCurve * 0.7;
          float openMask = smoothstep(upper + 0.045, upper - 0.045, uv.y)
                         * smoothstep(lower - 0.045, lower + 0.045, uv.y);
          // ambient occlusion beneath the upper lid
          col *= 1.0 - smoothstep(upper - 0.16, upper, uv.y) * 0.45;

          // outside the eyeball, nothing
          float ballMask = smoothstep(rBall + 0.012, rBall - 0.012, dBall);

          float alpha = ballMask * openMask * uAwake;
          gl_FragColor = vec4(col * openMask * 1.45, alpha);
        }
      `,
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    this.scene.add(this.quad);
    this.resize();
  }

  /* gaze target in -1..1, relative to the canvas */
  setPointer(x, y) {
    this.gazeTarget.set(
      Math.max(-1, Math.min(1, x)),
      Math.max(-1, Math.min(1, y))
    );
    this.lastPointerAt = this.clock.getElapsedTime();
    // attention dilates the pupil slightly
    this.pupilTarget = 0.15;
  }

  _scheduleBlink() {
    const delay = 2600 + Math.random() * 4800;
    this._blinkTimer = setTimeout(() => {
      this._doBlink();
      // occasionally a double blink
      if (Math.random() < 0.18) {
        setTimeout(() => this._doBlink(), 340);
      }
      this._scheduleBlink();
    }, delay);
  }

  _doBlink() {
    if (!this.running) return;
    const start = performance.now();
    const down = 90, up = 170;
    const step = (now) => {
      const el = now - start;
      if (el < down) this.blink.value = el / down;
      else if (el < down + up) this.blink.value = 1 - (el - down) / up;
      else { this.blink.value = 0; return; }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  resize() {
    const w = this.canvas.clientWidth || 300;
    const h = this.canvas.clientHeight || 300;
    const dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.uniforms.uAspect.value = w / h;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this._tick();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  _tick() {
    const t = this.clock.getElapsedTime();

    // when ignored, the eye wanders on its own — slow, deliberate
    if (t - this.lastPointerAt > 3.5) {
      this.gazeTarget.set(
        Math.sin(t * 0.21) * 0.45 + Math.sin(t * 0.047) * 0.2,
        Math.cos(t * 0.16) * 0.3
      );
      this.pupilTarget = 0.125;
    }

    // critically-damped-ish spring: the eye has weight
    const stiff = 0.016, damp = 0.86;
    this.gazeVel.x = (this.gazeVel.x + (this.gazeTarget.x - this.gaze.x) * stiff) * damp;
    this.gazeVel.y = (this.gazeVel.y + (this.gazeTarget.y - this.gaze.y) * stiff) * damp;
    this.gaze.add(this.gazeVel);

    // pupil breathes
    const breathe = Math.sin(t * 0.9) * 0.004;
    this.uniforms.uPupil.value += (this.pupilTarget + breathe - this.uniforms.uPupil.value) * 0.04;

    this.uniforms.uTime.value = t;
    this.uniforms.uBlink.value = this.blink.value;
    this.uniforms.uAwake.value += (1 - this.uniforms.uAwake.value) * 0.02;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    clearTimeout(this._blinkTimer);
    this.renderer.dispose();
  }
}
