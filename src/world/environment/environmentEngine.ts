import { Group, Mesh, Points, type Object3D } from 'three';

import { createLogger } from '@lib/logger';

import type { StreamingManager } from '../streaming';
import { REGIONS } from '../registry';

/**
 * The Environment Engine — the runtime that gives every region a place
 * to put its visual content, and a disciplined way to load, show,
 * hide, and dispose it.
 *
 * One Group per region, all under one environment root that lives in
 * the single persistent scene (Part 3's one-world law: regions release
 * their render cost when far away — via streaming — but the world is
 * never unloaded or replaced from the visitor's point of view,
 * docs/bible/26 §7). Content builders are registered by authored
 * environments (Phase H); none exist yet. The engine owns lifecycle
 * and disposal only — it has no opinion about what an environment
 * looks like.
 */

const logger = createLogger('EnvironmentEngine');

export interface EnvironmentBuildContext {
  /** The region's root group — everything the environment creates parents here. */
  readonly root: Group;
  readonly signal: AbortSignal;
}

/**
 * A builder may return a cleanup function; it runs at unload, before
 * the engine disposes the subtree — the place to release acquired
 * shared materials, shader instances, and registered lights.
 */
export type EnvironmentCleanup = () => void;

export type EnvironmentBuilder = (
  context: EnvironmentBuildContext,
) => Promise<EnvironmentCleanup | void> | EnvironmentCleanup | void;

export interface EnvironmentEngineHandle {
  /** The one root the R3F scene mounts — regions' groups live under it. */
  readonly sceneRoot: Group;
  readonly registerEnvironment: (regionId: string, builder: EnvironmentBuilder) => () => void;
  readonly dispose: () => void;
}

/**
 * Recursively releases GPU resources for everything under an object,
 * per the three.js documented disposal pattern (geometry.dispose,
 * material.dispose — materials may be arrays). Textures belong to the
 * material system's refcounted cache, which handles its own disposal;
 * this only releases what the environment itself created.
 */
export function disposeSubtree(object: Object3D): void {
  object.traverse((child) => {
    if (child instanceof Mesh || child instanceof Points) {
      child.geometry.dispose();
      const material = child.material;
      const entries = Array.isArray(material) ? material : [material];
      for (const entry of entries) {
        // Shared-ownership materials (material system's refcounted
        // cache, shader system's tracked instances) are released by
        // their owning system via the builder's cleanup — disposing
        // them here would corrupt the shared caches.
        if (entry.userData['sharedOwnership'] !== true) {
          entry.dispose();
        }
      }
    }
  });
}

export function initEnvironmentEngine(streaming: StreamingManager): EnvironmentEngineHandle {
  const sceneRoot = new Group();
  sceneRoot.name = 'hebra-environment-root';

  const regionGroups = new Map<string, Group>();
  const unregisters: Array<() => void> = [];

  for (const region of REGIONS) {
    const group = new Group();
    group.name = `region:${region.id}`;
    group.visible = false;
    sceneRoot.add(group);
    regionGroups.set(region.id, group);
  }

  const registerEnvironment = (regionId: string, builder: EnvironmentBuilder): (() => void) => {
    const group = regionGroups.get(regionId);
    if (!group) {
      logger.error('environment registered for unknown region', { regionId });
      return () => undefined;
    }

    let cleanup: EnvironmentCleanup | undefined;
    const unregister = streaming.registerContent(regionId, {
      load: async (signal) => {
        const result = await builder({ root: group, signal });
        if (typeof result === 'function') {
          cleanup = result;
        }
        if (!signal.aborted) {
          group.visible = true;
        }
      },
      unload: async () => {
        group.visible = false;
        cleanup?.();
        cleanup = undefined;
        disposeSubtree(group);
        group.clear();
      },
    });

    unregisters.push(unregister);
    return unregister;
  };

  logger.info('environment engine initialized', { regions: regionGroups.size });

  return {
    sceneRoot,
    registerEnvironment,
    dispose: () => {
      for (const unregister of unregisters) {
        unregister();
      }
      disposeSubtree(sceneRoot);
      sceneRoot.clear();
    },
  };
}
