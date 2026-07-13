import { createPose, copyPose, type CameraPose } from './pose';

/**
 * The Theatre.js integration boundary — Camera Bible §15.
 *
 * Theatre.js owns cinematic choreography and holds level 1 of the
 * Camera Hierarchy (§5): the authored base pose always wins. This
 * module defines the *contract* that authority arrives through — it
 * deliberately does not import @theatre/core, create sheets, or author
 * sequences, all of which belong to the cinematic milestones, not to
 * infrastructure. The boundary is structural: anything that can sample
 * an authored pose from journey progress may hold the director's seat,
 * and exactly one thing holds it at a time.
 */

export interface AuthoritySampleContext {
  /** Journey progress 0..1 (Camera Bible §10 — one scalar, narrative progress). */
  readonly progress: number;
  readonly deltaSeconds: number;
  readonly elapsedSeconds: number;
}

/**
 * The director's seat. A Theatre.js-driven adapter implements this in
 * the cinematic milestone by reading its sheet's camera tracks; until
 * then a StaticAuthority proves the rig lifecycle with a neutral pose.
 */
export interface CinematicAuthority {
  /** Writes the authored base pose for this frame into `into`. */
  samplePose(context: AuthoritySampleContext, into: CameraPose): void;
}

/**
 * Neutral default authority: a fixed stage pose, no motion of its own.
 * Not world content — the camera simply exists somewhere sensible so
 * the rig's lifecycle, breathing, presence, and safety layers can be
 * exercised before any choreography is authored.
 */
export class StaticAuthority implements CinematicAuthority {
  private readonly pose: CameraPose;

  public constructor(pose: CameraPose = createPose()) {
    this.pose = pose;
  }

  public samplePose(_context: AuthoritySampleContext, into: CameraPose): void {
    copyPose(this.pose, into);
  }
}
