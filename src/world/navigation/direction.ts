import type { Vector3 } from 'three';

/**
 * The travel direction system — turns a path tangent plus signed
 * progress velocity into a legible description of *how* the visitor
 * is currently moving through space. Downstream consumers (chapter
 * dialects, audio mixing per Audio Production Bible §8, the eventual
 * dev HUD) read this instead of re-deriving axis math individually.
 */

export type TravelHeading = 'forward' | 'backward' | 'still';
export type DominantAxis = 'lateral' | 'vertical' | 'depth';

export interface TravelFrame {
  readonly heading: TravelHeading;
  /** Which world axis dominates the current tangent — lateral (x), vertical (y), or depth (z). */
  readonly dominantAxis: DominantAxis;
  /** Normalized |tangent| components, for consumers needing more than the dominant label. */
  readonly axisWeights: { readonly x: number; readonly y: number; readonly z: number };
}

/** Velocity magnitude below this reads as stillness, not travel. */
const STILL_THRESHOLD = 1e-4;

export function computeTravelFrame(tangent: Vector3, progressVelocity: number): TravelFrame {
  const ax = Math.abs(tangent.x);
  const ay = Math.abs(tangent.y);
  const az = Math.abs(tangent.z);
  const sum = ax + ay + az || 1;

  let dominantAxis: DominantAxis = 'depth';
  if (ay >= ax && ay >= az) {
    dominantAxis = 'vertical';
  } else if (ax >= ay && ax >= az) {
    dominantAxis = 'lateral';
  }

  const heading: TravelHeading =
    Math.abs(progressVelocity) < STILL_THRESHOLD
      ? 'still'
      : progressVelocity > 0
        ? 'forward'
        : 'backward';

  return {
    heading,
    dominantAxis,
    axisWeights: { x: ax / sum, y: ay / sum, z: az / sum },
  };
}
