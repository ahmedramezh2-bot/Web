import { Vector3 } from 'three';

import type { AuthoritySampleContext, CinematicAuthority } from '@camera/authority';
import type { CameraPose } from '@camera/pose';
import { clamp01, ease } from '@lib/motion';
import { createSmoothPath, type PathSample, type WorldPath } from '@world/navigation/path';

/**
 * The Journey — the authored cinematic choreography of the Main Path,
 * holding level 1 of the Camera Hierarchy (Camera Bible §5).
 *
 * The spine is one smooth spatial path from The Starfield Reach
 * (z = +360) through The Origin Core (the literal world origin) to The
 * Rising Gate (z = −120, rising), sampled by journey progress. On top
 * of it, an authored beat table — position offsets, gaze targets, and
 * focal length per script moment — realizes each chapter's camera
 * dialect (Camera Bible §4):
 *
 *   Void       — wide lens, near-stillness, the frame searched
 *   Monument   — the path itself arcs; wonder granted by orbit
 *   Fragments  — closer focal lengths, gaze led between subjects
 *   Origin     — the one committed push: gaze locked to the world
 *                origin, lens tightening to the journey's narrowest
 *   Awakening  — slowest, most restrained framing; generous space
 *   Threshold  — the rise: +Y becomes the dominant axis
 *
 * Beats are code-authored keyframe tracks. The Theatre.js seat
 * (`theatreAuthority.ts`) wraps this table so a studio session can
 * later refine the same values without touching this file.
 */

/** The Main Path spine — world-space waypoints, authored (see module note). */
const SPINE_WAYPOINTS: readonly Vector3[] = [
  new Vector3(0, 1.6, 360), // 00:00 — Void, absolute stillness ahead
  new Vector3(1.5, 1.8, 318), // drift so slow it is felt before seen
  new Vector3(-1, 2.0, 276), // Cosmic Dust Field
  new Vector3(0, 2.2, 240), // the light that opens (Void → Monument)
  new Vector3(-9, 3.5, 214), // Monument Range — the arc begins
  new Vector3(10, 6.0, 188), // swing past the first monolith
  new Vector3(0, 4.5, 150), // through the Sentinel Ring's center
  new Vector3(-6, 2.6, 118), // descend toward the Crystal Garden
  new Vector3(3, 2.2, 84), // among the crystals
  new Vector3(0, 1.8, 48), // the Energy Stream draws forward
  new Vector3(0, 0.8, 8), // arrival — the committed push
  new Vector3(0, 0.2, -18), // through the Origin's folding interior
  new Vector3(0, 1.0, -58), // white infinity — the Distant Heart
  new Vector3(0, 3.5, -86), // the floor lets go
  new Vector3(0, 11, -104), // Threshold — the rise
  new Vector3(0, 19, -114), // toward the aperture, up the dominant axis
];

interface JourneyBeat {
  readonly progress: number;
  /** World-space gaze target at this beat. */
  readonly target: Vector3;
  readonly fov: number;
}

/**
 * The gaze/lens track — script beats as keyframes. Targets are the
 * hero anchors each chapter's dialect looks to; fov is the focal
 * discipline (wide when searching, narrow only for the Origin push).
 */
const BEATS: readonly JourneyBeat[] = [
  { progress: 0, target: new Vector3(0, 2, 240), fov: 54 }, // the one distant star (00:08)
  { progress: 0.2, target: new Vector3(0, 2.2, 238), fov: 52 }, // it grows; space appears
  { progress: 0.27, target: new Vector3(-14, 9, 206), fov: 48 }, // first monolith emerges (01:12)
  { progress: 0.375, target: new Vector3(8, 7, 168), fov: 46 }, // the ring's sentinels
  { progress: 0.47, target: new Vector3(0, 5, 138), fov: 47 }, // through the ring
  { progress: 0.55, target: new Vector3(2, 1.5, 86), fov: 50 }, // the Artifact (02:28)
  { progress: 0.66, target: new Vector3(0, 1, 30), fov: 49 }, // fragments streaming ahead
  { progress: 0.75, target: new Vector3(0, 0, 0), fov: 46 }, // The Origin, seen whole (02:52)
  { progress: 0.84, target: new Vector3(0, 0, -30), fov: 42 }, // the committed push (03:12)
  { progress: 0.9, target: new Vector3(0, 1.5, -74), fov: 48 }, // unfinished worlds, held gently
  { progress: 0.95, target: new Vector3(0, 12, -112), fov: 46 }, // the gate, above
  { progress: 1, target: new Vector3(0, 22, -122), fov: 44 }, // hope is vertical
];

export class JourneyAuthority implements CinematicAuthority {
  private readonly spine: WorldPath = createSmoothPath(SPINE_WAYPOINTS);
  private readonly pathSample: PathSample = {
    position: new Vector3(),
    tangent: new Vector3(),
  };
  private readonly targetScratch = new Vector3();

  public samplePose(context: AuthoritySampleContext, into: CameraPose): void {
    const progress = clamp01(context.progress);
    this.spine.sample(progress, this.pathSample);
    into.position.copy(this.pathSample.position);

    const { target, fov } = this.sampleBeats(progress);
    into.target.copy(target);
    into.fov = fov;
    into.roll = 0;
  }

  /** Eased interpolation across the beat table — never a hard cut (Camera Bible §8). */
  private sampleBeats(progress: number): { target: Vector3; fov: number } {
    const first = BEATS[0] as JourneyBeat;
    const last = BEATS[BEATS.length - 1] as JourneyBeat;
    if (progress <= first.progress) {
      return { target: this.targetScratch.copy(first.target), fov: first.fov };
    }
    if (progress >= last.progress) {
      return { target: this.targetScratch.copy(last.target), fov: last.fov };
    }
    for (let index = 0; index < BEATS.length - 1; index += 1) {
      const from = BEATS[index] as JourneyBeat;
      const to = BEATS[index + 1] as JourneyBeat;
      if (progress >= from.progress && progress < to.progress) {
        const span = to.progress - from.progress;
        const eased = ease.transitionShape(clamp01((progress - from.progress) / span));
        this.targetScratch.copy(from.target).lerp(to.target, eased);
        return {
          target: this.targetScratch,
          fov: from.fov + (to.fov - from.fov) * eased,
        };
      }
    }
    return { target: this.targetScratch.copy(last.target), fov: last.fov };
  }
}
