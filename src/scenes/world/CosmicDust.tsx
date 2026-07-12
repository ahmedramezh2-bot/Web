/**
 * CosmicDust — the air of the dimension.
 *
 * Near-field motes drifting through the camera's space along the whole
 * path, each on its own slow orbit. They give the void body: parallax,
 * depth, and the sense that the dark itself has texture.
 *
 * One draw call; positions animated entirely in the vertex shader.
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { getQuality } from '@/systems/performance/QualitySystem';
import { registerClock } from '@/materials/registry';

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vFade;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.05 + aSeed * 3.1) * 2.2;
    p.y += cos(uTime * 0.04 + aSeed * 1.7) * 1.6;
    p.z += sin(uTime * 0.03 + aSeed * 2.3) * 2.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vFade = 0.35 + 0.65 * fract(aSeed * 7.13);
    gl_PointSize = (1.2 + fract(aSeed * 3.7) * 1.8) * uPixelRatio * (46.0 / max(1.0, -mv.z));
  }
`;

const FRAG = /* glsl */ `
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vec3(0.75, 0.78, 0.88), core * vFade * 0.22);
  }
`;

export function CosmicDust() {
  const quality = getQuality();
  const count = Math.floor(quality.particleBudget * 0.35);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // A loose tube of dust hugging the journey corridor.
      positions[i * 3 + 0] = (Math.random() * 2 - 1) * 30;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 18;
      positions[i * 3 + 2] = 40 - Math.random() * 320;
      seeds[i] = Math.random() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, quality.dprMax) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [count, quality.dprMax]);

  useEffect(
    () => registerClock(material.uniforms.uTime as { value: number }),
    [material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
