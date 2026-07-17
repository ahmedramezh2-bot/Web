import { createLogger } from '@lib/logger';
import { useUiStore, type UiBreakpoint } from '@state/uiStore';

/**
 * The UI Engine — the UI Integration Bible as runtime discipline.
 *
 * Interface exists only where the world cannot carry meaning (§1);
 * every element declares its Information Layer (§3) and lives through
 * an authored enter/exit lifecycle (§1's Lifecycle rule: no UI element
 * simply appears or disappears). What an element *looks like* is
 * world-integrated content (Phase H); this engine owns registration,
 * layering, lifecycle, and the responsive breakpoint signal.
 */

const logger = createLogger('UiEngine');

/** UI Integration Bible §3 — the six Information Layers, verbatim. */
export type InformationLayer =
  'primary' | 'secondary' | 'hidden' | 'contextual' | 'persistent' | 'temporary';

export interface UiElementDefinition {
  readonly id: string;
  readonly layer: InformationLayer;
  /** Why this element earned interface at all — §1's last-resort rule, stated per element. */
  readonly justification: string;
  /** Authored enter/exit durations, seconds — lifecycle is eased, never instant (§9). */
  readonly enterSeconds: number;
  readonly exitSeconds: number;
  /** Temporary-layer elements must declare their finite lifetime (§3). */
  readonly lifetimeSeconds?: number;
}

export interface UiEngineHandle {
  readonly register: (definition: UiElementDefinition) => void;
  /** Begin an element's entrance; resolves to 'visible' after its enter duration. */
  readonly show: (id: string) => void;
  /** Begin an element's exit; removed from state after its exit duration. */
  readonly hide: (id: string) => void;
  readonly dispose: () => void;
}

/** Viewport widths → breakpoint classes. Layout adaptation only — render-cost adaptation is the quality system's separate axis (Design Token Bible §2). */
const BREAKPOINT_QUERIES: ReadonlyArray<{ readonly query: string; readonly value: UiBreakpoint }> =
  [
    { query: '(max-width: 767px)', value: 'compact' },
    { query: '(min-width: 768px) and (max-width: 1439px)', value: 'regular' },
    { query: '(min-width: 1440px)', value: 'wide' },
  ];

export function initUiEngine(): UiEngineHandle {
  const definitions = new Map<string, UiElementDefinition>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const mediaCleanups: Array<() => void> = [];
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    for (const breakpoint of BREAKPOINT_QUERIES) {
      const media = window.matchMedia(breakpoint.query);
      const apply = (): void => {
        if (media.matches) {
          useUiStore.getState().setBreakpoint(breakpoint.value);
        }
      };
      apply();
      media.addEventListener('change', apply);
      mediaCleanups.push(() => media.removeEventListener('change', apply));
    }
  }

  const clearTimer = (id: string): void => {
    const timer = timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.delete(id);
    }
  };

  return {
    register: (definition) => {
      if (definitions.has(definition.id)) {
        logger.error('duplicate ui element refused', { id: definition.id });
        return;
      }
      if (definition.layer === 'temporary' && definition.lifetimeSeconds === undefined) {
        logger.error('temporary element without lifetime refused — UI Bible §3', {
          id: definition.id,
        });
        return;
      }
      definitions.set(definition.id, definition);
    },
    show: (id) => {
      const definition = definitions.get(id);
      if (!definition) {
        logger.error('unregistered ui element shown', { id });
        return;
      }
      clearTimer(id);
      useUiStore.getState().setElementPhase(id, 'entering');
      timers.set(
        id,
        setTimeout(() => {
          useUiStore.getState().setElementPhase(id, 'visible');
          if (definition.layer === 'temporary' && definition.lifetimeSeconds !== undefined) {
            timers.set(
              id,
              setTimeout(() => hideElement(id, definition), definition.lifetimeSeconds * 1000),
            );
          }
        }, definition.enterSeconds * 1000),
      );
    },
    hide: (id) => {
      const definition = definitions.get(id);
      if (definition) {
        clearTimer(id);
        hideElement(id, definition);
      }
    },
    dispose: () => {
      for (const cleanup of mediaCleanups) {
        cleanup();
      }
      for (const id of timers.keys()) {
        clearTimer(id);
      }
      definitions.clear();
    },
  };

  function hideElement(id: string, definition: UiElementDefinition): void {
    useUiStore.getState().setElementPhase(id, 'exiting');
    timers.set(
      id,
      setTimeout(() => {
        useUiStore.getState().removeElement(id);
        timers.delete(id);
      }, definition.exitSeconds * 1000),
    );
  }
}
