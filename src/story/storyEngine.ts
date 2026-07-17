import { createLogger } from '@lib/logger';
import { sharedTicker } from '@lib/ticker';
import { useNavigationStore } from '@state/navigationStore';
import { useStoryStore } from '@state/storyStore';

import { type Chapter, type ChapterId } from './chapters';
import { createStoryEmitter, type StoryEmitter, type TravelDirection } from './events';
import { ChapterLifecycle } from './lifecycle';
import { restoreSave, SaveScheduler, type StorySave } from './persistence';
import { StoryAnalytics } from './analytics';
import { locate } from './timeline';
import { TriggerSystem } from './triggers';

/**
 * The Story Engine — the single authority on narrative progression.
 *
 * It owns exactly one question: given the navigation system's journey
 * progress, what is narratively true right now? Chapter changes,
 * journey start/completion, trigger crossings, and durable narrative
 * state all resolve here and nowhere else. It never drives the camera,
 * never loads assets, never renders — it reports narrative facts
 * through its dispatcher, and other systems act on their own
 * responsibilities in response.
 */

const logger = createLogger('StoryEngine');

/** Boundary hysteresis in progress units — a chapter change must clear the boundary by this margin, so damped progress noise at a boundary never flaps enter/exit events. */
const BOUNDARY_HYSTERESIS = 0.002;

export interface StoryEngineHandle {
  readonly events: StoryEmitter;
  readonly triggers: TriggerSystem;
  readonly lifecycle: ChapterLifecycle;
  readonly analytics: StoryAnalytics;
  readonly currentChapter: () => Chapter;
  readonly dispose: () => void;
}

export function initStoryEngine(): StoryEngineHandle {
  const events = createStoryEmitter();
  const triggers = new TriggerSystem(events);
  const lifecycle = new ChapterLifecycle();
  const analytics = new StoryAnalytics(events);

  const save: StorySave = restoreSave();
  let furthestProgress = save.furthestProgress;
  let journeySeen = save.journeySeen;
  let journeyCompleted = save.journeyCompleted;
  let postOriginReached = save.postOriginReached;
  let journeyStartedEmitted = false;

  useStoryStore.getState().setRestoredFlags({
    journeySeen,
    postOriginReached,
    journeyCompleted,
  });

  const scheduler = new SaveScheduler(() => ({
    version: 1,
    furthestProgress,
    journeySeen,
    journeyCompleted,
    postOriginReached,
    updatedAt: Date.now(),
  }));
  scheduler.start();

  triggers.prime(0);

  let current: Chapter = locate(0).chapter;
  lifecycle.enter(current.id);
  useStoryStore.getState().setCurrentChapter(current.id);

  const removeTick = sharedTicker.add(() => {
    const navigation = useNavigationStore.getState();
    const progress = navigation.progress;

    if (!journeyStartedEmitted && navigation.hasInput) {
      journeyStartedEmitted = true;
      if (!journeySeen) {
        journeySeen = true;
        scheduler.markDirty();
      }
      events.emit('journey-started', { resumed: save.journeySeen });
    }

    triggers.update(progress);

    if (progress > furthestProgress) {
      furthestProgress = progress;
      scheduler.markDirty();
    }

    const next = locate(progress).chapter;
    if (next.id !== current.id && clearsHysteresis(progress, current, next)) {
      const direction: TravelDirection = next.order > current.order ? 'forward' : 'backward';
      const previous = current;
      current = next;

      lifecycle.exit(previous.id);
      events.emit('chapter-exited', { chapter: previous.id, to: next.id, direction });

      lifecycle.enter(next.id);
      useStoryStore.getState().setCurrentChapter(next.id);
      events.emit('chapter-entered', { chapter: next.id, from: previous.id, direction });

      if (next.id === 'origin' && direction === 'forward' && !postOriginReached) {
        postOriginReached = true;
        useStoryStore.getState().markPostOrigin();
        scheduler.markDirty();
      }
    }

    if (!journeyCompleted && navigation.mode === 'resting') {
      journeyCompleted = true;
      useStoryStore.getState().markJourneyCompleted();
      scheduler.markDirty();
      events.emit('journey-completed', { firstTime: !save.journeyCompleted });
    }
  });

  logger.info('story engine initialized', {
    resumedFrom: save.furthestProgress,
    journeySeen: save.journeySeen,
  });

  return {
    events,
    triggers,
    lifecycle,
    analytics,
    currentChapter: () => current,
    dispose: () => {
      removeTick();
      scheduler.dispose();
      events.clear();
    },
  };
}

/** A chapter change is real once progress clears the shared boundary by the hysteresis margin in the direction of travel. */
function clearsHysteresis(progress: number, current: Chapter, next: Chapter): boolean {
  if (next.order > current.order) {
    return progress >= next.span[0] + BOUNDARY_HYSTERESIS;
  }
  return progress <= current.span[0] - BOUNDARY_HYSTERESIS;
}

/** Narrow re-export so world code can depend on the id type without importing story internals. */
export type { ChapterId };
