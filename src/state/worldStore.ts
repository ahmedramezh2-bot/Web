import { create } from 'zustand';

/**
 * World shared state — the spatial facts other systems render against.
 * Region membership changes at narrative pace (seconds/minutes), never
 * per frame, so store updates stay proportional to real spatial
 * moments.
 */

interface WorldState {
  readonly activeRegionId: string;
  readonly loadedRegionIds: readonly string[];
  readonly setActiveRegion: (regionId: string) => void;
  readonly setLoadedRegions: (regionIds: readonly string[]) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  activeRegionId: 'starfield-reach',
  loadedRegionIds: [],
  setActiveRegion: (activeRegionId) => set({ activeRegionId }),
  setLoadedRegions: (loadedRegionIds) => set({ loadedRegionIds }),
}));
