import { create } from 'zustand';

import type { CameraState } from '@camera/states';

/**
 * Camera shared state — the machine's current state and the reduced-
 * motion flag, published for any system that must react to them (UI
 * later, audio mix per Audio Production Bible §8). Pure shared state,
 * never camera logic — the rig owns behavior; this store only reports.
 */

interface CameraSharedState {
  readonly cameraState: CameraState;
  readonly reducedMotion: boolean;
  readonly setCameraState: (state: CameraState) => void;
  readonly setReducedMotion: (reduced: boolean) => void;
}

export const useCameraStore = create<CameraSharedState>((set) => ({
  cameraState: 'dormant',
  reducedMotion: false,
  setCameraState: (cameraState) => set({ cameraState }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
