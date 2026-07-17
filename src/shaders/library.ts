import type { ShaderSystemHandle, ShaderSources } from './shaderSystem';

/**
 * The authored shader library — Phase H content registered through
 * the Shader Bible's checklist type. Every shader here executes a
 * specific script beat or Bible requirement, cited in its `purpose`.
 *
 * GLSL conventions: three.js ShaderMaterial injects the standard
 * matrices/attributes (position, uv, normal, modelViewMatrix,
 * projectionMatrix, normalMatrix) — sources rely only on those
 * documented built-ins plus our declared uniforms and geometry
 * attributes (aSeed, set by the FX engine's allocator or the
 * environment builders).
 *
 * Fallbacks are authored, never truncated (Shader Bible §6): the
 * cheaper path drops octaves and layers, keeping color registers and
 * silhouette identical.
 */

/** Shared helpers inlined into fragment sources that need them. */
const HASH_NOISE_GLSL = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
`;

const POINT_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPointScale;
  attribute float aSeed;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec3 p = position;
    // Slow individual drift — every particle alive, none synchronized.
    p.x += sin(uTime * 0.05 + aSeed * 6.2831) * 0.6;
    p.y += cos(uTime * 0.04 + aSeed * 12.566) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Perspective-scaled, capped: a particle the camera passes through
    // must read as a passing mote, never a screen-filling bloom.
    gl_PointSize = min(uPointScale * (0.6 + 0.8 * fract(aSeed * 7.13)) * (220.0 / -mv.z), 22.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const starfieldFragment = (pulseLayers: number): string => /* glsl */ `
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    // Slow, non-repeating pulse per star (script 00:08 "every pulse feels alive").
    float pulse = 0.75 + 0.25 * sin(uTime * (0.3 + fract(vSeed * 3.7) * ${pulseLayers === 2 ? '0.5) + sin(uTime * 0.13 + vSeed * 40.0' : '0.5'}) + vSeed * 40.0);
    float alpha = core * core * pulse;
    vec3 tint = mix(vec3(0.78, 0.84, 1.0), vec3(1.0, 0.94, 0.86), fract(vSeed * 5.9));
    gl_FragColor = vec4(tint, alpha);
  }
`;

const STARFIELD_HERO: ShaderSources = {
  vertexShader: POINT_VERTEX,
  fragmentShader: starfieldFragment(2),
};

const STARFIELD_CHEAP: ShaderSources = {
  vertexShader: POINT_VERTEX,
  fragmentShader: starfieldFragment(1),
};

const dustFragment = /* glsl */ `
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float soft = smoothstep(0.5, 0.05, d);
    float breathe = 0.5 + 0.5 * sin(uTime * 0.11 + vSeed * 25.0);
    // Vast Dialect: cold register, sky remains the subject — dust is felt, not seen.
    gl_FragColor = vec4(vec3(0.45, 0.52, 0.66), soft * 0.05 * (0.6 + 0.4 * breathe));
  }
`;

const glyphFlowFragment = (octaves: number): string => /* glsl */ `
  uniform float uTime;
  uniform float uPresence;
  uniform float uAwareness;
  varying vec2 vUv;
  varying vec3 vNormal;
  ${HASH_NOISE_GLSL}
  // Living HEBRA glyphs: cell-quantized strokes that move *beneath*
  // the surface (script 01:18 "like thoughts moving under skin"),
  // reorganizing when presence rises (01:24 "they are responding").
  float glyphCell(vec2 uv, float t) {
    vec2 grid = uv * 14.0;
    vec2 cell = floor(grid);
    vec2 f = fract(grid);
    float seed = hash21(cell);
    // Each cell holds a stroke pattern that slowly rearranges.
    float phase = floor(t * (0.05 + seed * 0.08) + seed * 8.0);
    float which = hash21(cell + phase);
    float stroke = 0.0;
    if (which < 0.34) {
      stroke = smoothstep(0.12, 0.06, abs(f.y - 0.5)) * smoothstep(0.9, 0.7, abs(f.x - 0.5) * 2.0);
    } else if (which < 0.67) {
      stroke = smoothstep(0.12, 0.06, abs(f.x - 0.5)) * smoothstep(0.9, 0.7, abs(f.y - 0.5) * 2.0);
    } else {
      stroke = smoothstep(0.16, 0.08, abs(length(f - 0.5) - 0.3));
    }
    // Only a fraction of cells are lit at any moment — observant
    // visitors notice (script 00:36); it is never a wallpaper.
    float lit = step(0.82 - uAwareness * 0.12, hash21(cell + phase * 3.0));
    return stroke * lit;
  }
  void main() {
    float t = uTime + uPresence * 2.0;
    float g = glyphCell(vUv, t);
    ${octaves >= 2 ? 'g = max(g, glyphCell(vUv * 0.5 + 17.0, t * 0.7) * 0.6);' : ''}
    float depth = 0.55 + 0.45 * noise2(vUv * 3.0 + uTime * 0.02);
    vec3 glyphLight = vec3(0.62, 0.78, 0.92) * g * depth * (0.5 + uAwareness);
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
    vec3 base = vec3(0.016, 0.016, 0.028);
    gl_FragColor = vec4(base + glyphLight * 0.8 + rim * vec3(0.05, 0.07, 0.1), 1.0);
  }
`;

const GLYPH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const energyStreamFragment = /* glsl */ `
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float flicker = 0.7 + 0.3 * sin(uTime * (2.0 + fract(vSeed * 9.1) * 3.0) + vSeed * 50.0);
    // Active Dialect: Energy Light carrier — warm-cold split per seed.
    vec3 tint = mix(vec3(0.4, 0.75, 1.0), vec3(1.0, 0.85, 0.55), step(0.8, fract(vSeed * 3.3)));
    gl_FragColor = vec4(tint, core * core * 0.55 * flicker);
  }
`;

const originSurfaceFragment = (layers: number): string => /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vNormal;
  ${HASH_NOISE_GLSL}
  // Script 03:06: "millions of microscopic layers continuously
  // rearrange themselves… nothing repeats." Layered, phase-offset
  // cellular fields whose alignment increases as the visitor closes in.
  void main() {
    float t = uTime * 0.05;
    float field = 0.0;
    ${Array.from({ length: layers })
      .map(
        (_, index) => /* glsl */ `
    {
      vec2 uv = vUv * ${(36 + index * 26).toFixed(1)} + vec2(${(index * 13.7).toFixed(1)});
      vec2 cell = floor(uv + t * ${(index % 2 === 0 ? 1 : -1).toFixed(1)});
      float s = hash21(cell);
      float micro = step(0.6, fract(s * 9.0 + t * (0.5 + s)));
      field += micro * ${(0.5 / (index + 1)).toFixed(3)};
    }`,
      )
      .join('')}
    float rim = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.5);
    // Genesis Dialect: the most "true" light in the experience —
    // warm white, saturating as understanding approaches.
    float arrival = smoothstep(0.72, 0.87, uProgress);
    vec3 core = vec3(1.0, 0.96, 0.88) * (0.35 + field * 0.65) * (0.4 + arrival * 1.2);
    gl_FragColor = vec4(core + rim * vec3(1.0, 0.9, 0.7) * 0.5, 1.0);
  }
`;

const memoryDriftFragment = /* glsl */ `
  uniform float uTime;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float soft = smoothstep(0.5, 0.0, d);
    float drift = 0.5 + 0.5 * sin(uTime * 0.07 + vSeed * 20.0);
    // Recollective Dialect: soft, past-tense, desaturated.
    gl_FragColor = vec4(vec3(0.62, 0.6, 0.66), soft * soft * 0.12 * drift);
  }
`;

const gatewayLightFragment = (rays: number): string => /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  ${HASH_NOISE_GLSL}
  // Threshold: the gateway holds "pure white light. Not blinding.
  // Beautiful. Warm. Infinite." (script 00:45 / 02:00) — a soft disc
  // whose interior slowly breathes, opening with final progress.
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c) * 2.0;
    float open = smoothstep(0.93, 1.0, uProgress);
    float aperture = mix(0.25, 0.9, open);
    float disc = smoothstep(aperture, aperture - 0.35, d);
    float breathe = 0.9 + 0.1 * sin(uTime * 0.4);
    float texture_ = 1.0;
    ${rays >= 1 ? 'texture_ = 0.85 + 0.15 * noise2(vec2(atan(c.y, c.x) * 3.0, d * 4.0 - uTime * 0.1));' : ''}
    vec3 warm = vec3(1.0, 0.97, 0.9);
    gl_FragColor = vec4(warm, disc * breathe * texture_);
  }
`;

const UV_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function registerShaderLibrary(shaders: ShaderSystemHandle): void {
  shaders.register({
    id: 'starfield',
    category: 'particle-fx',
    purpose:
      'Script 00:08–00:16: distant pulsing stars, each alive on its own period — the Void chapter sky.',
    governingBibles: ['Shader Bible §4', 'FX Bible §3', 'Lighting Bible §8 (Vast)'],
    inputs: ['uTime', 'uPointScale', 'aSeed'],
    complexityTier: 'ambient',
    fallback: { essential: STARFIELD_CHEAP, balanced: STARFIELD_CHEAP },
    ownership: 'world/environment/regions — Starfield Reach, Rising Gate sky',
    sources: STARFIELD_HERO,
  });

  shaders.register({
    id: 'cosmic-dust',
    category: 'volumetric-atmospheric',
    purpose:
      'Script 00:16: "Dust. Gas. Invisible particles. Soft volumetric fog" — felt more than seen.',
    governingBibles: ['Shader Bible §4', 'Lighting Bible §6 (Atmosphere)', 'FX Bible §3'],
    inputs: ['uTime', 'uPointScale', 'aSeed'],
    complexityTier: 'ambient',
    fallback: {},
    ownership: 'world/environment/regions — Cosmic Dust Field',
    sources: { vertexShader: POINT_VERTEX, fragmentShader: dustFragment },
  });

  shaders.register({
    id: 'glyph-flow',
    category: 'material',
    purpose:
      'Script 01:18–01:24: living HEBRA glyphs moving beneath monument surfaces, reorganizing under presence.',
    governingBibles: ['Shader Bible §4', 'Material Bible §5 (Tiny Symbols)', 'Camera Bible §12'],
    inputs: ['uTime', 'uPresence', 'uAwareness', 'uv', 'normal'],
    complexityTier: 'hero',
    fallback: {
      essential: { vertexShader: GLYPH_VERTEX, fragmentShader: glyphFlowFragment(1) },
    },
    ownership: 'world/environment/regions — Monument Range, Sentinel Ring',
    sources: { vertexShader: GLYPH_VERTEX, fragmentShader: glyphFlowFragment(2) },
  });

  shaders.register({
    id: 'energy-stream',
    category: 'particle-fx',
    purpose:
      'Script 02:22: "Soft particles travel between every structure. Like information." — the connective stream toward the Origin.',
    governingBibles: ['Shader Bible §4', 'FX Bible §3', 'Lighting Bible §8 (Active)'],
    inputs: ['uTime', 'uPointScale', 'aSeed'],
    complexityTier: 'standard',
    fallback: {},
    ownership: 'world/environment/regions — Energy Stream',
    sources: { vertexShader: POINT_VERTEX, fragmentShader: energyStreamFragment },
  });

  shaders.register({
    id: 'origin-surface',
    category: 'material',
    purpose:
      "Script 02:56–03:06: The Origin's surface — microscopic unique symbols, layers continuously rearranging, saturating on approach.",
    governingBibles: ['Shader Bible §4', 'Lighting Bible §8 (Genesis)', 'Material Bible §3'],
    inputs: ['uTime', 'uProgress', 'uv', 'normal'],
    complexityTier: 'hero',
    fallback: {
      essential: { vertexShader: GLYPH_VERTEX, fragmentShader: originSurfaceFragment(2) },
      balanced: { vertexShader: GLYPH_VERTEX, fragmentShader: originSurfaceFragment(3) },
    },
    ownership: 'world/environment/regions — Origin Core',
    sources: { vertexShader: GLYPH_VERTEX, fragmentShader: originSurfaceFragment(4) },
  });

  shaders.register({
    id: 'memory-drift',
    category: 'volumetric-atmospheric',
    purpose:
      'Script 03:24: unfinished creations drifting in white infinity — the Recollective veil of the Distant Heart.',
    governingBibles: ['Shader Bible §4', 'Lighting Bible §8 (Recollective)', 'FX Bible §3'],
    inputs: ['uTime', 'uPointScale', 'aSeed'],
    complexityTier: 'ambient',
    fallback: {},
    ownership: 'world/environment/regions — Distant Heart',
    sources: { vertexShader: POINT_VERTEX, fragmentShader: memoryDriftFragment },
  });

  shaders.register({
    id: 'gateway-light',
    category: 'lighting',
    purpose:
      "Script 00:45/02:00/04:00: the warm white aperture — the gateway's interior light, opening with the visitor's final progress.",
    governingBibles: ['Shader Bible §4', 'Lighting Bible §8 (Genesis→Vast blend)'],
    inputs: ['uTime', 'uProgress', 'uv'],
    complexityTier: 'standard',
    fallback: {
      essential: { vertexShader: UV_VERTEX, fragmentShader: gatewayLightFragment(0) },
    },
    ownership: 'world/environment/regions — Rising Gate',
    sources: { vertexShader: UV_VERTEX, fragmentShader: gatewayLightFragment(1) },
  });
}
