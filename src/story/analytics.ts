import type { StoryEmitter } from './events';

/**
 * Story Analytics Hooks — privacy-first, per Part 11's Experience
 * Bible: the metrics that matter are time exploring, chapter
 * completion, journey depth — never clicks, never identity.
 *
 * This module is hooks only: a subscriber surface that mirrors story
 * events into whatever analytics sink a later milestone approves.
 * Nothing here touches the network, stores identifiers, or runs
 * unless a sink is explicitly attached — no sink, no cost.
 */

export interface AnalyticsMoment {
  readonly kind:
    | 'journey_started'
    | 'chapter_entered'
    | 'chapter_completed'
    | 'journey_completed'
    | 'trigger_fired';
  readonly detail: string;
  /** Milliseconds since session start — relative time only, never wall-clock identity. */
  readonly sessionTimeMs: number;
}

export type AnalyticsSink = (moment: AnalyticsMoment) => void;

export class StoryAnalytics {
  private readonly sinks = new Set<AnalyticsSink>();
  private readonly sessionStart = typeof performance !== 'undefined' ? performance.now() : 0;

  public constructor(emitter: StoryEmitter) {
    emitter.on('journey-started', ({ resumed }) => {
      this.record('journey_started', resumed ? 'resumed' : 'first');
    });
    emitter.on('chapter-entered', ({ chapter }) => {
      this.record('chapter_entered', chapter);
    });
    emitter.on('chapter-exited', ({ chapter, direction }) => {
      if (direction === 'forward') {
        this.record('chapter_completed', chapter);
      }
    });
    emitter.on('journey-completed', ({ firstTime }) => {
      this.record('journey_completed', firstTime ? 'first' : 'repeat');
    });
    emitter.on('trigger-fired', ({ triggerId }) => {
      this.record('trigger_fired', triggerId);
    });
  }

  public attachSink(sink: AnalyticsSink): () => void {
    this.sinks.add(sink);
    return () => this.sinks.delete(sink);
  }

  private record(kind: AnalyticsMoment['kind'], detail: string): void {
    if (this.sinks.size === 0) {
      return;
    }
    const moment: AnalyticsMoment = {
      kind,
      detail,
      sessionTimeMs: Math.round(performance.now() - this.sessionStart),
    };
    for (const sink of this.sinks) {
      sink(moment);
    }
  }
}
