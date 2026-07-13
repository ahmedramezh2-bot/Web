import { BufferGeometry, Mesh, Raycaster, Vector3 } from 'three';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';

import { clamp, damp } from '@lib/motion';

import type { CameraPose } from './pose';

/**
 * Camera safety systems — Camera Bible §5 level 5 and §25.
 *
 * Collision resolution is a query, not a controller (Camera Bible §15):
 * a read-only BVH raycast that nudges the authored pose's tolerance
 * when it would clip geometry, never a system that computes its own
 * alternate path. Orientation safety (§25) additionally clamps roll and
 * preserves a stable up-vector — the one unbroken constant the
 * visitor's spatial confidence depends on.
 */

/** Minimum clearance the camera keeps from registered geometry, in world units. Provisional pending measurement against real world content (M8+). */
const MIN_CLEARANCE = 0.5;

/** Roll never approaches horizon inversion (§25) — hard clamp, radians. */
const MAX_ROLL = 0.35;

/** Corrections ease in rather than snap — §25: never a visible correction snap. */
const CORRECTION_DAMP_LAMBDA = 6;

let bvhPrototypesInstalled = false;

/**
 * Installs three-mesh-bvh's accelerated raycast onto the three.js
 * prototypes, exactly per that library's documented setup. Explicit
 * and idempotent — a deliberate init step, never a module import side
 * effect.
 */
export function installBvhAcceleration(): void {
  if (bvhPrototypesInstalled) {
    return;
  }
  BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
  BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
  Mesh.prototype.raycast = acceleratedRaycast;
  bvhPrototypesInstalled = true;
}

const scratchDirection = new Vector3();
const raycaster = new Raycaster();

export class CameraSafety {
  private readonly colliders = new Set<Mesh>();
  private currentPullIn = 0;

  /** Register world geometry the camera must never clip. World milestones call this; nothing registers colliders yet. */
  public registerCollider(mesh: Mesh): () => void {
    this.colliders.add(mesh);
    return () => this.colliders.delete(mesh);
  }

  /**
   * Resolves the final pose for this frame. Order: collision pull-in
   * (spring-arm technique — cast from the look-target toward the
   * camera; if geometry intrudes, the camera moves in front of it),
   * then roll clamp. Both corrections are damped, never snapped.
   */
  public resolve(pose: CameraPose, deltaSeconds: number): CameraPose {
    let desiredPullIn = 0;

    if (this.colliders.size > 0) {
      scratchDirection.subVectors(pose.position, pose.target);
      const span = scratchDirection.length();
      if (span > 1e-4) {
        scratchDirection.normalize();
        raycaster.set(pose.target, scratchDirection);
        raycaster.far = span;
        const hits = raycaster.intersectObjects([...this.colliders], false);
        const nearest = hits[0];
        if (nearest && nearest.distance < span - MIN_CLEARANCE) {
          desiredPullIn = span - Math.max(nearest.distance - MIN_CLEARANCE, MIN_CLEARANCE);
        }
      }
    }

    this.currentPullIn = damp(
      this.currentPullIn,
      desiredPullIn,
      CORRECTION_DAMP_LAMBDA,
      deltaSeconds,
    );

    if (this.currentPullIn > 1e-4) {
      scratchDirection.subVectors(pose.target, pose.position).normalize();
      pose.position.addScaledVector(scratchDirection, this.currentPullIn);
    }

    pose.roll = clamp(pose.roll, -MAX_ROLL, MAX_ROLL);

    return pose;
  }
}
