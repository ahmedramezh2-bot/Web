import { clamp01, damp } from '@lib/motion';
import { useNavigationStore } from '@state/navigationStore';

/**
 * The world progress system — Camera Bible §10 made concrete.
 *
 * One scalar: narrative progress, 0 to 1, across the journey. The
 * scroll layer sets a *target*; this system damps actual progress
 * toward it and publishes progress + signed velocity. Damping here is
 * what gives travel its physical weight — progress never snaps to the
 * input, it is carried toward it.
 */

/** Damping rate for progress-follow. Provisional pending Checkpoint B feel review. */
const PROGRESS_DAMP_LAMBDA = 2.6;

/** Yielding-state acceleration multiplier — Camera Hierarchy level 2: declared intent compresses pace, never path (Camera Bible §5, §9). Provisional. */
const YIELDING_LAMBDA_MULTIPLIER = 2.2;

export class WorldProgress {
  private current = 0;
  private target = 0;
  private lastVelocity = 0;

  public setTarget(target: number): void {
    this.target = clamp01(target);
  }

  public get value(): number {
    return this.current;
  }

  public get velocity(): number {
    return this.lastVelocity;
  }

  public update(deltaSeconds: number, yielding: boolean): void {
    if (deltaSeconds <= 0) {
      return;
    }
    const lambda = yielding
      ? PROGRESS_DAMP_LAMBDA * YIELDING_LAMBDA_MULTIPLIER
      : PROGRESS_DAMP_LAMBDA;

    const previous = this.current;
    this.current = clamp01(damp(this.current, this.target, lambda, deltaSeconds));
    this.lastVelocity = (this.current - previous) / deltaSeconds;

    useNavigationStore.getState().setProgress(this.current, this.lastVelocity);
  }
}
