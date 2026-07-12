/**
 * The HEBRA material library — one responsibility: premium, reusable
 * surfaces that belong to a single civilization.
 *
 * Factories return *shared* instances (one material per kind, reused
 * across every mesh that wears it — Creative Bible: Performance).
 * Living behaviour is injected through onBeforeCompile so materials
 * keep three.js's full lighting model while gaining energy veins,
 * pulse and breath.
 */

import * as THREE from 'three';
import { SIMPLEX_3D } from '@/shaders/noise';
import { PALETTE } from '@/config/constants';
import { registerClock } from './registry';

/** Inject a uTime clock + world-position varying into a standard material. */
function makeLiving(
  material: THREE.Material,
  fragmentInjection: string,
): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    registerClock(shader.uniforms.uTime as { value: number });

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>\n varying vec3 vWorldPos;`,
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>\n vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n uniform float uTime;\n varying vec3 vWorldPos;\n ${SIMPLEX_3D}`,
      )
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n ${fragmentInjection}`);
  };
}

/* ------------------------------------------------------------------ */
/* Energy veins: cold light travelling under dark stone.               */
/* The veins are noise isolines — they wander the surface like slow    */
/* rivers of memory, brightening in waves that never quite repeat.     */
/* ------------------------------------------------------------------ */
const VEIN_FRAGMENT = /* glsl */ `
  {
    float n = snoise(vWorldPos * 0.045 + vec3(0.0, uTime * 0.008, 0.0));
    float vein = 1.0 - smoothstep(0.0, 0.035, abs(n));
    float pulse = 0.55 + 0.45 * sin(uTime * 0.35 + vWorldPos.z * 0.06 + n * 6.0);
    totalEmissiveRadiance += vec3(0.30, 0.42, 0.95) * vein * pulse * 0.9;
  }
`;

/* Slow breath for crystal: brightness that swells from within. */
const CRYSTAL_FRAGMENT = /* glsl */ `
  {
    float grain = snoise(vWorldPos * 0.6 + vec3(uTime * 0.03));
    float breath = 0.5 + 0.5 * sin(uTime * 0.22 + vWorldPos.x * 0.4 + grain * 2.0);
    totalEmissiveRadiance += vec3(0.42, 0.52, 0.98) * (0.10 + 0.16 * breath) * (0.6 + 0.4 * grain);
  }
`;

/* Liquid metal: reflections that seem to drift across the surface. */
const FLOW_FRAGMENT = /* glsl */ `
  {
    float flow = snoise(vWorldPos * 0.12 + vec3(uTime * 0.02, uTime * 0.013, 0.0));
    totalEmissiveRadiance += vec3(0.55, 0.62, 0.75) * smoothstep(0.55, 0.95, flow) * 0.08;
  }
`;

/* ------------------------------------------------------------------ */

let obsidian: THREE.MeshPhysicalMaterial | null = null;
/** Dark volcanic glass carrying rivers of cold light. */
export function getVeinedObsidian(): THREE.MeshPhysicalMaterial {
  if (!obsidian) {
    obsidian = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0b0b10'),
      metalness: 0.35,
      roughness: 0.42,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.7,
    });
    makeLiving(obsidian, VEIN_FRAGMENT);
  }
  return obsidian;
}

let stone: THREE.MeshStandardMaterial | null = null;
/** Ancient dark stone — matte, heavy, silent. For massive silhouettes. */
export function getDarkStone(): THREE.MeshStandardMaterial {
  if (!stone) {
    stone = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#111116'),
      metalness: 0.12,
      roughness: 0.85,
      envMapIntensity: 0.35,
    });
  }
  return stone;
}

let liquidMetal: THREE.MeshPhysicalMaterial | null = null;
/** Metal that behaves almost organically — mirror-deep, slowly flowing. */
export function getLiquidMetal(): THREE.MeshPhysicalMaterial {
  if (!liquidMetal) {
    liquidMetal = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2a2d38'),
      metalness: 1.0,
      roughness: 0.18,
      envMapIntensity: 1.4,
    });
    makeLiving(liquidMetal, FLOW_FRAGMENT);
  }
  return liquidMetal;
}

let crystal: THREE.MeshPhysicalMaterial | null = null;
/** Living crystal — translucent presence that breathes from within. */
export function getLivingCrystal(): THREE.MeshPhysicalMaterial {
  if (!crystal) {
    crystal = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#12141f'),
      metalness: 0.0,
      roughness: 0.12,
      transparent: true,
      opacity: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.1,
      side: THREE.DoubleSide,
    });
    makeLiving(crystal, CRYSTAL_FRAGMENT);
  }
  return crystal;
}

/** The palette as three.js colors, shared. */
export const WORLD_COLORS = {
  void: new THREE.Color(PALETTE.void),
  white: new THREE.Color(PALETTE.white),
  coldBlue: new THREE.Color(PALETTE.coldBlue),
  gold: new THREE.Color(PALETTE.gold),
} as const;
