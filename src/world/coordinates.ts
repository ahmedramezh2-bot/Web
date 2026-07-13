import { Vector3 } from 'three';

/**
 * The Coordinate Framework — the world's spatial conventions, stated
 * once so every future system builds against the same frame.
 *
 * Conventions (three.js-native, per its official coordinate system):
 * - Right-handed, Y-up. +Y is the world's one unbroken "up" (Camera
 *   Bible §25's orientation safety depends on this never varying).
 * - The visitor's default journey heading is -Z ("forward" in
 *   three.js camera convention).
 * - One world unit ≈ one meter at Human Scale (World Blueprint §6);
 *   Architectural/Monumental/Cosmic scales are authored size, never a
 *   change of unit.
 * - The world origin (0,0,0) is reserved for The Origin Core's anchor
 *   (docs/bible/26 §3) — the narrative center is the literal
 *   coordinate center, so world-space distance from origin is
 *   narratively meaningful for free.
 *
 * Regions carry a local frame (an offset), so content is authored
 * region-locally and placed by the region — moving a region never
 * edits its contents.
 */

export const WORLD_UP: Readonly<Vector3> = new Vector3(0, 1, 0);
export const WORLD_FORWARD: Readonly<Vector3> = new Vector3(0, 0, -1);

export interface RegionFrame {
  /** World-space position of the region's local origin. */
  readonly offset: Vector3;
}

export function createRegionFrame(offset = new Vector3()): RegionFrame {
  return { offset: offset.clone() };
}

export function regionToWorld(frame: RegionFrame, local: Vector3, into: Vector3): Vector3 {
  return into.copy(local).add(frame.offset);
}

export function worldToRegion(frame: RegionFrame, world: Vector3, into: Vector3): Vector3 {
  return into.copy(world).sub(frame.offset);
}
