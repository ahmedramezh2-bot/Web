import { createLogger } from '@lib/logger';
import { useCameraStore } from '@state/cameraStore';

import { CameraRig } from './rig';
import { installBvhAcceleration } from './safety';

/**
 * Camera system registration + lifecycle — the engine-facing wrapper
 * that owns the rig singleton, installs BVH raycast acceleration, and
 * wires the reduced-motion media query (Camera Bible §16: reduced
 * motion is a genuinely separate branch, and breathing is disabled
 * entirely under it — the flag published here is what the rig reads).
 */

const logger = createLogger('CameraSystem');

export interface CameraSystemHandle {
  readonly rig: CameraRig;
  readonly dispose: () => void;
}

export function initCameraSystem(): CameraSystemHandle {
  installBvhAcceleration();

  const rig = new CameraRig();

  let removeMediaListener: (() => void) | undefined;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (): void => {
      useCameraStore.getState().setReducedMotion(query.matches);
    };
    apply();
    query.addEventListener('change', apply);
    removeMediaListener = () => query.removeEventListener('change', apply);
  }

  logger.info('camera rig initialized', {
    reducedMotion: useCameraStore.getState().reducedMotion,
  });

  return {
    rig,
    dispose: () => {
      removeMediaListener?.();
    },
  };
}
