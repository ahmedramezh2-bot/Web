/**
 * DistantHeart — the destination.
 *
 * Far down the corridor: a soft white source that every structure
 * quietly faces. It is a promise, not a spectacle — a slow-breathing
 * radial glow (one billboard draw call) plus the world's key light.
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { registerClock } from '@/materials/registry';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // billboard: strip rotation from the modelView basis
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mv.xy += (uv - 0.5) * vec2(90.0, 90.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    float breath = 0.92 + 0.08 * sin(uTime * 0.16);
    float core = exp(-d * d * 240.0) * 1.4;
    float halo = exp(-d * 5.2) * 0.5;
    vec3 col = vec3(0.95, 0.96, 1.0) * core + vec3(0.45, 0.55, 0.9) * halo;
    gl_FragColor = vec4(col * breath, (core + halo) * breath);
  }
`;

export function DistantHeart() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(
    () => registerClock(material.uniforms.uTime as { value: number }),
    [material],
  );

  return (
    <group position={[0, 4, -320]}>
      <mesh material={material} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      {/* the world's key light: shines from the heart back up the
          corridor (default target = origin, exactly the journey) */}
      <directionalLight intensity={0.55} color="#cdd5ec" />
    </group>
  );
}
