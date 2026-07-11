/**
 * The journey's chapter registry.
 *
 * Chapters are declared here as data — names, emotional intents and
 * scroll spans — so navigation, the camera director, the audio
 * director and the scene graph all consume one canonical map.
 *
 * Phase 1 ships the registry empty of scenes by design: the shape is
 * the contract that every future chapter plugs into.
 */

export interface ChapterDefinition {
  /** Stable id — anchors, Theatre track names and analytics use it. */
  id: string;
  /** Working title (never shown raw to visitors). */
  title: string;
  /** The single emotion this chapter must communicate. */
  emotion:
    | 'curiosity'
    | 'wonder'
    | 'discovery'
    | 'understanding'
    | 'respect'
    | 'hope'
    | 'legacy';
  /** Normalized scroll span [start, end] within the whole journey. */
  span: [number, number];
}

/**
 * The emotional curve of the experience
 * (Creative Bible: Experience Psychology).
 * Scene content arrives in later phases; the curve is fixed now.
 */
export const CHAPTERS: readonly ChapterDefinition[] = [
  { id: 'void', title: 'The Void Notices', emotion: 'curiosity', span: [0.0, 0.12] },
  { id: 'monument', title: 'The Monument', emotion: 'wonder', span: [0.12, 0.3] },
  { id: 'fragments', title: 'The Living Fragments', emotion: 'discovery', span: [0.3, 0.5] },
  { id: 'origin', title: 'The Origin', emotion: 'understanding', span: [0.5, 0.68] },
  { id: 'awakening', title: 'Ideas Awaken', emotion: 'respect', span: [0.68, 0.84] },
  { id: 'threshold', title: 'The Threshold', emotion: 'hope', span: [0.84, 0.95] },
  { id: 'promise', title: 'The Promise', emotion: 'legacy', span: [0.95, 1.0] },
] as const;

export function chapterAt(progress: number): ChapterDefinition {
  return (
    CHAPTERS.find((c) => progress >= c.span[0] && progress < c.span[1]) ??
    CHAPTERS[CHAPTERS.length - 1]!
  );
}
