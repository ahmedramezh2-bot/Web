import { TypedEmitter } from '@lib/events';

import type { ChapterId } from './chapters';

/**
 * The Narrative Event Dispatcher — the story engine's outward voice.
 *
 * Downstream systems (world streaming, audio evolution, analytics,
 * eventually authored choreography) subscribe here instead of polling
 * story state, so narrative cause and system effect stay explicit and
 * traceable. Payloads are past-tense facts, never commands — the story
 * engine reports what happened; it does not order systems around
 * (loose coupling per this phase's architecture requirements).
 */

export type TravelDirection = 'forward' | 'backward';

export interface StoryEvents extends Record<string, unknown> {
  /** The journey's very first deliberate input arrived — the world wakes. */
  'journey-started': { readonly resumed: boolean };
  'chapter-entered': {
    readonly chapter: ChapterId;
    readonly from: ChapterId | undefined;
    readonly direction: TravelDirection;
  };
  'chapter-exited': {
    readonly chapter: ChapterId;
    readonly to: ChapterId;
    readonly direction: TravelDirection;
  };
  /** Progress reached 1 with travel settled — the Resting threshold. */
  'journey-completed': { readonly firstTime: boolean };
  'trigger-fired': { readonly triggerId: string; readonly direction: TravelDirection };
}

export type StoryEmitter = TypedEmitter<StoryEvents>;

export function createStoryEmitter(): StoryEmitter {
  return new TypedEmitter<StoryEvents>();
}
