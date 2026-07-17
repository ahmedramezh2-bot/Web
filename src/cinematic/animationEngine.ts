import { createLogger } from '@lib/logger';
import { clamp01, ease } from '@lib/motion';
import { sharedTicker } from '@lib/ticker';

/**
 * The Animation Engine — the Animation Bible's object-level motion
 * runtime. World objects animate through here; the camera never does
 * (Theatre.js holds the director's seat via the camera's
 * CinematicAuthority boundary), and UI never does (GSAP's lane, see
 * gsapBoundary.ts). One engine per responsibility, per Development
 * Standards §6.
 *
 * A definition must declare the Animation Bible §3 eight fields to
 * exist — the type is the checklist. Playback is value-track based:
 * an instance drives a 0..1 eased value into an applier callback, so
 * the engine animates *values*, and owners decide what a value means
 * (scale, emission, rotation) — the engine never touches objects it
 * doesn't own.
 */

const logger = createLogger('AnimationEngine');

export type AnimationTrigger = 'ambient' | 'proximity' | 'story' | 'scripted';

export type LoopStrategy =
  | { readonly kind: 'once' }
  | {
      readonly kind: 'loop';
      /** Per-cycle timing jitter 0..1 — Animation Bible §8: two cycles are never identical. Zero is refused. */
      readonly variation: number;
    };

/** Animation Bible §3 — the eight required fields, as the registration type. */
export interface AnimationDefinition {
  readonly id: string;
  readonly purpose: string;
  readonly meaning: string;
  /** Target emotion per Camera Bible §4's table. */
  readonly emotion: string;
  readonly trigger: AnimationTrigger;
  readonly durationSeconds: number;
  /** Settle time back to rest after completion — the Recovery field. */
  readonly recoverySeconds: number;
  readonly loop: LoopStrategy;
}

export interface AnimationInstance {
  readonly stop: () => void;
}

interface ActiveInstance {
  readonly definition: AnimationDefinition;
  readonly apply: (value: number) => void;
  elapsed: number;
  cycleDuration: number;
  recovering: boolean;
  recoveryElapsed: number;
  lastValue: number;
  readonly seed: number;
}

export interface AnimationEngineHandle {
  readonly register: (definition: AnimationDefinition) => void;
  /** Begin playback, driving eased 0..1 values into the applier each frame. */
  readonly play: (id: string, apply: (value: number) => void) => AnimationInstance;
  readonly activeCount: () => number;
  readonly dispose: () => void;
}

export function initAnimationEngine(): AnimationEngineHandle {
  const registry = new Map<string, AnimationDefinition>();
  const active = new Set<ActiveInstance>();

  const cycleDurationFor = (definition: AnimationDefinition, seed: number): number => {
    if (definition.loop.kind !== 'loop') {
      return definition.durationSeconds;
    }
    const variation = Math.max(definition.loop.variation, 0.01);
    // Deterministic per-instance, varied per-cycle via the evolving seed.
    const jitter = 1 + ((Math.sin(seed * 12.9898) * 43758.5453) % 1) * variation;
    return definition.durationSeconds * Math.abs(jitter);
  };

  const removeTick = sharedTicker.add((deltaSeconds) => {
    for (const instance of active) {
      if (instance.recovering) {
        instance.recoveryElapsed += deltaSeconds;
        const recovery = Math.max(instance.definition.recoverySeconds, 1e-3);
        const t = clamp01(instance.recoveryElapsed / recovery);
        instance.apply(instance.lastValue * (1 - ease.dissolve(t)));
        if (t >= 1) {
          instance.apply(0);
          active.delete(instance);
        }
        continue;
      }

      instance.elapsed += deltaSeconds;
      const t = clamp01(instance.elapsed / instance.cycleDuration);
      instance.lastValue = ease.emerge(t);
      instance.apply(instance.lastValue);

      if (t >= 1) {
        if (instance.definition.loop.kind === 'loop') {
          instance.elapsed = 0;
          instance.cycleDuration = cycleDurationFor(
            instance.definition,
            instance.seed + instance.cycleDuration,
          );
        } else {
          instance.recovering = true;
          instance.recoveryElapsed = 0;
        }
      }
    }
  });

  return {
    register: (definition) => {
      if (registry.has(definition.id)) {
        logger.error('duplicate animation id refused', { id: definition.id });
        return;
      }
      if (definition.loop.kind === 'loop' && definition.loop.variation <= 0) {
        logger.error('loop without variation refused — Animation Bible §8', {
          id: definition.id,
        });
        return;
      }
      registry.set(definition.id, definition);
    },
    play: (id, apply) => {
      const definition = registry.get(id);
      if (!definition) {
        logger.error('unregistered animation requested', { id });
        return { stop: () => undefined };
      }
      const seed = Math.random() * 1000;
      const instance: ActiveInstance = {
        definition,
        apply,
        elapsed: 0,
        cycleDuration: cycleDurationFor(definition, seed),
        recovering: false,
        recoveryElapsed: 0,
        lastValue: 0,
        seed,
      };
      active.add(instance);
      return {
        stop: () => {
          if (active.has(instance) && !instance.recovering) {
            instance.recovering = true;
            instance.recoveryElapsed = 0;
          }
        },
      };
    },
    activeCount: () => active.size,
    dispose: () => {
      removeTick();
      active.clear();
      registry.clear();
    },
  };
}
