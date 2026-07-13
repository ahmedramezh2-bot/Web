'use client';

import { useEffect, type ReactNode } from 'react';

import { initAudioEngine, type AudioEngineHandle } from '@audio/audioEngine';
import { initCameraSystem } from '@camera/cameraSystem';
import { initAnimationEngine } from '@cinematic/animationEngine';
import { ErrorBoundary } from '@components/system/ErrorBoundary';
import { initUiEngine } from '@components/ui/uiEngine';
import { initContactSystem } from '@content/contactSystem';
import { initContentSystem } from '@content/contentSystem';
import { GestureBridge } from '@interaction/gesture/GestureBridge';
import { initInteractionEngine } from '@interaction/interactionEngine';
import { initAnalyticsHub } from '@lib/analytics';
import { bootEngine, getEngine, registerSystem } from '@lib/engine';
import { createLogger } from '@lib/logger';
import type { StoryEngineHandle } from '@story/storyEngine';
import { initMaterialSystem } from '@materials/materialSystem';
import { initQualitySystem, type QualitySystemHandle } from '@quality/qualitySystem';
import { initShaderSystem } from '@shaders/shaderSystem';
import { useEngineStore } from '@state/engineStore';
import { initStoryEngine } from '@story/storyEngine';
import { initEnvironmentEngine } from '@world/environment/environmentEngine';
import { initFxEngine } from '@world/fx/fxEngine';
import { initLightingSystem } from '@world/lighting/lightingSystem';
import { initLivingWorld } from '@world/living/livingWorld';
import { initNavigationSystem } from '@world/navigation/navigationSystem';
import { initWorldEngine, type WorldEngineHandle } from '@world/worldEngine';

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
  registerSystem({
    id: 'lighting',
    dependsOn: ['quality'],
    init: () => initLightingSystem(getEngine().registry.get<QualitySystemHandle>('quality').tier),
  });
  registerSystem({
    id: 'materials',
    dependsOn: ['quality'],
    init: () => initMaterialSystem(getEngine().registry.get<QualitySystemHandle>('quality').tier),
  });
  registerSystem({
    id: 'shaders',
    dependsOn: ['quality'],
    init: () => initShaderSystem(getEngine().registry.get<QualitySystemHandle>('quality').tier),
  });
  registerSystem({
    id: 'environment',
    dependsOn: ['world'],
    init: () =>
      initEnvironmentEngine(getEngine().registry.get<WorldEngineHandle>('world').streaming),
  });
  registerSystem({ id: 'animation', init: initAnimationEngine });
  registerSystem({ id: 'interaction', init: initInteractionEngine });
  registerSystem({
    id: 'audio',
    dependsOn: ['quality'],
    init: () => initAudioEngine(getEngine().registry.get<QualitySystemHandle>('quality').tier),
  });
  registerSystem({
    id: 'fx',
    dependsOn: ['quality'],
    init: () => initFxEngine(getEngine().registry.get<QualitySystemHandle>('quality').tier),
  });
  registerSystem({
    id: 'living-world',
    dependsOn: ['world'],
    init: () => initLivingWorld(getEngine().registry.get<WorldEngineHandle>('world').clock),
  });
  registerSystem({ id: 'ui', init: initUiEngine });
  registerSystem({ id: 'content', init: initContentSystem });
  registerSystem({ id: 'contact', init: initContactSystem });
  registerSystem({
    id: 'analytics',
    dependsOn: ['story'],
    init: () => {
      const hub = initAnalyticsHub();
      // Story analytics mirror into the hub — privacy floor preserved
      // end to end (relative session time and narrative facts only).
      const story = getEngine().registry.get<StoryEngineHandle>('story');
      story.analytics.attachSink((moment) => hub.record(moment.kind, moment.detail));
      hub.installErrorReporting();
      return hub;
    },
  });
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

  // Audio may only start inside a user gesture (autoplay policy;
  // Tone.start()'s documented contract). The first deliberate pointer
  // or key input starts the engine, then the listeners retire.
  useEffect(() => {
    if (status !== 'ready') {
      return;
    }
    const tryStartAudio = (): void => {
      const { registry } = getEngine();
      if (!registry.has('audio')) {
        return;
      }
      void registry
        .get<AudioEngineHandle>('audio')
        .start()
        .then((started) => {
          if (started) {
            window.removeEventListener('pointerdown', tryStartAudio);
            window.removeEventListener('keydown', tryStartAudio);
          }
        });
    };
    window.addEventListener('pointerdown', tryStartAudio, { passive: true });
    window.addEventListener('keydown', tryStartAudio, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', tryStartAudio);
      window.removeEventListener('keydown', tryStartAudio);
    };
  }, [status]);

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
