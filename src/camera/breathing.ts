import { sampleOscillators, type OscillatorSpec } from '@lib/motion';

/**
 * The camera breathing system — Camera Bible §9 and §23.
 *
 * Two or more incommensurate low-frequency oscillations summed into
 * position and rotation at all times (except Transitioning, and
 * disabled entirely under Reduced Motion per §16 — even subtle
 * oscillation is out of scope once continuous motion is opted out of).
 * Amplitudes are deliberately sub-perceptual: breathing is felt as
 * aliveness, never seen as movement.
 */

export interface BreathingSample {
  readonly positionX: number;
  readonly positionY: number;
  readonly positionZ: number;
  readonly roll: number;
}

/**
 * Period ratios are irrational in practice (7.3/11.9/5.13 share no
 * small common multiple), so the combined cycle never visibly repeats
 * within a visit. Amplitudes are provisional pending Checkpoint B
 * review — small enough to be felt, never large enough to read as one
 * of the named Camera Language moves (Camera Bible §23's boundary).
 */
const POSITION_X: readonly OscillatorSpec[] = [
  { periodSeconds: 7.3, amplitude: 0.014, phase: 0 },
  { periodSeconds: 11.9, amplitude: 0.009, phase: 1.7 },
];

const POSITION_Y: readonly OscillatorSpec[] = [
  { periodSeconds: 5.13, amplitude: 0.011, phase: 0.9 },
  { periodSeconds: 9.71, amplitude: 0.007, phase: 2.4 },
];

const POSITION_Z: readonly OscillatorSpec[] = [
  { periodSeconds: 13.7, amplitude: 0.006, phase: 3.1 },
];

/** Roll micro-variance per Camera Bible §23 — never consciously noticeable. */
const ROLL: readonly OscillatorSpec[] = [
  { periodSeconds: 17.3, amplitude: 0.0011, phase: 0.4 },
  { periodSeconds: 23.9, amplitude: 0.0007, phase: 2.9 },
];

export function sampleBreathing(timeSeconds: number, intensity = 1): BreathingSample {
  return {
    positionX: sampleOscillators(POSITION_X, timeSeconds) * intensity,
    positionY: sampleOscillators(POSITION_Y, timeSeconds) * intensity,
    positionZ: sampleOscillators(POSITION_Z, timeSeconds) * intensity,
    roll: sampleOscillators(ROLL, timeSeconds) * intensity,
  };
}
