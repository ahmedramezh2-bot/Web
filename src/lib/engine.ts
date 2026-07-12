import { useEngineStore } from '@state/engineStore';

import { loadConfig, type EngineConfig } from './config';
import { EngineError } from './errors';
import { createLogger } from './logger';
import { SystemRegistry, type SystemDefinition } from './systemRegistry';

/**
 * Engine Bootstrap / Application Lifecycle / Module Initialization.
 *
 * The single entry point that takes HEBRA from "nothing has run yet" to
 * "every registered system is initialized, in dependency order, with a
 * validated configuration." Nothing about story, camera, or world
 * content is decided here — this module's only job is sequencing
 * already-independent systems correctly, per Development Standards §6.
 */

const logger = createLogger('Engine');

export interface Engine {
  readonly config: EngineConfig;
  readonly registry: SystemRegistry;
}

let engineInstance: Engine | undefined;

/**
 * Register a system with the engine's shared registry. Must be called
 * before `bootEngine()` — systems are declarative, so call order here
 * never matters, only the `dependsOn` graph does.
 */
export function registerSystem<T>(definition: SystemDefinition<T>): void {
  getOrCreateRegistry().register(definition);
}

function getOrCreateRegistry(): SystemRegistry {
  if (!engineInstance) {
    engineInstance = {
      config: loadConfig(),
      registry: new SystemRegistry(),
    };
  }
  return engineInstance.registry;
}

/**
 * Boot the engine: validate configuration, then initialize every
 * registered system in dependency order. Safe to call once; a second
 * call is a no-op against an already-booted registry.
 */
export async function bootEngine(): Promise<Engine> {
  const { setStatus, setError } = useEngineStore.getState();
  const registry = getOrCreateRegistry();

  if (!engineInstance) {
    throw new EngineError('engine instance was not created before boot — this is unreachable');
  }

  if (registry.isBooted()) {
    return engineInstance;
  }

  setStatus('booting');
  logger.info('booting', { environment: engineInstance.config.environment });

  try {
    await registry.boot();
    setStatus('ready');
    logger.info('ready');
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    setError(message);
    logger.error('boot failed', { message });
    throw cause;
  }

  return engineInstance;
}

/** Read the current engine instance without triggering a boot. Throws if never booted. */
export function getEngine(): Engine {
  if (!engineInstance) {
    throw new EngineError('getEngine() called before the engine was ever created');
  }
  return engineInstance;
}

/**
 * Test-only reset. Never called from production code paths — exists so
 * the future Testing Framework (Development Standards §8) can exercise
 * bootstrap behavior repeatedly within one process.
 */
export function resetEngine(): void {
  engineInstance = undefined;
}
