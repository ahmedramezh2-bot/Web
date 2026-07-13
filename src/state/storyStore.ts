import { create } from 'zustand';

import type { ChapterId } from '@story/chapters';

/**
 * Story shared state — the infrequently-changing narrative facts other
 * systems render against. Frame-frequency values (chapter-local
 * progress) are deliberately NOT here: they're computed on demand from
 * the timeline, so this store only updates on genuine narrative
 * moments, keeping subscriber work proportional to story beats rather
 * than frames.
 */

interface StoryState {
  readonly currentChapter: ChapterId;
  /** True for a returning visitor — gates the compressed Overture (Technical Addendum). */
  readonly journeySeen: boolean;
  /** The post-Origin functional layer unlock (Technical Addendum §8). */
  readonly postOriginReached: boolean;
  readonly journeyCompleted: boolean;
  readonly setCurrentChapter: (chapter: ChapterId) => void;
  readonly setRestoredFlags: (flags: {
    journeySeen: boolean;
    postOriginReached: boolean;
    journeyCompleted: boolean;
  }) => void;
  readonly markPostOrigin: () => void;
  readonly markJourneyCompleted: () => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  currentChapter: 'void',
  journeySeen: false,
  postOriginReached: false,
  journeyCompleted: false,
  setCurrentChapter: (currentChapter) => set({ currentChapter }),
  setRestoredFlags: (flags) => set(flags),
  markPostOrigin: () => set({ postOriginReached: true }),
  markJourneyCompleted: () => set({ journeyCompleted: true }),
}));
