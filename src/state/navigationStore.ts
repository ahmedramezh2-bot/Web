import { create } from 'zustand';

/**
 * Navigation shared state — journey progress, velocity, and the
 * navigation machine's mode. The visitor paces, never steers (Camera
 * Bible §10): everything here is pacing state along an authored path,
 * never a steering input.
 */

export type NavigationMode = 'dormant' | 'pacing' | 'yielding' | 'resting';

interface NavigationState {
  /** Damped narrative progress 0..1 across the journey (Camera Bible §10 — one scalar). */
  readonly progress: number;
  /** Progress velocity in progress-units per second (signed — negative = backward pacing). */
  readonly velocity: number;
  readonly mode: NavigationMode;
  /** True once the visitor has given any deliberate input — the dormant→awakening trigger. */
  readonly hasInput: boolean;
  readonly setProgress: (progress: number, velocity: number) => void;
  readonly setMode: (mode: NavigationMode) => void;
  readonly markInput: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  progress: 0,
  velocity: 0,
  mode: 'dormant',
  hasInput: false,
  setProgress: (progress, velocity) => set({ progress, velocity }),
  setMode: (mode) => set({ mode }),
  markInput: () => set({ hasInput: true }),
}));
