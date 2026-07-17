import { clamp01 } from '@lib/motion';

import { CHAPTERS, type Chapter, type ChapterId } from './chapters';

/**
 * The Story Timeline — the single mapping between journey progress
 * (the navigation system's one scalar, Camera Bible §10) and narrative
 * position: which chapter, and how far through it.
 *
 * Every system that asks "where are we in the story" asks this module.
 * Nothing else re-derives chapter boundaries from raw progress —
 * one mapping, one owner.
 */

export interface TimelinePosition {
  readonly chapter: Chapter;
  /** Progress within the chapter, 0..1. */
  readonly chapterProgress: number;
}

export function locate(progress: number): TimelinePosition {
  const p = clamp01(progress);
  // Six chapters — linear scan is both simplest and fastest at this size.
  for (const chapter of CHAPTERS) {
    const [start, end] = chapter.span;
    const isLast = chapter.order === CHAPTERS.length - 1;
    if (p < end || (isLast && p <= end)) {
      return {
        chapter,
        chapterProgress: clamp01((p - start) / (end - start)),
      };
    }
  }
  // Unreachable given the registry's validated tiling; the last chapter
  // catches p === 1. Kept for type totality.
  const last = CHAPTERS[CHAPTERS.length - 1] as Chapter;
  return { chapter: last, chapterProgress: 1 };
}

/** Journey progress at which a chapter begins — the target the Yielding system accelerates toward (Technical Addendum §4). */
export function chapterStart(id: ChapterId): number {
  const chapter = CHAPTERS.find((entry) => entry.id === id);
  return chapter ? chapter.span[0] : 0;
}

/** The next chapter boundary strictly ahead of the given progress, or undefined at journey's end. */
export function nextBoundary(progress: number): number | undefined {
  const p = clamp01(progress);
  for (const chapter of CHAPTERS) {
    if (chapter.span[0] > p + 1e-9) {
      return chapter.span[0];
    }
  }
  return undefined;
}
