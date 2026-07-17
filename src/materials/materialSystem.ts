import { MeshPhysicalMaterial, type MeshPhysicalMaterialParameters } from 'three';

import { EngineError } from '@lib/errors';
import { createLogger } from '@lib/logger';
import type { QualityTier } from '@quality/tiers';

/**
 * The Material System — registry, factory, cache, lifecycle for the
 * twelve constitutional material families (Material Bible §3).
 *
 * Family identity is constitutional data; the *authored PBR profile*
 * for each family is Phase H content. This system refuses to invent
 * one: creating a material for a family whose profile hasn't been
 * registered is a programming error that fails loud (Material Bible
 * §4 — a family missing its authored fields is not production-ready),
 * never a silent gray placeholder.
 *
 * Caching is refcounted per family+variant, per Appendix F's material
 * instancing discipline — two hundred shards of the same crystal share
 * one material instance, and disposal happens exactly when the last
 * user releases.
 */

const logger = createLogger('MaterialSystem');

export const MATERIAL_FAMILY_IDS = [
  'black-obsidian',
  'white-stone',
  'unknown-crystal',
  'liquid-metal',
  'ancient-alloy',
  'living-glass',
  'energy-crystal',
  'transparent-minerals',
  'impossible-matter',
  'architectural-stone',
  'sacred-stone',
  'memory-stone',
] as const;

export type MaterialFamilyId = (typeof MATERIAL_FAMILY_IDS)[number];

/**
 * An authored family profile — the Material Bible §6 dial-set as
 * MeshPhysicalMaterial parameters, plus optional per-tier overrides
 * (Appendix F: reduce cost, never identity — an override may cheapen
 * transmission sampling, never recolor the family).
 */
export interface MaterialProfile {
  readonly base: MeshPhysicalMaterialParameters;
  readonly perTier?: Partial<Record<QualityTier, MeshPhysicalMaterialParameters>>;
}

interface CacheEntry {
  readonly material: MeshPhysicalMaterial;
  refCount: number;
}

export interface MaterialSystemHandle {
  readonly registerProfile: (family: MaterialFamilyId, profile: MaterialProfile) => void;
  readonly hasProfile: (family: MaterialFamilyId) => boolean;
  /** Acquire a shared material instance. Every acquire must be paired with a release. */
  readonly acquire: (family: MaterialFamilyId, variant?: string) => MeshPhysicalMaterial;
  readonly release: (family: MaterialFamilyId, variant?: string) => void;
  readonly setQualityTier: (tier: QualityTier) => void;
  readonly dispose: () => void;
}

export function initMaterialSystem(initialTier: QualityTier): MaterialSystemHandle {
  const profiles = new Map<MaterialFamilyId, MaterialProfile>();
  const cache = new Map<string, CacheEntry>();
  let tier = initialTier;

  const cacheKey = (family: MaterialFamilyId, variant: string): string => `${family}:${variant}`;

  const configure = (material: MeshPhysicalMaterial, profile: MaterialProfile): void => {
    material.setValues(profile.base);
    const tierOverride = profile.perTier?.[tier];
    if (tierOverride) {
      material.setValues(tierOverride);
    }
    material.needsUpdate = true;
  };

  return {
    registerProfile: (family, profile) => {
      if (profiles.has(family)) {
        logger.warn('material profile re-registered — replacing', { family });
      }
      profiles.set(family, profile);
    },
    hasProfile: (family) => profiles.has(family),
    acquire: (family, variant = 'default') => {
      const profile = profiles.get(family);
      if (!profile) {
        throw new EngineError(
          `material family "${family}" has no authored profile — register one before acquiring`,
        );
      }
      const key = cacheKey(family, variant);
      const existing = cache.get(key);
      if (existing) {
        existing.refCount += 1;
        return existing.material;
      }
      const material = new MeshPhysicalMaterial();
      material.name = key;
      // Ownership marker: the environment engine's disposeSubtree skips
      // shared materials — this cache disposes them, on last release.
      material.userData['sharedOwnership'] = true;
      configure(material, profile);
      cache.set(key, { material, refCount: 1 });
      return material;
    },
    release: (family, variant = 'default') => {
      const key = cacheKey(family, variant);
      const entry = cache.get(key);
      if (!entry) {
        logger.warn('release without matching acquire', { key });
        return;
      }
      entry.refCount -= 1;
      if (entry.refCount <= 0) {
        entry.material.dispose();
        cache.delete(key);
      }
    },
    setQualityTier: (next) => {
      if (next === tier) {
        return;
      }
      tier = next;
      // Live instances re-read their profile under the new tier — cost
      // changes, identity never does (Appendix F).
      for (const [key, entry] of cache) {
        const family = key.split(':')[0] as MaterialFamilyId;
        const profile = profiles.get(family);
        if (profile) {
          configure(entry.material, profile);
        }
      }
    },
    dispose: () => {
      for (const entry of cache.values()) {
        entry.material.dispose();
      }
      cache.clear();
      profiles.clear();
    },
  };
}
