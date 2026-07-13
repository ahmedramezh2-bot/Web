import { Vector3 } from 'three';

import { clamp01, ease, lerp } from '@lib/motion';

/**
 * The camera's complete authored state at any instant: the four
 * parameters the Camera Bible declares the camera owns — position,
 * look-target, FOV, roll (Camera Bible §9: "every parameter the camera
 * owns eases in and out"). Everything the rig composes per frame is an
 * operation on this type.
 */
export interface CameraPose {
  readonly position: Vector3;
  readonly target: Vector3;
  fov: number;
  roll: number;
}

export function createPose(
  position: Vector3 = new Vector3(0, 1.6, 8),
  target: Vector3 = new Vector3(0, 1.2, 0),
  fov = 45,
  roll = 0,
): CameraPose {
  return { position: position.clone(), target: target.clone(), fov, roll };
}

export function copyPose(from: CameraPose, into: CameraPose): CameraPose {
  into.position.copy(from.position);
  into.target.copy(from.target);
  into.fov = from.fov;
  into.roll = from.roll;
  return into;
}

/**
 * Eased pose interpolation — the cinematic interpolation primitive the
 * transition framework builds on. Every field eases together on the
 * same clock so position, target, FOV and roll never diverge into
 * separately-timed motion (Camera Bible §9: no hard cuts of value on
 * any parameter).
 */
export function interpolatePose(
  from: CameraPose,
  to: CameraPose,
  progress: number,
  into: CameraPose,
  easing: (t: number) => number = ease.transitionShape,
): CameraPose {
  const t = easing(clamp01(progress));
  into.position.lerpVectors(from.position, to.position, t);
  into.target.lerpVectors(from.target, to.target, t);
  into.fov = lerp(from.fov, to.fov, t);
  into.roll = lerp(from.roll, to.roll, t);
  return into;
}
