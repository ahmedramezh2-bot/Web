/* ============================================================
   HEBRA — The Mind
   A contour-line presence: horizontal scan bands over a
   noise-displaced form, reacting to the visitor's hand.
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

export class MindScene {
  constructor(canvas, { lowPower = false } = {}) {
    this.canvas = canvas;
    this.lowPower = lowPower;
    this.mouse = new THREE.Vector2();
    this.mouseTarget = new THREE.Vector2();
    this.energy = { value: 0 };   // rises when the pointer engages
    this.running = false;
    this.clock = new THREE.Clock();
    this._build();
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
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    this.camera.position.set(0, 0, 5.4);

    const detail = this.lowPower ? 96 : 160;
    const geo = new THREE.SphereGeometry(1.45, detail, detail);
    // a subtle cranial silhouette: taller than wide, weighted forward
    geo.scale(0.82, 1.06, 0.9);

    this.uniforms = {
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uBands: { value: this.lowPower ? 46.0 : 64.0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        ${NOISE_GLSL}
        uniform float uTime;
        uniform float uEnergy;
        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vDisp;
        void main() {
          float n = snoise(position * 1.15 + vec3(0.0, uTime * 0.10, uTime * 0.07));
          float disp = n * (0.10 + uEnergy * 0.22);
          vec3 p = position + normal * disp;
          vPos = p;
          vDisp = n;
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform float uEnergy;
        uniform float uBands;
        varying vec3 vPos;
        varying vec3 vNormal;
        varying vec3 vView;
        varying float vDisp;
        void main() {
          // horizontal contour bands — the scan
          float scan = fract(vPos.y * uBands * 0.5 - uTime * 0.35);
          float line = smoothstep(0.0, 0.45, scan) * smoothstep(0.9, 0.45, scan);
          line = pow(line, 6.0);

          float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 1.6);

          vec3 signal = vec3(0.32, 0.44, 1.0);
          vec3 pale = vec3(0.72, 0.78, 1.0);
          vec3 col = mix(signal, pale, fresnel * 0.7 + vDisp * 0.2);

          float a = line * (0.24 + fresnel * 0.85) * (0.55 + uEnergy * 0.6);
          // fade the poles so the form dissolves at crown and base
          a *= smoothstep(1.65, 0.9, abs(vPos.y) + 0.2);
          gl_FragColor = vec4(col * (0.75 + uEnergy * 0.5), a);
        }
      `,
    });

    this.form = new THREE.Mesh(geo, mat);
    this.scene.add(this.form);

    this.resize();
  }

  setMouse(x, y) { this.mouseTarget.set(x, y); }

  resize() {
    const w = this.canvas.clientWidth || 300;
    const h = this.canvas.clientHeight || 300;
    const dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
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
    this.mouse.lerp(this.mouseTarget, 0.05);
    const targetEnergy = Math.min(1, Math.abs(this.mouse.x) + Math.abs(this.mouse.y));
    this.energy.value += (targetEnergy - this.energy.value) * 0.03;

    this.uniforms.uTime.value = t;
    this.uniforms.uEnergy.value = this.energy.value;

    this.form.rotation.y = t * 0.12 + this.mouse.x * 0.55;
    this.form.rotation.x = this.mouse.y * 0.3;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.renderer.dispose();
  }
}
