import { useCameraStore } from '@state/cameraStore';
import { useNavigationStore } from '@state/navigationStore';

import { StaticAuthority, type CinematicAuthority } from './authority';
import { sampleBreathing } from './breathing';
import { copyPose, createPose, type CameraPose } from './pose';
import { PresenceGaze } from './presence';
import { CameraSafety } from './safety';
import {
  breathingAllowedIn,
  presenceAllowedIn,
  CameraStateMachine,
  type CameraState,
} from './states';
import { TransitionController } from './transitions';

/**
 * The camera rig — the per-frame composition of the Camera Hierarchy
 * (Camera Bible §5), in exactly its order of authority:
 *
 *   1. Authored choreography (CinematicAuthority — Theatre.js's seat)
 *   2. Yielding acceleration (applied upstream, to progress speed,
 *      by the navigation system — it changes pace, never pose)
 *   3. Presence response (additive gaze offset only)
 *   4. Breathing (the involuntary layer)
 *   5. Safety resolution (collision pull-in, roll clamp — last word)
 *
 * A layer reaching above its rank is a bug, not a feature. The rig is
 * the one place that ordering is expressed in code, so it can never
 * drift per-feature.
 */

/** Awakening's minimum dwell before Traveling — stillness must read as intentional first (Camera Bible §6). Provisional. */
const AWAKENING_MIN_SECONDS = 2.4;

export class CameraRig {
  public readonly machine = new CameraStateMachine();
  public readonly safety = new CameraSafety();
  public readonly transitions = new TransitionController();

  private authority: CinematicAuthority = new StaticAuthority();
  private readonly presence = new PresenceGaze();
  private readonly pose: CameraPose = createPose();
  private readonly transitionPose: CameraPose = createPose();
  private elapsedSeconds = 0;
  private awakeningElapsed = 0;

  public constructor() {
    this.machine.subscribe((state) => {
      useCameraStore.getState().setCameraState(state);
    });
  }

  /**
   * Seat a new director. Theatre.js's adapter takes this seat in the
   * cinematic milestone; only one authority holds it at a time.
   */
  public setAuthority(authority: CinematicAuthority): void {
    this.authority = authority;
  }

  public getPose(): Readonly<CameraPose> {
    return this.pose;
  }

  /**
   * Advance one frame. Returns the resolved pose for the bridge to
   * apply — the rig computes, the render layer applies (Rendering
   * Bible §2 / Camera Bible §15: render loops only apply values
   * already computed).
   */
  public update(deltaSeconds: number): Readonly<CameraPose> {
    this.elapsedSeconds += deltaSeconds;
    this.advanceLifecycle(deltaSeconds);

    const state = this.machine.state;

    if (this.transitions.isRunning) {
      // Level 1 in its strongest form: a running transition owns the
      // pose completely; presence is suppressed, breathing paused (§9).
      this.transitions.update(deltaSeconds, this.transitionPose);
      copyPose(this.transitionPose, this.pose);
      return this.safety.resolve(this.pose, deltaSeconds);
    }

    // Level 1 — authored base pose.
    this.authority.samplePose(
      {
        progress: useNavigationStore.getState().progress,
        deltaSeconds,
        elapsedSeconds: this.elapsedSeconds,
      },
      this.pose,
    );

    // Level 3 — presence, additive gaze only, state-gated.
    this.presence.apply(this.pose, deltaSeconds, presenceAllowedIn(state));

    // Level 4 — breathing, unless transitioning or reduced motion.
    const { reducedMotion } = useCameraStore.getState();
    if (!reducedMotion && breathingAllowedIn(state) && state !== 'dormant') {
      const breath = sampleBreathing(this.elapsedSeconds, state === 'awakening' ? 0.5 : 1);
      this.pose.position.x += breath.positionX;
      this.pose.position.y += breath.positionY;
      this.pose.position.z += breath.positionZ;
      this.pose.roll += breath.roll;
    }

    // Level 5 — safety has the final word, and only ever subtracts risk.
    return this.safety.resolve(this.pose, deltaSeconds);
  }

  /**
   * Infrastructure-level lifecycle rules only: dormant→awakening on
   * first input, awakening→traveling after its minimum dwell,
   * traveling↔yielding mirroring the navigation machine, →resting at
   * journey end. Observing and Transitioning are entered only by
   * authored choreography via the public machine/transitions APIs.
   */
  private advanceLifecycle(deltaSeconds: number): void {
    const navigation = useNavigationStore.getState();
    const state: CameraState = this.machine.state;

    if (state === 'dormant' && navigation.hasInput) {
      this.machine.transition('awakening');
      this.awakeningElapsed = 0;
      return;
    }

    if (state === 'awakening') {
      this.awakeningElapsed += deltaSeconds;
      if (this.awakeningElapsed >= AWAKENING_MIN_SECONDS) {
        this.machine.transition('traveling');
      }
      return;
    }

    if (state === 'traveling' && navigation.mode === 'yielding') {
      this.machine.transition('yielding');
      return;
    }

    if (state === 'yielding' && navigation.mode !== 'yielding') {
      this.machine.transition('traveling');
      return;
    }

    if ((state === 'traveling' || state === 'observing') && navigation.mode === 'resting') {
      this.machine.transition('resting');
    }
  }
}
