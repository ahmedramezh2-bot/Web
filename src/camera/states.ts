import { createLogger } from '@lib/logger';

/**
 * The camera state machine — Camera Bible §6, implemented literally.
 *
 * Exactly seven states exist. No other states exist: "any new camera
 * behavior must be describable as a transition between two states on
 * this list, or the state list itself needs revision through the
 * Camera Bible — it cannot be patched around silently in
 * implementation." This module is that rule, enforced in types.
 */

const logger = createLogger('CameraStates');

export type CameraState =
  'dormant' | 'awakening' | 'traveling' | 'observing' | 'transitioning' | 'yielding' | 'resting';

/**
 * Valid transitions per Camera Bible §6's state descriptions. The
 * dormant→awakening edge is the one logged near-hard entry (§14's
 * single exception); every other edge is expected to be eased by the
 * transition framework, never snapped.
 */
const VALID_TRANSITIONS: Readonly<Record<CameraState, readonly CameraState[]>> = {
  dormant: ['awakening'],
  awakening: ['traveling'],
  traveling: ['observing', 'transitioning', 'yielding', 'resting'],
  observing: ['traveling', 'transitioning', 'resting'],
  transitioning: ['traveling', 'observing', 'resting'],
  yielding: ['traveling', 'transitioning'],
  resting: [],
};

export class CameraStateMachine {
  private current: CameraState = 'dormant';
  private readonly listeners = new Set<(state: CameraState) => void>();

  public get state(): CameraState {
    return this.current;
  }

  public subscribe(listener: (state: CameraState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Attempt a state transition. An invalid transition is a bug in the
   * caller, never something to patch around: it is refused and logged
   * as an error rather than thrown, because throwing inside a frame
   * loop would trade one bug for a crash (Camera Bible §25's recovery
   * philosophy — degrade toward stillness, never toward improvisation).
   */
  public transition(to: CameraState): boolean {
    if (to === this.current) {
      return true;
    }
    if (!VALID_TRANSITIONS[this.current].includes(to)) {
      logger.error('invalid camera state transition refused', { from: this.current, to });
      return false;
    }
    this.current = to;
    for (const listener of this.listeners) {
      listener(to);
    }
    return true;
  }
}

/** Presence response is suppressed entirely during Transitioning (Camera Bible §5, §22). */
export function presenceAllowedIn(state: CameraState): boolean {
  return state !== 'transitioning' && state !== 'dormant';
}

/** Breathing runs in every state except Transitioning (Camera Bible §9). */
export function breathingAllowedIn(state: CameraState): boolean {
  return state !== 'transitioning';
}
