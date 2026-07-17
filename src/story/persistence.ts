import { z } from 'zod';

import { createLogger } from '@lib/logger';

/**
 * Story Persistence — save and restore of narrative session state.
 *
 * Implements the Technical Addendum's return-visit contract: a
 * returning visitor is recognized (the journey-seen flag that gates
 * the compressed Overture) and resumes with their furthest progress
 * known. One versioned localStorage document, Zod-validated on
 * restore — corrupt or foreign data is discarded loudly, never
 * trusted (content/schema doctrine applied to our own storage).
 *
 * Privacy: this stores narrative position only. No identifiers, no
 * fingerprinting, nothing about the person — only where the story was.
 */

const logger = createLogger('StoryPersistence');

const STORAGE_KEY = 'hebra.story.v1';

const saveSchema = z.object({
  version: z.literal(1),
  furthestProgress: z.number().min(0).max(1),
  journeySeen: z.boolean(),
  journeyCompleted: z.boolean(),
  postOriginReached: z.boolean(),
  updatedAt: z.number().int().positive(),
});

export type StorySave = z.infer<typeof saveSchema>;

export function createEmptySave(): StorySave {
  return {
    version: 1,
    furthestProgress: 0,
    journeySeen: false,
    journeyCompleted: false,
    postOriginReached: false,
    updatedAt: Date.now(),
  };
}

export function restoreSave(): StorySave {
  if (typeof window === 'undefined') {
    return createEmptySave();
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage access can throw (private mode, blocked storage) — a
    // visitor without storage simply gets a fresh journey every time.
    return createEmptySave();
  }
  if (raw === null) {
    return createEmptySave();
  }
  try {
    const parsed = saveSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      logger.warn('discarding invalid story save', { issues: parsed.error.issues.length });
      return createEmptySave();
    }
    return parsed.data;
  } catch {
    logger.warn('discarding unparseable story save');
    return createEmptySave();
  }
}

export function writeSave(save: StorySave): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Quota or blocked storage — losing the save is acceptable;
    // interrupting the journey to report it is not.
  }
}

/**
 * Throttled save scheduling: narrative state changes every frame while
 * traveling, but durable writes happen at a calm cadence and at page
 * hide (visibilitychange to 'hidden' is the reliable last-write signal
 * per MDN's page lifecycle guidance — never 'unload').
 */
export class SaveScheduler {
  private dirty = false;
  private intervalId: ReturnType<typeof setInterval> | undefined;
  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden') {
      this.flush();
    }
  };

  public constructor(
    private readonly snapshot: () => StorySave,
    private readonly intervalMs = 2000,
  ) {}

  public start(): void {
    this.intervalId = setInterval(() => {
      if (this.dirty) {
        this.flush();
      }
    }, this.intervalMs);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  public markDirty(): void {
    this.dirty = true;
  }

  public flush(): void {
    this.dirty = false;
    writeSave(this.snapshot());
  }

  public dispose(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.flush();
  }
}
