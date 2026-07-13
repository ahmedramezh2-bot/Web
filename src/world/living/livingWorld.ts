import { TypedEmitter } from '@lib/events';
import { createLogger } from '@lib/logger';
import { sharedTicker } from '@lib/ticker';
import { useNavigationStore } from '@state/navigationStore';
import { usePresenceStore } from '@state/presenceStore';
import { useWorldStore } from '@state/worldStore';

import type { WorldClock } from '../worldTime';

/**
 * Living World systems — the runtime that lets the world breathe,
 * notice, and respond without any single piece of content hardcoding
 * how (Animation Bible §4: nothing is perfectly still; §6: everything
 * responds — this is the machinery those sections run on).
 *
 * Observers are per-region updaters gated by the active region, so an
 * idle behavior in The Crystal Garden costs nothing while the visitor
 * is in Void. Idle detection reads real inactivity (no travel, no
 * presence change), never a naive timer since load.
 */

const logger = createLogger('LivingWorld');

export interface WorldObserverContext {
  readonly deltaSeconds: number;
  readonly worldTimeSeconds: number;
  readonly activeRegionId: string;
  /** Seconds since the visitor's last deliberate input or presence change. */
  readonly idleSeconds: number;
}

export type WorldObserver = (context: WorldObserverContext) => void;

export interface IdleBehavior {
  readonly id: string;
  /** Inactivity threshold before the behavior wakes. */
  readonly thresholdSeconds: number;
  readonly onIdleStart: () => void;
  readonly onIdleEnd: () => void;
}

export interface EnvironmentStateEvents extends Record<string, unknown> {
  /** Authored world-state changes — named, narratively-caused shifts an environment broadcasts. */
  'state-changed': { readonly key: string; readonly value: string };
}

/**
 * Future AI Agent Foundation — the structural slot an agent-driven
 * inhabitant would occupy. Per AI Development Protocol §8, any such
 * agent presents author-approved content only; the slot exists so that
 * boundary is designed-in from the start, not retrofitted.
 */
export interface AgentSlot {
  readonly id: string;
  readonly update: (context: WorldObserverContext) => void;
}

export interface LivingWorldHandle {
  readonly environmentState: TypedEmitter<EnvironmentStateEvents>;
  /** Observers scoped to a region run only while it is active; pass 'world' for always-on. */
  readonly addObserver: (scope: string, observer: WorldObserver) => () => void;
  readonly addIdleBehavior: (behavior: IdleBehavior) => () => void;
  readonly registerAgent: (agent: AgentSlot) => () => void;
  readonly idleSeconds: () => number;
  readonly dispose: () => void;
}

/** Velocity below this reads as travel stillness for idle purposes. */
const IDLE_VELOCITY = 0.002;

export function initLivingWorld(clock: WorldClock): LivingWorldHandle {
  const environmentState = new TypedEmitter<EnvironmentStateEvents>();
  const observers = new Map<string, Set<WorldObserver>>();
  const idleBehaviors = new Map<string, { behavior: IdleBehavior; engaged: boolean }>();
  const agents = new Map<string, AgentSlot>();

  let idleSeconds = 0;
  let lastPresenceX = 0;
  let lastPresenceY = 0;

  const removeTick = sharedTicker.add((deltaSeconds) => {
    const navigation = useNavigationStore.getState();
    const presence = usePresenceStore.getState();
    const activeRegionId = useWorldStore.getState().activeRegionId;

    const presenceMoved =
      Math.abs(presence.x - lastPresenceX) > 0.01 || Math.abs(presence.y - lastPresenceY) > 0.01;
    lastPresenceX = presence.x;
    lastPresenceY = presence.y;

    if (Math.abs(navigation.velocity) > IDLE_VELOCITY || presenceMoved) {
      idleSeconds = 0;
    } else {
      idleSeconds += deltaSeconds;
    }

    for (const entry of idleBehaviors.values()) {
      const shouldEngage = idleSeconds >= entry.behavior.thresholdSeconds;
      if (shouldEngage && !entry.engaged) {
        entry.engaged = true;
        entry.behavior.onIdleStart();
      } else if (!shouldEngage && entry.engaged) {
        entry.engaged = false;
        entry.behavior.onIdleEnd();
      }
    }

    const context: WorldObserverContext = {
      deltaSeconds,
      worldTimeSeconds: clock.now(),
      activeRegionId,
      idleSeconds,
    };

    observers.get('world')?.forEach((observer) => observer(context));
    observers.get(activeRegionId)?.forEach((observer) => observer(context));

    for (const agent of agents.values()) {
      agent.update(context);
    }
  });

  return {
    environmentState,
    addObserver: (scope, observer) => {
      let set = observers.get(scope);
      if (!set) {
        set = new Set();
        observers.set(scope, set);
      }
      set.add(observer);
      return () => {
        set.delete(observer);
      };
    },
    addIdleBehavior: (behavior) => {
      if (idleBehaviors.has(behavior.id)) {
        logger.error('duplicate idle behavior refused', { id: behavior.id });
        return () => undefined;
      }
      idleBehaviors.set(behavior.id, { behavior, engaged: false });
      return () => {
        idleBehaviors.delete(behavior.id);
      };
    },
    registerAgent: (agent) => {
      agents.set(agent.id, agent);
      return () => {
        agents.delete(agent.id);
      };
    },
    idleSeconds: () => idleSeconds,
    dispose: () => {
      removeTick();
      observers.clear();
      idleBehaviors.clear();
      agents.clear();
      environmentState.clear();
    },
  };
}
