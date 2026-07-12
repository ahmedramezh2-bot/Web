/**
 * Sky — the infinite living ceiling of the dimension.
 *
 * An inverted sphere whose fragment shader paints direction-based
 * nebulae: two slow FBM cloud systems (indigo body, violet drift) and
 * a cold horizon glow toward the journey's destination. Everything
 * moves at near-geologic speed — the visitor should only notice after
 * living with it (Creative Bible: Background).
 *
 * One draw call. No textures.
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { SIMPLEX_3D, FBM_3D } from '@/shaders/noise';
import { registerClock } from '@/materials/registry';

const VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vDir;
  ${SIMPLEX_3D}
  ${FBM_3D}
  void main() {
    vec3 d = normalize(vDir);
    float t = uTime * 0.006;

    // Two nebular bodies drifting against each other.
    float n1 = fbm(d * 2.1 + vec3(t, 0.0, -t * 0.7));
    float n2 = fbm(d * 3.6 + vec3(-t * 1.3, t * 0.5, 4.7));
    float cloud1 = smoothstep(-0.05, 0.9, n1);
    float cloud2 = smoothstep(0.25, 0.95, n2);

    vec3 col = vec3(0.020, 0.022, 0.032);                    // the void, never pure black
    col += vec3(0.110, 0.130, 0.280) * cloud1;               // indigo body
    col += vec3(0.150, 0.095, 0.260) * cloud2 * 0.8;         // violet drift
    col += vec3(0.070, 0.150, 0.240) * cloud1 * cloud2;      // cold interference

    // The destination glow: a faint promise far down -Z.
    float toward = smoothstep(0.72, 1.0, dot(d, vec3(0.0, 0.02, -1.0)));
    col += vec3(0.16, 0.20, 0.34) * toward * (0.5 + 0.5 * cloud1);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: VERT,
        fragmentShader: FRAG,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => registerClock(material.uniforms.uTime as { value: number }),
    [material],
  );

  return (
    <mesh material={material} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[500, 48, 32]} />
    </mesh>
  );
}
