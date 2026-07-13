import { clamp01, ease } from '@lib/motion';

import { copyPose, createPose, interpolatePose, type CameraPose } from './pose';

/**
 * The camera transition framework — Camera Bible §24.
 *
 * Transitions are the camera's punctuation: a comma (environment), a
 * period (chapter/service), or a paragraph break (world/portal/ending).
 * Every transition has its own internal micro-shape — a slow gather, a
 * committed core motion, a settling arrival — never uniform speed start
 * to end. Presence response is suppressed for the transition's whole
 * duration (§5, §22); the state machine handles that by being in
 * `transitioning` while one runs.
 *
 * This is the reusable framework only. Which transition plays where is
 * authored choreography and belongs to the cinematic milestones.
 */

export type TransitionWeight =
  'environment' | 'chapter' | 'service' | 'world' | 'portal' | 'ending';

/**
 * Baseline durations per weight class, seconds — punctuation weights
 * per §24: a comma is barely felt, a paragraph break is unmistakable.
 * Provisional pending Checkpoint B review against authored content.
 */
const BASE_DURATION_SECONDS: Readonly<Record<TransitionWeight, number>> = {
  environment: 1.4,
  service: 1.8,
  chapter: 2.6,
  world: 4.2,
  portal: 3.6,
  ending: 6.5,
};

export interface ActiveTransition {
  readonly weight: TransitionWeight;
  readonly durationSeconds: number;
  readonly from: CameraPose;
  readonly to: CameraPose;
  elapsedSeconds: number;
}

export class TransitionController {
  private active: ActiveTransition | undefined;

  public get isRunning(): boolean {
    return this.active !== undefined;
  }

  /**
   * Begin a transition between two poses. Duration derives from the
   * weight class unless explicitly overridden by authored choreography
   * (which always wins, per Camera Hierarchy level 1).
   */
  public begin(
    weight: TransitionWeight,
    from: CameraPose,
    to: CameraPose,
    durationSeconds?: number,
  ): void {
    this.active = {
      weight,
      durationSeconds: durationSeconds ?? BASE_DURATION_SECONDS[weight],
      from: copyPose(from, createPose()),
      to: copyPose(to, createPose()),
      elapsedSeconds: 0,
    };
  }

  /**
   * Advance the running transition and write the current pose into
   * `into`. Returns true while running, false once complete (the final
   * frame writes the exact destination pose — no residual error).
   */
  public update(deltaSeconds: number, into: CameraPose): boolean {
    if (!this.active) {
      return false;
    }

    this.active.elapsedSeconds += deltaSeconds;
    const progress = clamp01(this.active.elapsedSeconds / this.active.durationSeconds);

    interpolatePose(this.active.from, this.active.to, progress, into, ease.transitionShape);

    if (progress >= 1) {
      this.active = undefined;
      return false;
    }
    return true;
  }

  /** Abandon the running transition (recovery path only — §25's soft hold). */
  public cancel(): void {
    this.active = undefined;
  }
}
