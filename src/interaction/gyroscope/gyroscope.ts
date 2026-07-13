import { clamp } from '@lib/motion';
import { usePresenceStore } from '@state/presenceStore';

/**
 * Gyroscope preparation — Camera Bible §13.
 *
 * Device tilt contributes a very gentle parallax layer, scaled well
 * below mouse sensitivity, and only where explicitly granted by the
 * visitor — never assumed, never requested without a clear, diegetic
 * reason to ask. This module is preparation only: fully implemented,
 * wired to the presence store, and enabled by nothing. The authored
 * moment that earns the permission request belongs to a content
 * milestone.
 */

/** Degrees of device tilt that map to full-scale signal — generous, so ordinary handheld wobble stays well inside the deadzone the camera applies. Provisional. */
const FULL_SCALE_TILT_DEGREES = 24;

/** Gyro presence strength ceiling — deliberately below mouse/touch (§13). */
const GYRO_MAX_STRENGTH = 0.6;

export interface GyroscopeHandle {
  readonly enabled: boolean;
  readonly dispose: () => void;
}

/**
 * Request permission (where the platform requires it — iOS's
 * DeviceOrientationEvent.requestPermission, per MDN) and begin
 * contributing tilt as a presence signal. Returns undefined if the
 * visitor declines or the platform has no orientation support —
 * declining is always a complete, respected answer.
 */
export async function enableGyroscope(): Promise<GyroscopeHandle | undefined> {
  if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
    return undefined;
  }

  const eventClass = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };

  if (typeof eventClass.requestPermission === 'function') {
    const decision = await eventClass.requestPermission();
    if (decision !== 'granted') {
      return undefined;
    }
  }

  let baselineBeta: number | undefined;
  let baselineGamma: number | undefined;

  const onOrientation = (event: DeviceOrientationEvent): void => {
    if (event.beta === null || event.gamma === null) {
      return;
    }
    // First reading becomes the neutral pose — tilt is relative to how
    // the visitor is already holding the device, never to gravity's
    // absolute frame.
    baselineBeta ??= event.beta;
    baselineGamma ??= event.gamma;

    const x = clamp((event.gamma - baselineGamma) / FULL_SCALE_TILT_DEGREES, -1, 1);
    const y = clamp((event.beta - baselineBeta) / FULL_SCALE_TILT_DEGREES, -1, 1);
    usePresenceStore.getState().setSignal(x, y, GYRO_MAX_STRENGTH, 'gyroscope');
  };

  window.addEventListener('deviceorientation', onOrientation, { passive: true });

  return {
    enabled: true,
    dispose: () => {
      window.removeEventListener('deviceorientation', onOrientation);
      usePresenceStore.getState().clear();
    },
  };
}
