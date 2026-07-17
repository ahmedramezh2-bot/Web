import { z } from 'zod';

import { ConfigValidationError } from '@lib/errors';

/**
 * The Chapter Registry — Level 1 of the Canonical Naming Architecture
 * (docs/bible/26 §2), as validated runtime data.
 *
 * The six Story Chapters, their canonical order, and their journey
 * progress spans. Names and order are constitutional and may never be
 * invented, reordered, or reinterpreted here. Spans are authored from
 * Part 1's timed script (docs/bible/01-cinematic-narrative/doc-04,
 * 00:00–04:00): Void owns the first minute, Monument the second,
 * Fragments the third; Origin runs 03:00–03:36, Awakening 03:36–03:57,
 * and Threshold the final rise — the script gives the later chapters
 * progressively less clock and more weight, exactly as written.
 *
 * Validated with Zod at module init per the content/schema doctrine:
 * a malformed registry fails loud here, never silently downstream.
 */

export const CHAPTER_IDS = [
  'void',
  'monument',
  'fragments',
  'origin',
  'awakening',
  'threshold',
] as const;

export type ChapterId = (typeof CHAPTER_IDS)[number];

const chapterSchema = z.object({
  id: z.enum(CHAPTER_IDS),
  order: z.number().int().min(0).max(5),
  title: z.string().min(1),
  /** Target emotion per Camera Bible §4's dialect table — constitutional, not editorial. */
  emotion: z.string().min(1),
  /** Journey progress span [start, end) — end-inclusive only for the final chapter. */
  span: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]),
});

export type Chapter = z.infer<typeof chapterSchema>;

/**
 * Script minute-marks as journey fractions of the 04:00 total:
 * Void 00:00–01:00, Monument 01:00–02:00, Fragments 02:00–03:00,
 * Origin 03:00–03:36 (the sphere approach, entry, and interior),
 * Awakening 03:36–03:57 (unfinished worlds completing; the first
 * glimpse of what HEBRA creates), Threshold 03:57–04:00 held longer
 * than its clock — the final sentences and the rise get 1/16 of the
 * journey so the ending is never rushed off screen.
 */
const CHAPTERS_DATA: readonly Chapter[] = [
  { id: 'void', order: 0, title: 'Void', emotion: 'curiosity', span: [0, 0.25] },
  { id: 'monument', order: 1, title: 'Monument', emotion: 'wonder', span: [0.25, 0.5] },
  { id: 'fragments', order: 2, title: 'Fragments', emotion: 'discovery', span: [0.5, 0.75] },
  { id: 'origin', order: 3, title: 'Origin', emotion: 'understanding', span: [0.75, 0.875] },
  { id: 'awakening', order: 4, title: 'Awakening', emotion: 'respect', span: [0.875, 0.9375] },
  { id: 'threshold', order: 5, title: 'Threshold', emotion: 'hope', span: [0.9375, 1] },
];

function validateChapters(data: readonly Chapter[]): readonly Chapter[] {
  const parsed = z.array(chapterSchema).length(6).safeParse(data);
  if (!parsed.success) {
    throw new ConfigValidationError(`chapter registry failed validation: ${parsed.error.message}`);
  }
  // Spans must tile [0,1] in order with no gaps or overlaps — the
  // timeline depends on this invariant absolutely.
  let cursor = 0;
  for (const chapter of parsed.data) {
    const [start, end] = chapter.span;
    if (Math.abs(start - cursor) > 1e-9 || end <= start) {
      throw new ConfigValidationError(
        `chapter "${chapter.id}" span [${start}, ${end}] breaks the contiguous tiling of [0,1]`,
      );
    }
    cursor = end;
  }
  if (Math.abs(cursor - 1) > 1e-9) {
    throw new ConfigValidationError('chapter spans do not cover the full journey');
  }
  return parsed.data;
}

export const CHAPTERS: readonly Chapter[] = validateChapters(CHAPTERS_DATA);

const BY_ID = new Map<ChapterId, Chapter>(CHAPTERS.map((chapter) => [chapter.id, chapter]));

export function getChapter(id: ChapterId): Chapter {
  const chapter = BY_ID.get(id);
  if (!chapter) {
    throw new ConfigValidationError(`unknown chapter id "${id}"`);
  }
  return chapter;
}

export function chapterAfter(id: ChapterId): Chapter | undefined {
  const chapter = getChapter(id);
  return CHAPTERS[chapter.order + 1];
}

export function chapterBefore(id: ChapterId): Chapter | undefined {
  const chapter = getChapter(id);
  return chapter.order > 0 ? CHAPTERS[chapter.order - 1] : undefined;
}
