/**
 * Starfield — thousands of distant witnesses.
 *
 * A single Points draw call. Stars live on a hollow shell around the
 * whole journey path, sized by a cubed random (many faint, few bright),
 * each twinkling on its own phase so no rhythm ever emerges.
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { getQuality } from '@/systems/performance/QualitySystem';
import { registerClock } from '@/materials/registry';

const VERT = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.5 + 0.5 * sin(uTime * (0.3 + fract(aSeed) * 1.1) + aSeed);
    gl_PointSize = aSize * uPixelRatio * (240.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.06, d);
    gl_FragColor = vec4(vec3(0.92, 0.93, 0.97) * core, core * (0.35 + 0.65 * vTwinkle));
  }
`;

export function Starfield() {
  const quality = getQuality();
  const count = Math.floor(quality.particleBudget * 0.9);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Shell around the journey: the path runs roughly z ∈ [30, -260].
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 140 + Math.random() * 260;
      const along = Math.random(); // spread along the journey axis
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 120 * along + 40;
      seeds[i] = Math.random() * 100;
      sizes[i] = 0.5 + Math.pow(Math.random(), 3.2) * 2.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

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
