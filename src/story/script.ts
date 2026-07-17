/**
 * The written sentences of the journey — transcribed verbatim from
 * Part 1's script (docs/bible/01-cinematic-narrative/doc-04), never
 * invented, never paraphrased. Each appears alone in space at its
 * scripted moment and dissolves; there is no other on-screen text in
 * the world (00:55: "No logo. No CTA. No branding. No UI.").
 *
 * Windows are journey-progress spans derived from the script's
 * minute-marks against the 04:00 total (chapters.ts documents the
 * same mapping).
 */

export interface ScriptSentence {
  readonly id: string;
  /** Verbatim script text. */
  readonly text: string;
  /** Progress window [appear, dissolve]. */
  readonly window: readonly [number, number];
  /** The whisper (03:30) arrives softer than the written sentences. */
  readonly register: 'sentence' | 'whisper';
}

export const SCRIPT_SENTENCES: readonly ScriptSentence[] = [
  {
    id: 'creation-remains',
    // Script 00:55
    text: 'Every civilization disappears. Only creation remains.',
    window: [0.215, 0.25],
    register: 'sentence',
  },
  {
    id: 'ideas-never-die',
    // Script 02:00
    text: 'Ideas never die. They wait for someone to build them.',
    window: [0.48, 0.515],
    register: 'sentence',
  },
  {
    id: 'we-awaken',
    // Script 03:00
    text: 'We never create ideas. We awaken the ones waiting to exist.',
    window: [0.73, 0.765],
    register: 'sentence',
  },
  {
    id: 'before-reality',
    // Script 03:30 — "A whisper… from the environment itself."
    text: 'You are looking at ideas before they become reality.',
    window: [0.895, 0.925],
    register: 'whisper',
  },
  {
    id: 'remembered',
    // Script 04:00
    text: 'Civilizations are remembered by what they leave behind.',
    window: [0.945, 0.972],
    register: 'sentence',
  },
  {
    id: 'yours',
    // Script 04:00 — "Then another sentence."
    text: 'What will yours leave behind?',
    window: [0.978, 1],
    register: 'sentence',
  },
];

/** The sentence whose window contains the given progress, if any. */
export function sentenceAtProgress(progress: number): ScriptSentence | undefined {
  return SCRIPT_SENTENCES.find(
    (sentence) => progress >= sentence.window[0] && progress <= sentence.window[1],
  );
}
