/**
 * Monuments — the visible remains of an invisible civilization.
 *
 * Six landmarks, each a unique silhouette, no two alike, none
 * symmetric with its neighbours (Creative Bible: Architecture —
 * "every landmark should feel unique"). They wear the shared veined
 * obsidian and dark stone, so the whole range costs two materials.
 *
 * Placement follows the journey corridor: each monument is staged to
 * be discovered from the path, not displayed at it.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { getVeinedObsidian, getDarkStone } from '@/materials';

interface Slab {
  /** position */
  p: [number, number, number];
  /** scale */
  s: [number, number, number];
  /** rotation (y, z) — tilt gives age */
  r?: [number, number];
  stone?: boolean;
}

interface MonumentDef {
  at: [number, number, number];
  yaw: number;
  slabs: Slab[];
}

/**
 * Each monument is composed from a handful of tilted volumes —
 * enough asymmetry to read as intention, few enough to read as one
 * gesture. Heights run 18–46 units: the camera corridor sits near
 * y≈0..4, so everything towers.
 */
const MONUMENTS: MonumentDef[] = [
  // The Witness Stones — a leaning pair, almost touching.
  {
    at: [-40, -8, -66],
    yaw: 0.5,
    slabs: [
      { p: [0, 14, 0], s: [4.5, 34, 6], r: [0.1, 0.06] },
      { p: [7.5, 11, 1], s: [3.4, 26, 4.6], r: [-0.2, -0.085], stone: true },
    ],
  },
  // The Archive — stepped mass, half sunken.
  {
    at: [42, -9, -78],
    yaw: -0.7,
    slabs: [
      { p: [0, 8, 0], s: [16, 18, 12], stone: true },
      { p: [-2, 20, 1], s: [10, 12, 8] },
      { p: [1, 28, -1], s: [5.5, 9, 4.5], r: [0.35, 0] },
    ],
  },
  // The Needle — one impossibly thin blade.
  {
    at: [-52, -4, -118],
    yaw: 0.2,
    slabs: [{ p: [0, 23, 0], s: [2.2, 46, 3.2], r: [0, 0.045] }],
  },
  // The Gate — two pylons and a floating lintel that never landed.
  {
    at: [38, -7, -152],
    yaw: 0.9,
    slabs: [
      { p: [-7, 12, 0], s: [4, 26, 5], stone: true },
      { p: [7, 13, 0.5], s: [4, 28, 5], stone: true },
      { p: [0, 30, 0], s: [22, 3.2, 6], r: [0, -0.03] },
    ],
  },
  // The Choir — a raked row of five unequal slabs.
  {
    at: [-40, -8, -196],
    yaw: -0.35,
    slabs: [
      { p: [-10, 9, 0], s: [2.6, 20, 3], r: [0, 0.05] },
      { p: [-5, 12, 1.2], s: [2.6, 25, 3], r: [0, 0.02], stone: true },
      { p: [0, 15, 0], s: [2.6, 31, 3] },
      { p: [5, 11, -0.8], s: [2.6, 23, 3], r: [0, -0.04], stone: true },
      { p: [10, 8, 0.4], s: [2.6, 17, 3], r: [0, -0.07] },
    ],
  },
  // The Throne — a distant seated mass, mostly silhouette.
  {
    at: [55, -10, -228],
    yaw: -1.1,
    slabs: [
      { p: [0, 10, 0], s: [18, 22, 10], stone: true },
      { p: [0, 30, -3], s: [14, 20, 4] },
    ],
  },
];

export function Monuments() {
  const box = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const obsidian = getVeinedObsidian();
  const stone = getDarkStone();

  return (
    <group>
      {MONUMENTS.map((m, i) => (
        <group key={i} position={m.at} rotation-y={m.yaw}>
          {m.slabs.map((slab, j) => (
            <mesh
              key={j}
              geometry={box}
              material={slab.stone ? stone : obsidian}
              position={slab.p}
              scale={slab.s}
              rotation-y={slab.r?.[0] ?? 0}
              rotation-z={slab.r?.[1] ?? 0}
            />
          ))}
        </group>
      ))}
    </group>
  );
}
