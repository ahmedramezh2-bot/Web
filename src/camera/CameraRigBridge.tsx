'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { PerspectiveCamera, MathUtils } from 'three';

import { getEngine } from '@lib/engine';
import { useEngineStore } from '@state/engineStore';

import type { CameraSystemHandle } from './cameraSystem';

/**
 * Applies the rig's resolved pose to the R3F default camera each
 * frame. R3F is a stage, not a director (Camera Bible §15): nothing
 * about what the camera does originates here — this bridge only
 * applies, per frame, the values the rig has already composed.
 */
export function CameraRigBridge() {
  const engineReady = useEngineStore((state) => state.status === 'ready');
  const camera = useThree((state) => state.camera);

  const rig = useMemo(() => {
    if (!engineReady) {
      return undefined;
    }
    const { registry } = getEngine();
    return registry.has('camera') ? registry.get<CameraSystemHandle>('camera').rig : undefined;
  }, [engineReady]);

  useFrame((_state, delta) => {
    if (!rig || !(camera instanceof PerspectiveCamera)) {
      return;
    }

    const pose = rig.update(Math.min(delta, 0.1));

    camera.position.copy(pose.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(pose.target);
    if (Math.abs(pose.roll) > 1e-6) {
      camera.rotateZ(pose.roll);
    }
    if (Math.abs(camera.fov - pose.fov) > 1e-3) {
      camera.fov = MathUtils.clamp(pose.fov, 20, 90);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
