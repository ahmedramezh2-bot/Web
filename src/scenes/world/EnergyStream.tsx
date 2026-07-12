/**
 * EnergyStream — living information travelling between structures.
 *
 * Each stream is one Points draw call. The curve is baked to 32
 * uniform samples; every particle carries only a phase attribute and
 * the vertex shader interpolates its position along the path each
 * frame — zero CPU work per frame, zero attribute uploads.
 */

import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { getQuality } from '@/systems/performance/QualitySystem';
import { registerClock } from '@/materials/registry';

const SAMPLES = 32;

const VERT = /* glsl */ `
  attribute float aPhase;
  attribute float aSeed;
  uniform vec3 uPath[${SAMPLES}];
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPixelRatio;
  varying float vHead;
  void main() {
    float t = fract(aPhase + uTime * uSpeed);
    float f = t * float(${SAMPLES} - 1);
    int i = int(floor(f));
    vec3 p = mix(uPath[i], uPath[i + 1], fract(f));
    // slight personal wander so the stream never reads as a wire
    p.x += sin(uTime * 0.6 + aSeed * 9.0) * 0.35;
    p.y += cos(uTime * 0.5 + aSeed * 7.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vHead = smoothstep(0.0, 0.15, t) * smoothstep(1.0, 0.85, t);
    gl_PointSize = (1.4 + fract(aSeed) * 1.2) * uPixelRatio * (90.0 / max(1.0, -mv.z));
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vHead;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(uColor * core * 1.4, core * vHead * 0.85);
  }
`;

interface EnergyStreamProps {
  /** Control points; the stream flows through them in order. */
  points: [number, number, number][];
  color?: string;
  /** Journeys per second along the whole curve. */
  speed?: number;
  density?: number;
}

export function EnergyStream({
  points,
  color = '#6f8bdf',
  speed = 0.02,
  density = 1,
}: EnergyStreamProps) {
  const quality = getQuality();
  const count = Math.max(40, Math.floor(quality.particleBudget * 0.08 * density));

  const { geometry, material } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    const path = curve.getPoints(SAMPLES - 1);

    const positions = new Float32Array(count * 3); // unused by shader, required by three
    const phases = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      phases[i] = Math.random();
      seeds[i] = Math.random() * 10;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    // The GPU owns positions; keep the whole corridor visible.
    geo.boundingSphere = new THREE.Sphere(
      curve.getPoint(0.5),
      curve.getLength() * 0.75,
    );

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uPath: { value: path },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uColor: { value: new THREE.Color(color) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, quality.dprMax) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [points, color, speed, count, quality.dprMax]);

  useEffect(
    () => registerClock(material.uniforms.uTime as { value: number }),
    [material],
  );

  return <points geometry={geometry} material={material} />;
}
