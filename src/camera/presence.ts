import { Vector3 } from 'three';

import { clamp, damp } from '@lib/motion';
import { usePresenceStore } from '@state/presenceStore';

import type { CameraPose } from './pose';

/**
 * Presence application — Camera Hierarchy level 3 (Camera Bible §5,
 * §12–13, §22).
 *
 * Additive gaze offset only: presence nudges where the camera looks by
 * a tightly capped amount. It never moves the camera's position — a
 * camera whose position tracks the pointer has become a UI control,
 * the one thing it must never be (§14, Cursor-mapped camera position).
 *
 * Desktop and mobile differ in *input mechanics* (deadzone, gain,
 * damping — §12 vs §13), never in what presence is allowed to do.
 */

interface PresenceProfile {
  readonly deadzone: number;
  readonly maxYawRadians: number;
  readonly maxPitchRadians: number;
  readonly dampLambda: number;
}

/** Desktop: tightest deadzone, highest resolution, readable small shifts (§12). */
const MOUSE_PROFILE: PresenceProfile = {
  deadzone: 0.02,
  maxYawRadians: 0.045,
  maxPitchRadians: 0.03,
  dampLambda: 3.2,
};

/** Touch: broader deadzone, smoother output — momentum over precision (§13). */
const TOUCH_PROFILE: PresenceProfile = {
  deadzone: 0.06,
  maxYawRadians: 0.038,
  maxPitchRadians: 0.026,
  dampLambda: 2.2,
};

/** Gyroscope: scaled well below mouse sensitivity so handheld wobble never reads as jitter (§13). */
const GYRO_PROFILE: PresenceProfile = {
  deadzone: 0.05,
  maxYawRadians: 0.02,
  maxPitchRadians: 0.014,
  dampLambda: 1.8,
};

/** Gaze offset scales down as the camera nears its subject (§12, Depth) — the visitor's hand never fights a close reveal. */
const NEAR_DISTANCE = 2.5;
const FAR_DISTANCE = 9;
const NEAR_FACTOR = 0.4;

const scratchForward = new Vector3();
const scratchRight = new Vector3();
const scratchUp = new Vector3(0, 1, 0);

export class PresenceGaze {
  private yaw = 0;
  private pitch = 0;

  /**
   * Applies the damped presence gaze offset to the pose's look-target.
   * `enabled` is the state-machine gate (suppressed during
   * Transitioning and Dormant); when disabled the offset eases back to
   * zero rather than cutting — absence is also authored (§22).
   */
  public apply(pose: CameraPose, deltaSeconds: number, enabled: boolean): void {
    const signal = usePresenceStore.getState();
    const profile =
      signal.source === 'touch'
        ? TOUCH_PROFILE
        : signal.source === 'gyroscope'
          ? GYRO_PROFILE
          : MOUSE_PROFILE;

    let targetYaw = 0;
    let targetPitch = 0;

    if (enabled && signal.source !== 'none') {
      const magnitude = Math.hypot(signal.x, signal.y);
      if (magnitude > profile.deadzone) {
        const depthFactor = depthAttenuation(pose);
        targetYaw = clamp(signal.x, -1, 1) * profile.maxYawRadians * signal.strength * depthFactor;
        targetPitch =
          clamp(signal.y, -1, 1) * profile.maxPitchRadians * signal.strength * depthFactor;
      }
    }

    this.yaw = damp(this.yaw, targetYaw, profile.dampLambda, deltaSeconds);
    this.pitch = damp(this.pitch, targetPitch, profile.dampLambda, deltaSeconds);

    if (Math.abs(this.yaw) < 1e-6 && Math.abs(this.pitch) < 1e-6) {
      return;
    }

    scratchForward.subVectors(pose.target, pose.position);
    const distance = scratchForward.length();
    if (distance < 1e-4) {
      return;
    }
    scratchForward.normalize();
    scratchRight.crossVectors(scratchForward, scratchUp).normalize();

    pose.target.addScaledVector(scratchRight, Math.tan(this.yaw) * distance);
    pose.target.addScaledVector(scratchUp, Math.tan(this.pitch) * distance);
  }
}

function depthAttenuation(pose: CameraPose): number {
  const distance = pose.position.distanceTo(pose.target);
  if (distance <= NEAR_DISTANCE) {
    return NEAR_FACTOR;
  }
  if (distance >= FAR_DISTANCE) {
    return 1;
  }
  const t = (distance - NEAR_DISTANCE) / (FAR_DISTANCE - NEAR_DISTANCE);
  return NEAR_FACTOR + (1 - NEAR_FACTOR) * t;
}
