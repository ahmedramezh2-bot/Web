import { create } from 'zustand';

/**
 * The presence signal — the visitor's quiet, ambient attention,
 * normalized to one shape regardless of input source (mouse position,
 * touch pressure, gyroscope tilt). Camera Hierarchy level 3: additive
 * gaze influence only, never travel-path authority (Camera Bible §5,
 * §12–13, §22).
 */

export type PresenceSource = 'mouse' | 'touch' | 'gyroscope' | 'none';

interface PresenceState {
  /** Normalized horizontal attention, -1..1. */
  readonly x: number;
  /** Normalized vertical attention, -1..1. */
  readonly y: number;
  /** Signal strength 0..1 — mouse presence is binary-ish; touch pressure builds with hold duration (Camera Bible §13). */
  readonly strength: number;
  readonly source: PresenceSource;
  readonly setSignal: (x: number, y: number, strength: number, source: PresenceSource) => void;
  readonly clear: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  x: 0,
  y: 0,
  strength: 0,
  source: 'none',
  setSignal: (x, y, strength, source) => set({ x, y, strength, source }),
  clear: () => set({ x: 0, y: 0, strength: 0, source: 'none' }),
}));
