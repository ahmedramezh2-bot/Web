/**
 * Experience state — one small zustand store for cross-system facts.
 *
 * Only global, slowly-changing state lives here (which chapter we are
 * in, whether sound is invited, whether the rite has finished).
 * High-frequency signals (scroll, pointer) stay in their systems and
 * never enter React state — that is what keeps 60fps honest.
 */

import { create } from 'zustand';
import type { ChapterDefinition } from '@/story/chapters';
import { CHAPTERS } from '@/story/chapters';

interface ExperienceState {
  entered: boolean;
  soundOn: boolean;
  chapter: ChapterDefinition;
  setEntered: (entered: boolean) => void;
  setSoundOn: (on: boolean) => void;
  setChapter: (chapter: ChapterDefinition) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  entered: false,
  soundOn: false,
  chapter: CHAPTERS[0]!,
  setEntered: (entered) => set({ entered }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setChapter: (chapter) => set({ chapter }),
}));
