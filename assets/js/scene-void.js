/* ============================================================
   HEBRA — The Void
   One WebGL context serving the loading rite and the site
   backdrop: a starfield and a refracting crystal, procedural
   recreations of the studio's source imagery.
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

export class VoidScene {
  constructor(canvas, { lowPower = false, still = false } = {}) {
    this.canvas = canvas;
    this.lowPower = lowPower;
    this.still = still; // reduced-motion: render one calm frame, no video

    this.mouse = new THREE.Vector2(0, 0);      // smoothed, -1..1
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.scrollY = 0;
    this.scrollVel = 0;
    this.progress = { value: 0 };              // loading progress 0..1
    this.ignition = { value: 0 };              // flash at the end of the rite
    this.heroShift = { value: 0 };             // 0 = loader framing, 1 = hero framing
    this.scrollFade = { value: 0 };            // 0 at hero, 1 deep in the page
    this.running = false;
    this.clock = new THREE.Clock();

    this._build();
  }

  _build() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.lowPower,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x050507, 1);
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050507, 0.035);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    this.camera.position.set(0, 0, 15);

    this._buildStars();
    this._buildCrystal();
    this._buildDust();

    this.resize();
  }

  /* ---------- Starfield: three depth shells, shader-twinkled ---------- */
  _buildStars() {
    const count = this.lowPower ? 700 : 1800;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // hollow sphere distribution so stars surround the camera path
      const r = 18 + Math.random() * 42;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi) - 12;
      seeds[i] = Math.random() * 100;
      sizes[i] = 0.6 + Math.pow(Math.random(), 3.5) * 2.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    this.starUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms: this.starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vTwinkle;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          vTwinkle = 0.55 + 0.45 * sin(uTime * (0.4 + fract(aSeed) * 1.2) + aSeed);
          gl_PointSize = aSize * uPixelRatio * (140.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uOpacity;
        varying float vTwinkle;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float core = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vec3(0.93, 0.93, 0.96) * core, core * vTwinkle * uOpacity);
        }
      `,
    });

    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  /* ---------- The Crystal: octahedron, fresnel glass + luminous edges ---------- */
  _buildCrystal() {
    this.crystal = new THREE.Group();

    const geo = new THREE.OctahedronGeometry(2.1, 0);

    // The studio's crystal-head footage lives inside the glass. The texture is
    // sampled in object space so it turns with the crystal, like something
    // sealed within it. Until the video actually plays, uVideoMix stays 0 and
    // the material renders exactly as before.
    let videoTex = null;
    if (!this.still && typeof document !== 'undefined') {
      const video = document.createElement('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.src = video.canPlayType('video/mp4; codecs="avc1.42E01E"')
        ? 'assets/media/crystal-head.mp4'
        : 'assets/media/crystal-head.webm';
      videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;
      this.crystalVideo = video;
      video.addEventListener('playing', () => { this._videoLive = true; }, { once: true });
      video.play().catch(() => { /* autoplay refused: shader keeps its procedural veil */ });
    }

    this.crystalUniforms = {
      uTime: { value: 0 },
      uIgnite: { value: 0 },
      uReveal: { value: 0 },
      uVideoMix: { value: 0 },
      uVideo: { value: videoTex },
    };

    const faceMat = new THREE.ShaderMaterial({
      uniforms: this.crystalUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vView;
        varying vec3 vPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          vPos = position;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        ${NOISE_GLSL}
        uniform float uTime;
        uniform float uIgnite;
        uniform float uReveal;
        uniform float uVideoMix;
        uniform sampler2D uVideo;
        varying vec3 vNormal;
        varying vec3 vView;
        varying vec3 vPos;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.4);
          // slow internal aurora — the cosmos trapped in the glass
          float veil = snoise(vPos * 0.55 + vec3(0.0, uTime * 0.06, uTime * 0.045));
          veil = smoothstep(-0.35, 0.9, veil);
          vec3 cold = vec3(0.55, 0.62, 0.95);
          vec3 pale = vec3(0.92, 0.93, 0.97);
          vec3 col = mix(cold, pale, fresnel) * (0.16 + veil * 0.22);
          col += pale * uIgnite * 0.9;
          float a = (fresnel * 0.55 + veil * 0.10 + uIgnite * 0.5) * uReveal;
          // the sealed footage: object-space projection, so it rotates with the glass
          if (uVideoMix > 0.001) {
            vec2 vuv = clamp(vPos.xy / 4.4 + 0.5, 0.0, 1.0);
            vec3 vid = texture2D(uVideo, vuv).rgb;
            float lum = dot(vid, vec3(0.299, 0.587, 0.114));
            col += vid * uVideoMix * (0.5 + veil * 0.35);
            a += lum * uVideoMix * 0.55 * uReveal;
          }
          gl_FragColor = vec4(col, a);
        }
      `,
    });

    const faces = new THREE.Mesh(geo, faceMat);
    this.crystal.add(faces);

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xdfe2ee,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.crystalEdges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    this.crystal.add(this.crystalEdges);

    // inner cosmos — a handful of drifting sparks inside the glass
    const n = this.lowPower ? 40 : 90;
    const pts = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3(
        (Math.random() * 2 - 1),
        (Math.random() * 2 - 1),
        (Math.random() * 2 - 1)
      ).normalize().multiplyScalar(Math.pow(Math.random(), 0.6) * 1.5);
      pts.set([v.x, v.y, v.z], i * 3);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    this.sparkMat = new THREE.PointsMaterial({
      color: 0xaebaf5,
      size: 0.035,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.crystal.add(new THREE.Points(sparkGeo, this.sparkMat));

    this.crystal.scale.setScalar(0.001);
    this.scene.add(this.crystal);
  }

  /* ---------- Near-field dust, slow vertical drift ---------- */
  _buildDust() {
    const count = this.lowPower ? 90 : 220;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * 12;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 7;
      positions[i * 3 + 2] = Math.random() * 8 - 2;
      seeds[i] = Math.random() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    this.dustUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.dustUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */`
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vFade;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.12 + aSeed) * 0.8;
          p.x += cos(uTime * 0.09 + aSeed * 2.0) * 0.5;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          vFade = 0.4 + 0.6 * sin(aSeed);
          gl_PointSize = 1.6 * uPixelRatio * (60.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uOpacity;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float core = smoothstep(0.5, 0.1, d);
          gl_FragColor = vec4(vec3(0.85), core * vFade * uOpacity * 0.35);
        }
      `,
    });
    this.dust = new THREE.Points(geo, mat);
    this.scene.add(this.dust);
  }

  /* ---------- external drivers ---------- */
  setMouse(x, y) { this.mouseTarget.set(x, y); }
  setScroll(y, vel) { this.scrollY = y; this.scrollVel = vel; }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.starUniforms.uPixelRatio.value = dpr;
    this.dustUniforms.uPixelRatio.value = dpr;
    this.portrait = h > w;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    if (this.crystalVideo && this.crystalVideo.paused) {
      this.crystalVideo.play().catch(() => {});
    }
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
    if (this.crystalVideo && !this.crystalVideo.paused) this.crystalVideo.pause();
  }

  renderOnce() { this._tick(); }

  _tick() {
    const t = this.clock.getElapsedTime();
    const p = this.progress.value;
    const shift = this.heroShift.value;
    const fade = this.scrollFade.value;

    this.mouse.lerp(this.mouseTarget, 0.045);

    // uniforms
    this.starUniforms.uTime.value = t;
    this.dustUniforms.uTime.value = t;
    this.crystalUniforms.uTime.value = t;
    this.crystalUniforms.uIgnite.value = this.ignition.value;
    this.crystalUniforms.uReveal.value = Math.min(1, p * 1.4);
    // the sealed footage fades in only once frames are actually flowing
    const mixTarget = this._videoLive ? 1 : 0;
    this.crystalUniforms.uVideoMix.value += (mixTarget - this.crystalUniforms.uVideoMix.value) * 0.02;

    this.starUniforms.uOpacity.value = (0.15 + p * 0.85) * (1 - fade * 0.55);
    this.dustUniforms.uOpacity.value = p * (1 - fade * 0.8);
    this.crystalEdges.material.opacity = (0.12 + p * 0.5 + this.ignition.value * 0.5) * (1 - fade);
    this.sparkMat.opacity = (p * 0.85 + this.ignition.value) * (1 - fade);

    // crystal life — the rite grows it centre-stage, the hero framing
    // sends it drifting off to orbit (far right on landscape, high and
    // small on portrait so it never swallows the wordmark)
    const grow = 0.05 + 0.95 * (1 - Math.pow(1 - p, 3));
    const breathe = 1 + Math.sin(t * 0.8) * 0.012;
    const heroScale = 1 - shift * (this.portrait ? 0.55 : 0.28);
    this.crystal.scale.setScalar(grow * breathe * heroScale * (1 - fade * 0.35));
    this.crystal.rotation.y = t * 0.22 + this.scrollVel * 0.00035 + this.scrollY * 0.0006;
    this.crystal.rotation.x = Math.sin(t * 0.16) * 0.24 + 0.18;
    this.crystal.position.y = Math.sin(t * 0.5) * 0.14 + shift * (this.portrait ? 2.6 : 0.85) + fade * 4.5;
    this.crystal.position.x = shift * (this.portrait ? 0.9 : 3.9);
    this.crystal.position.z = shift * -1.4;

    // camera: dolly through the rite, drift with the pointer after it
    const dolly = 15 - p * 6.2 - shift * 0.6 + (this.portrait ? shift * 1.6 : 0);
    this.camera.position.z += (dolly - this.camera.position.z) * 0.03;
    this.camera.position.x += (this.mouse.x * 0.55 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouse.y * 0.4 - this.scrollY * 0.0012 - this.camera.position.y) * 0.03;
    this.camera.lookAt(shift * (this.portrait ? 0 : 0.9), shift * (this.portrait ? 0.5 : 0.1), 0);

    // starfield parallax
    this.stars.rotation.y = t * 0.005 + this.mouse.x * 0.02 + this.scrollY * 0.00006;
    this.stars.rotation.x = this.mouse.y * 0.015 + this.scrollY * 0.00004;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.renderer.dispose();
  }
}
