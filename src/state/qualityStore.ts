import { create } from 'zustand';

import type { QualityTier } from '@quality/tiers';

/**
 * Quality tier state — separate from engineStore's boot lifecycle
 * because quality can change many times over a session (once dynamic,
 * measurement-driven downgrades are wired in) while engine lifecycle
 * status changes at most a few times. One store, one responsibility,
 * per Development Standards §6.
 */

interface QualityState {
  readonly tier: QualityTier | undefined;
  readonly setTier: (tier: QualityTier) => void;
}

export const useQualityStore = create<QualityState>((set) => ({
  tier: undefined,
  setTier: (tier) => set({ tier }),
}));
