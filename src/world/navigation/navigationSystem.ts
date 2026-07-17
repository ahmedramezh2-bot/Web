import { createLogger } from '@lib/logger';
import { attachPresenceInput, type PresenceInputHandle } from '@interaction/presence/presenceInput';
import { initScrollSystem, type ScrollSystemHandle } from '@interaction/scroll/scrollSystem';
import { sharedTicker } from '@lib/ticker';
import { useNavigationStore } from '@state/navigationStore';

import { NavigationMachine } from './navigationMachine';
import { WorldProgress } from './progress';

/**
 * The navigation system — the engine-facing wrapper that composes
 * scroll input, world progress, presence input, and the navigation
 * state machine into one lifecycle. Runs on the shared ticker outside
 * R3F: navigation exists whether or not a canvas is mounted (Camera
 * Bible §15 — Lenis provides progression, not motion; nothing here
 * depends on rendering).
 */

const logger = createLogger('NavigationSystem');

export interface NavigationSystemHandle {
  readonly progress: WorldProgress;
  readonly machine: NavigationMachine;
  readonly dispose: () => void;
}

export function initNavigationSystem(): NavigationSystemHandle {
  const scroll: ScrollSystemHandle = initScrollSystem();
  const presence: PresenceInputHandle = attachPresenceInput();
  const progress = new WorldProgress();
  const machine = new NavigationMachine();

  const removeTick = sharedTicker.add((deltaSeconds, timeMs) => {
    scroll.raf(timeMs);
    progress.setTarget(scroll.getProgress());
    progress.update(deltaSeconds, machine.current === 'yielding');
    machine.update(deltaSeconds, progress.value, progress.velocity);
  });

  logger.info('navigation system initialized');

  return {
    progress,
    machine,
    dispose: () => {
      removeTick();
      scroll.dispose();
      presence.dispose();
      useNavigationStore.getState().setProgress(0, 0);
    },
  };
}
