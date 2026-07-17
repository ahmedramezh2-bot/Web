'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';

import { getEngine } from '@lib/engine';
import { useEngineStore } from '@state/engineStore';
import { useNavigationStore } from '@state/navigationStore';
import type { EnvironmentEngineHandle } from '@world/environment/environmentEngine';
import type { LightingSystemHandle } from '@world/lighting/lightingSystem';
import type { ShaderSystemHandle } from '@shaders/shaderSystem';
import type { WorldEngineHandle } from '@world/worldEngine';

/**
 * Mounts the world's scene roots (environment groups, managed lights)
 * into the single persistent canvas and applies, per frame, the values
 * the runtime systems have already computed: eased exposure to the
 * renderer, the shared uniform clock to the shader system. The stage
 * applies; the systems decide (Rendering Bible §2, Camera Bible §15).
 */
export function WorldSystemsBridge() {
  const engineReady = useEngineStore((state) => state.status === 'ready');
  const gl = useThree((state) => state.gl);

  const systems = useMemo(() => {
    if (!engineReady) {
      return undefined;
    }
    const { registry } = getEngine();
    if (
      !registry.has('environment') ||
      !registry.has('lighting') ||
      !registry.has('shaders') ||
      !registry.has('world')
    ) {
      return undefined;
    }
    return {
      environment: registry.get<EnvironmentEngineHandle>('environment'),
      lighting: registry.get<LightingSystemHandle>('lighting'),
      shaders: registry.get<ShaderSystemHandle>('shaders'),
      world: registry.get<WorldEngineHandle>('world'),
    };
  }, [engineReady]);

  useFrame((_state, delta) => {
    if (!systems) {
      return;
    }
    const deltaSeconds = Math.min(delta, 0.1);
    gl.toneMappingExposure = systems.lighting.update(deltaSeconds);
    systems.shaders.update(
      deltaSeconds,
      systems.world.clock.now(),
      useNavigationStore.getState().progress,
    );
  });

  if (!systems) {
    return null;
  }

  return (
    <>
      <primitive object={systems.environment.sceneRoot} />
      <primitive object={systems.lighting.lightsRoot} />
    </>
  );
}
