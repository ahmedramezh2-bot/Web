import { createLogger } from '@lib/logger';
import { useNavigationStore, type NavigationMode } from '@state/navigationStore';

/**
 * The navigation state machine — the *input-intent* machine, distinct
 * from the camera's own state machine by design: navigation tracks
 * what the visitor is doing; the camera tracks how the film responds.
 *
 * Yielding detection implements the Skip/Return reading (Camera Bible
 * §6, Technical Addendum §4): sustained, deliberate input reads as
 * "let me through" and compresses pace — diegetic, never a UI escape
 * hatch. There is no visible skip control anywhere in this system.
 */

const logger = createLogger('NavigationMachine');

const VALID_TRANSITIONS: Readonly<Record<NavigationMode, readonly NavigationMode[]>> = {
  dormant: ['pacing'],
  pacing: ['yielding', 'resting'],
  yielding: ['pacing', 'resting'],
  resting: [],
};

/** Sustained |velocity| above this (progress-units/s) begins reading as deliberate intent. Provisional pending feel review. */
const YIELD_ENTER_VELOCITY = 0.12;
/** Intent must be sustained this long before Yielding engages — a single hard flick is enthusiasm, not a declaration. */
const YIELD_ENTER_SECONDS = 0.35;
/** Below this velocity for the exit dwell, Yielding releases back to pacing. */
const YIELD_EXIT_VELOCITY = 0.035;
const YIELD_EXIT_SECONDS = 0.55;

/** Progress at/beyond this is journey's end — Resting (Camera Bible §6). */
const RESTING_PROGRESS = 0.999;

export class NavigationMachine {
  private mode: NavigationMode = 'dormant';
  private enterTimer = 0;
  private exitTimer = 0;

  public get current(): NavigationMode {
    return this.mode;
  }

  public update(deltaSeconds: number, progress: number, velocity: number): void {
    const store = useNavigationStore.getState();

    if (this.mode === 'dormant' && store.hasInput) {
      this.transition('pacing');
    }

    if (this.mode === 'pacing' || this.mode === 'yielding') {
      this.updateYielding(deltaSeconds, Math.abs(velocity));

      if (progress >= RESTING_PROGRESS && Math.abs(velocity) < YIELD_EXIT_VELOCITY) {
        this.transition('resting');
      }
    }
  }

  private updateYielding(deltaSeconds: number, speed: number): void {
    if (this.mode === 'pacing') {
      if (speed >= YIELD_ENTER_VELOCITY) {
        this.enterTimer += deltaSeconds;
        if (this.enterTimer >= YIELD_ENTER_SECONDS) {
          this.transition('yielding');
          this.exitTimer = 0;
        }
      } else {
        this.enterTimer = 0;
      }
      return;
    }

    if (this.mode === 'yielding') {
      if (speed <= YIELD_EXIT_VELOCITY) {
        this.exitTimer += deltaSeconds;
        if (this.exitTimer >= YIELD_EXIT_SECONDS) {
          this.transition('pacing');
          this.enterTimer = 0;
        }
      } else {
        this.exitTimer = 0;
      }
    }
  }

  private transition(to: NavigationMode): void {
    if (to === this.mode) {
      return;
    }
    if (!VALID_TRANSITIONS[this.mode].includes(to)) {
      logger.error('invalid navigation transition refused', { from: this.mode, to });
      return;
    }
    this.mode = to;
    useNavigationStore.getState().setMode(to);
  }
}
