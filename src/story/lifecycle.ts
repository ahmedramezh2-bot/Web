import { createLogger } from '@lib/logger';

import type { ChapterId } from './chapters';

/**
 * Chapter Loading / Exit Architecture — the async lifecycle hooks a
 * chapter's content registers so entering and leaving a chapter can
 * carry real work (asset warm-up, environment activation) without the
 * story engine knowing what that work is.
 *
 * Concurrency is the whole problem this module exists to solve: a
 * visitor can cross two chapter boundaries faster than one chapter
 * loads. Every load receives an AbortSignal that is aborted the moment
 * its chapter stops being relevant, and per-chapter operations are
 * serialized so load/unload for the same chapter can never interleave.
 */

const logger = createLogger('ChapterLifecycle');

export interface ChapterLifecycleHandlers {
  readonly load?: (signal: AbortSignal) => Promise<void>;
  readonly unload?: () => Promise<void>;
}

export class ChapterLifecycle {
  private readonly handlers = new Map<ChapterId, ChapterLifecycleHandlers>();
  /** Per-chapter operation chain — guarantees load/unload ordering per chapter. */
  private readonly chains = new Map<ChapterId, Promise<void>>();
  private readonly aborters = new Map<ChapterId, AbortController>();

  public register(chapter: ChapterId, handlers: ChapterLifecycleHandlers): () => void {
    this.handlers.set(chapter, handlers);
    return () => {
      this.handlers.delete(chapter);
    };
  }

  public enter(chapter: ChapterId): void {
    const handlers = this.handlers.get(chapter);
    if (!handlers?.load) {
      return;
    }
    const load = handlers.load;

    const aborter = new AbortController();
    this.aborters.set(chapter, aborter);

    this.enqueue(chapter, async () => {
      if (aborter.signal.aborted) {
        return;
      }
      try {
        await load(aborter.signal);
      } catch (cause) {
        if (!aborter.signal.aborted) {
          logger.error('chapter load failed', {
            chapter,
            message: cause instanceof Error ? cause.message : String(cause),
          });
        }
      }
    });
  }

  public exit(chapter: ChapterId): void {
    // A superseded in-flight load must stop before unload work begins.
    this.aborters.get(chapter)?.abort();
    this.aborters.delete(chapter);

    const handlers = this.handlers.get(chapter);
    if (!handlers?.unload) {
      return;
    }
    const unload = handlers.unload;

    this.enqueue(chapter, async () => {
      try {
        await unload();
      } catch (cause) {
        logger.error('chapter unload failed', {
          chapter,
          message: cause instanceof Error ? cause.message : String(cause),
        });
      }
    });
  }

  private enqueue(chapter: ChapterId, operation: () => Promise<void>): void {
    const previous = this.chains.get(chapter) ?? Promise.resolve();
    const next = previous.then(operation);
    this.chains.set(chapter, next);
  }
}
