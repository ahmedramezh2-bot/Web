import { create } from 'zustand';

/**
 * UI shared state — which interface elements are alive and what the
 * viewport class is. Per UI Integration Bible §1's Visibility rule,
 * the default state of everything here is "nothing is visible":
 * elements enter this store when earned and leave when no longer
 * relevant.
 */

export type UiBreakpoint = 'compact' | 'regular' | 'wide';

export type UiElementPhase = 'entering' | 'visible' | 'exiting';

interface UiState {
  readonly breakpoint: UiBreakpoint;
  /** Element id → lifecycle phase. Absence means hidden — the default. */
  readonly elements: Readonly<Record<string, UiElementPhase>>;
  readonly setBreakpoint: (breakpoint: UiBreakpoint) => void;
  readonly setElementPhase: (id: string, phase: UiElementPhase) => void;
  readonly removeElement: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  breakpoint: 'regular',
  elements: {},
  setBreakpoint: (breakpoint) => set({ breakpoint }),
  setElementPhase: (id, phase) =>
    set((state) => ({ elements: { ...state.elements, [id]: phase } })),
  removeElement: (id) =>
    set((state) => {
      const next = { ...state.elements };
      delete next[id];
      return { elements: next };
    }),
}));
