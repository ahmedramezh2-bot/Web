import { createLogger } from '@lib/logger';

import type { StoryEmitter, TravelDirection } from './events';

/**
 * The Narrative Trigger System — declarative progress-threshold
 * triggers. Authored content registers "at journey progress X, this
 * narrative fact becomes true"; the system detects crossings in either
 * travel direction and reports them through the story dispatcher.
 *
 * Infrastructure only: no triggers are registered here. What fires
 * where is authored narrative, owned by the cinematic milestones.
 */

const logger = createLogger('StoryTriggers');

export interface StoryTrigger {
  readonly id: string;
  /** Journey progress threshold 0..1. */
  readonly at: number;
  /** Fire only on the first forward crossing, or on every crossing. */
  readonly once: boolean;
  /** Restrict to one travel direction; omit for both. */
  readonly direction?: TravelDirection;
}

export class TriggerSystem {
  private readonly triggers = new Map<string, StoryTrigger>();
  private readonly fired = new Set<string>();
  private lastProgress = 0;

  public constructor(private readonly emitter: StoryEmitter) {}

  public register(trigger: StoryTrigger): () => void {
    if (this.triggers.has(trigger.id)) {
      logger.error('duplicate trigger id refused', { id: trigger.id });
      return () => undefined;
    }
    this.triggers.set(trigger.id, trigger);
    return () => {
      this.triggers.delete(trigger.id);
      this.fired.delete(trigger.id);
    };
  }

  /** Seed the crossing detector after a session restore, so resuming at progress 0.4 does not replay every trigger below it. */
  public prime(progress: number): void {
    this.lastProgress = progress;
    for (const trigger of this.triggers.values()) {
      if (trigger.once && trigger.at <= progress) {
        this.fired.add(trigger.id);
      }
    }
  }

  public update(progress: number): void {
    const previous = this.lastProgress;
    if (progress === previous) {
      return;
    }
    const direction: TravelDirection = progress > previous ? 'forward' : 'backward';
    const low = Math.min(previous, progress);
    const high = Math.max(previous, progress);

    for (const trigger of this.triggers.values()) {
      if (trigger.at <= low || trigger.at > high) {
        continue;
      }
      if (trigger.direction && trigger.direction !== direction) {
        continue;
      }
      if (trigger.once && this.fired.has(trigger.id)) {
        continue;
      }
      this.fired.add(trigger.id);
      this.emitter.emit('trigger-fired', { triggerId: trigger.id, direction });
    }

    this.lastProgress = progress;
  }
}
