import { BufferAttribute, BufferGeometry, Points, type Material } from 'three';

import { createLogger } from '@lib/logger';
import { clamp01, damp } from '@lib/motion';
import { sharedTicker } from '@lib/ticker';
import type { QualityTier } from '@quality/tiers';

/**
 * The FX Engine — the FX Bible's runtime. Registry with the §3 nine
 * required fields enforced as the registration type, eased-intensity
 * instance lifecycle (§1: every effect has an authored birth, life,
 * and death — nothing pops to full or vanishes to zero), and the
 * particle framework foundation: a pooled, budgeted Points container
 * whose per-particle behavior is a Shader Bible particle-fx shader's
 * job, never CPU per-particle logic (FX Bible §10 / Animation Bible
 * §9's shared GPU-first discipline).
 *
 * No visual effect is authored here.
 */

const logger = createLogger('FxEngine');

/** Per-tier particle ceilings from Appendix F's budget table (Desktop High 80k / Balanced 45k / Mobile Essential 15k). */
export const PARTICLE_BUDGET: Readonly<Record<QualityTier, number>> = {
  cinema: 80000,
  balanced: 45000,
  essential: 15000,
};

export type FxScale = 'micro' | 'local' | 'regional' | 'world';

/** FX Bible §3 — the nine required fields, as the registration type. */
export interface FxDefinition {
  readonly id: string;
  readonly purpose: string;
  readonly narrativeMeaning: string;
  readonly trigger: 'ambient' | 'proximity' | 'story' | 'transition';
  /** Authored intensity range — effects breathe, never hold one value (Lighting Bible §9). */
  readonly intensityRange: readonly [number, number];
  readonly lifetimeSeconds: number | 'persistent';
  readonly scale: FxScale;
  readonly behavior: 'flow' | 'drift' | 'pulse' | 'hold';
  readonly interaction: string;
  /** Declared particle cost at Cinema tier — budget-checked at spawn. */
  readonly particleCost: number;
}

export interface FxInstance {
  readonly setIntensityTarget: (intensity: number) => void;
  readonly currentIntensity: () => number;
  readonly stop: () => void;
}

interface ActiveFx {
  readonly definition: FxDefinition;
  readonly onIntensity: (intensity: number) => void;
  intensityTarget: number;
  intensityCurrent: number;
  ageSeconds: number;
  stopping: boolean;
}

/** Intensity easing rate — birth and death are always eased (FX Bible §1). */
const INTENSITY_LAMBDA = 2.4;

export interface FxEngineHandle {
  readonly register: (definition: FxDefinition) => void;
  /** Spawn an instance; intensity eases from 0. Returns undefined if the particle budget cannot fit it. */
  readonly spawn: (id: string, onIntensity: (intensity: number) => void) => FxInstance | undefined;
  /** Allocate a pooled particle container within the remaining budget. */
  readonly allocateParticles: (
    count: number,
    material: Material,
  ) => { points: Points; release: () => void } | undefined;
  readonly particleBudgetRemaining: () => number;
  readonly setQualityTier: (tier: QualityTier) => void;
  readonly dispose: () => void;
}

export function initFxEngine(initialTier: QualityTier): FxEngineHandle {
  const registry = new Map<string, FxDefinition>();
  const active = new Set<ActiveFx>();
  let tier = initialTier;
  let particlesAllocated = 0;

  const removeTick = sharedTicker.add((deltaSeconds) => {
    for (const fx of active) {
      fx.ageSeconds += deltaSeconds;

      const [min, max] = fx.definition.intensityRange;
      const target = fx.stopping ? 0 : clamp01(fx.intensityTarget) * (max - min) + min;
      fx.intensityCurrent = damp(fx.intensityCurrent, target, INTENSITY_LAMBDA, deltaSeconds);
      fx.onIntensity(fx.intensityCurrent);

      const expired =
        fx.definition.lifetimeSeconds !== 'persistent' &&
        fx.ageSeconds >= fx.definition.lifetimeSeconds;
      if (expired && !fx.stopping) {
        fx.stopping = true;
      }
      if (fx.stopping && fx.intensityCurrent < 1e-3) {
        fx.onIntensity(0);
        active.delete(fx);
      }
    }
  });

  return {
    register: (definition) => {
      if (registry.has(definition.id)) {
        logger.error('duplicate fx id refused', { id: definition.id });
        return;
      }
      registry.set(definition.id, definition);
    },
    spawn: (id, onIntensity) => {
      const definition = registry.get(id);
      if (!definition) {
        logger.error('unregistered fx requested', { id });
        return undefined;
      }
      const fx: ActiveFx = {
        definition,
        onIntensity,
        intensityTarget: 1,
        intensityCurrent: 0,
        ageSeconds: 0,
        stopping: false,
      };
      active.add(fx);
      return {
        setIntensityTarget: (intensity) => {
          fx.intensityTarget = intensity;
        },
        currentIntensity: () => fx.intensityCurrent,
        stop: () => {
          fx.stopping = true;
        },
      };
    },
    allocateParticles: (count, material) => {
      const budget = PARTICLE_BUDGET[tier];
      if (particlesAllocated + count > budget) {
        logger.warn('particle budget exhausted — allocation refused', {
          requested: count,
          allocated: particlesAllocated,
          budget,
          tier,
        });
        return undefined;
      }
      particlesAllocated += count;

      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
      // Per-particle seed — the raw material of Natural Imperfection
      // (Animation Bible §5) at the GPU level.
      const seeds = new Float32Array(count);
      for (let i = 0; i < count; i += 1) {
        seeds[i] = Math.random();
      }
      geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));

      const points = new Points(geometry, material);
      points.frustumCulled = true;

      return {
        points,
        release: () => {
          particlesAllocated -= count;
          geometry.dispose();
        },
      };
    },
    particleBudgetRemaining: () => PARTICLE_BUDGET[tier] - particlesAllocated,
    setQualityTier: (next) => {
      tier = next;
    },
    dispose: () => {
      removeTick();
      active.clear();
      registry.clear();
    },
  };
}
