import type { Object3D } from 'three';

import { TypedEmitter } from '@lib/events';
import { createLogger } from '@lib/logger';

/**
 * The Interaction Engine — the registry and state machine for world
 * objects the visitor can notice and engage. UI Integration Bible §7's
 * vocabulary (hover, focus, activation) at the world layer, kept
 * strictly separate from camera presence (Camera Bible §22: presence
 * has no functional purpose; interaction is where function lives).
 *
 * The engine owns *which* object is engaged and *what state* it is in.
 * Raycasting — the how — lives in the canvas-side bridge, because
 * casting needs the camera and this engine must not (dependency
 * boundaries per Development Standards §5).
 */

const logger = createLogger('InteractionEngine');

export type InteractionState = 'idle' | 'hover' | 'focus' | 'active';

export interface InteractiveTarget {
  readonly id: string;
  readonly object: Object3D;
  /** Higher priority wins when a cast hits overlapping targets. */
  readonly priority: number;
}

export interface InteractionEvents extends Record<string, unknown> {
  'target-hovered': { readonly id: string };
  'target-unhovered': { readonly id: string };
  'target-focused': { readonly id: string };
  'target-activated': { readonly id: string };
}

export interface InteractionEngineHandle {
  readonly events: TypedEmitter<InteractionEvents>;
  readonly register: (target: InteractiveTarget) => () => void;
  /** Everything currently registered — the bridge casts against exactly this set. */
  readonly targets: () => readonly InteractiveTarget[];
  /** The bridge reports the top hit id per cast (undefined = no hit); the engine resolves state. */
  readonly reportHit: (id: string | undefined) => void;
  /** A deliberate engagement (click/tap) on the current hover target. */
  readonly reportActivation: () => void;
  readonly hoveredId: () => string | undefined;
  readonly stateOf: (id: string) => InteractionState;
  readonly dispose: () => void;
}

export function initInteractionEngine(): InteractionEngineHandle {
  const events = new TypedEmitter<InteractionEvents>();
  const registered = new Map<string, InteractiveTarget>();
  let targetList: InteractiveTarget[] = [];
  let hovered: string | undefined;
  let focused: string | undefined;

  const rebuildList = (): void => {
    targetList = [...registered.values()].sort((a, b) => b.priority - a.priority);
  };

  return {
    events,
    register: (target) => {
      if (registered.has(target.id)) {
        logger.error('duplicate interactive target refused', { id: target.id });
        return () => undefined;
      }
      registered.set(target.id, target);
      rebuildList();
      return () => {
        registered.delete(target.id);
        rebuildList();
        if (hovered === target.id) {
          hovered = undefined;
        }
        if (focused === target.id) {
          focused = undefined;
        }
      };
    },
    targets: () => targetList,
    reportHit: (id) => {
      if (id === hovered) {
        return;
      }
      if (hovered !== undefined) {
        events.emit('target-unhovered', { id: hovered });
      }
      hovered = id;
      if (id !== undefined) {
        events.emit('target-hovered', { id });
      }
    },
    reportActivation: () => {
      if (hovered === undefined) {
        return;
      }
      if (focused !== hovered) {
        focused = hovered;
        events.emit('target-focused', { id: hovered });
      }
      events.emit('target-activated', { id: hovered });
    },
    hoveredId: () => hovered,
    stateOf: (id) => {
      if (focused === id && hovered === id) {
        return 'active';
      }
      if (focused === id) {
        return 'focus';
      }
      if (hovered === id) {
        return 'hover';
      }
      return 'idle';
    },
    dispose: () => {
      registered.clear();
      targetList = [];
      events.clear();
    },
  };
}
