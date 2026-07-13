'use client';

import { useEffect, type ReactNode } from 'react';

import { initCameraSystem } from '@camera/cameraSystem';
import { ErrorBoundary } from '@components/system/ErrorBoundary';
import { GestureBridge } from '@interaction/gesture/GestureBridge';
import { bootEngine, registerSystem } from '@lib/engine';
import { createLogger } from '@lib/logger';
import { initQualitySystem } from '@quality/qualitySystem';
import { useEngineStore } from '@state/engineStore';
import { initStoryEngine } from '@story/storyEngine';
import { initNavigationSystem } from '@world/navigation/navigationSystem';
import { initWorldEngine } from '@world/worldEngine';

/**
 * Global Providers.
 *
 * The single client-side root that boots the engine and establishes
 * the Error Boundary every future provider (state, quality, audio,
 * camera) will nest inside. Owns no artistic decision — per
 * src/app's own stated scope, this file mounts infrastructure only.
 */

const logger = createLogger('Providers');

let systemsRegistered = false;

/**
 * Registers every engine system exactly once, before the first boot.
 * Kept as a function (rather than module-top-level side effects) so
 * a future Testing Framework can call it deterministically per test.
 */
function registerEngineSystems(): void {
  if (systemsRegistered) {
    return;
  }
  registerSystem({ id: 'quality', init: initQualitySystem });
  registerSystem({ id: 'navigation', init: initNavigationSystem });
  registerSystem({ id: 'camera', dependsOn: ['navigation'], init: initCameraSystem });
  registerSystem({ id: 'story', dependsOn: ['navigation'], init: initStoryEngine });
  registerSystem({ id: 'world', dependsOn: ['navigation', 'story'], init: initWorldEngine });
  systemsRegistered = true;
}

export function Providers({ children }: { children: ReactNode }): ReactNode {
  const status = useEngineStore((state) => state.status);

  useEffect(() => {
    registerEngineSystems();
    bootEngine().catch((cause: unknown) => {
      logger.error('engine boot failed', {
        message: cause instanceof Error ? cause.message : String(cause),
      });
    });
  }, []);

  return (
    <ErrorBoundary>
      <GestureBridge />
      <EngineStatusGate status={status}>{children}</EngineStatusGate>
    </ErrorBoundary>
  );
}

/**
 * Withholds mounting children until the engine reports ready, per the
 * Engine Bootstrap's own lifecycle — nothing downstream should assume
 * engine systems exist before `bootEngine()` has actually resolved.
 */
function EngineStatusGate({
  status,
  children,
}: {
  status: ReturnType<typeof useEngineStore.getState>['status'];
  children: ReactNode;
}): ReactNode {
  if (status === 'error') {
    return null;
  }
  return children;
}
