import { createLogger } from '@lib/logger';

import type { WorldEmitter } from './events';
import { REGIONS, type Region } from './registry';

/**
 * The Streaming Manager — World Blueprint §10 made runtime.
 *
 * The world is partitioned by region, and a chunk boundary is always a
 * narrative boundary. Streaming manages *rendering detail availability*
 * only: per docs/bible/26 §7's resolution of the Chunk Loading
 * question, the world is never unloaded or replaced from the visitor's
 * experiential point of view — regions outside the active window
 * release their render cost, never their existence.
 *
 * The active window is the current region plus a progress lookahead
 * margin on both sides (backward travel is legitimate travel).
 * Region content handlers are registered by the environment milestone;
 * none exist yet. Per-region operations are serialized and loads are
 * abortable, mirroring the chapter lifecycle's concurrency discipline.
 */

const logger = createLogger('StreamingManager');

/** Lookahead margin in journey progress units (~half a chapter) — provisional pending real content measurements. */
const WINDOW_MARGIN = 0.09;

export type RegionLoadState = 'unloaded' | 'loading' | 'loaded' | 'unloading';

export interface RegionContentHandlers {
  readonly load?: (signal: AbortSignal) => Promise<void>;
  readonly unload?: () => Promise<void>;
}

export class StreamingManager {
  private readonly handlers = new Map<string, RegionContentHandlers>();
  private readonly states = new Map<string, RegionLoadState>();
  private readonly chains = new Map<string, Promise<void>>();
  private readonly aborters = new Map<string, AbortController>();

  public constructor(private readonly emitter: WorldEmitter) {
    for (const region of REGIONS) {
      this.states.set(region.id, 'unloaded');
    }
  }

  public registerContent(regionId: string, handlers: RegionContentHandlers): () => void {
    this.handlers.set(regionId, handlers);
    // The window may have admitted this region before its content
    // existed (boot yields the main thread between systems, so a frame
    // can tick streaming before content registration). A region already
    // loading/loaded at registration time ran with no handlers — re-run
    // the load so late-registered content still materializes.
    const region = REGIONS.find((entry) => entry.id === regionId);
    const state = this.stateOf(regionId);
    if (region && (state === 'loaded' || state === 'loading')) {
      this.aborters.get(regionId)?.abort();
      this.beginLoad(region);
    }
    return () => {
      this.handlers.delete(regionId);
    };
  }

  public stateOf(regionId: string): RegionLoadState {
    return this.states.get(regionId) ?? 'unloaded';
  }

  /** Recompute the active window and reconcile every region toward it. */
  public update(progress: number): void {
    const low = progress - WINDOW_MARGIN;
    const high = progress + WINDOW_MARGIN;

    for (const region of REGIONS) {
      const inWindow = region.span[1] >= low && region.span[0] <= high;
      const state = this.stateOf(region.id);

      if (inWindow && state === 'unloaded') {
        this.beginLoad(region);
      } else if (!inWindow && state === 'loaded') {
        this.beginUnload(region);
      }
    }
  }

  private beginLoad(region: Region): void {
    this.states.set(region.id, 'loading');
    this.emitter.emit('region-load-requested', { regionId: region.id });

    const aborter = new AbortController();
    this.aborters.set(region.id, aborter);
    const handlers = this.handlers.get(region.id);

    // A superseded (aborted) load may only write state while it is
    // still the region's current operation — otherwise it would clobber
    // the state a newer load has already set.
    const settleAborted = (): void => {
      if (this.aborters.get(region.id) === aborter) {
        this.states.set(region.id, 'unloaded');
      }
    };

    this.enqueue(region.id, async () => {
      if (aborter.signal.aborted) {
        settleAborted();
        return;
      }
      try {
        await handlers?.load?.(aborter.signal);
        if (aborter.signal.aborted) {
          settleAborted();
          return;
        }
        this.states.set(region.id, 'loaded');
        this.emitter.emit('region-loaded', { regionId: region.id });
      } catch (cause) {
        if (aborter.signal.aborted) {
          settleAborted();
          return;
        }
        this.states.set(region.id, 'unloaded');
        logger.error('region load failed', {
          regionId: region.id,
          message: cause instanceof Error ? cause.message : String(cause),
        });
      }
    });
  }

  private beginUnload(region: Region): void {
    this.aborters.get(region.id)?.abort();
    this.aborters.delete(region.id);
    this.states.set(region.id, 'unloading');

    const handlers = this.handlers.get(region.id);

    this.enqueue(region.id, async () => {
      try {
        await handlers?.unload?.();
      } catch (cause) {
        logger.error('region unload failed', {
          regionId: region.id,
          message: cause instanceof Error ? cause.message : String(cause),
        });
      } finally {
        this.states.set(region.id, 'unloaded');
        this.emitter.emit('region-unloaded', { regionId: region.id });
      }
    });
  }

  private enqueue(regionId: string, operation: () => Promise<void>): void {
    const previous = this.chains.get(regionId) ?? Promise.resolve();
    this.chains.set(regionId, previous.then(operation));
  }
}
