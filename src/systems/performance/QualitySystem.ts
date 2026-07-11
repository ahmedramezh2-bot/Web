/**
 * QualitySystem — one responsibility: decide how much universe this
 * device can hold, before anything renders.
 *
 * Tiers:
 *  - cinema     desktop-class GPU, fine pointer: full post pipeline,
 *               full particle budgets, DPR up to 2
 *  - balanced   capable touch devices: trimmed budgets, DPR ≤ 1.75
 *  - essential  constrained devices / reduced-motion: static-leaning
 *               presentation, DPR 1, post disabled
 *
 * The tier is decided once at boot (cheap heuristics, no benchmark
 * stutter) and exposed as a frozen object. Systems read it; nothing
 * mutates it.
 */

export type QualityTier = 'cinema' | 'balanced' | 'essential';

export interface QualityProfile {
  tier: QualityTier;
  dprMax: number;
  postProcessing: boolean;
  particleBudget: number;
  reducedMotion: boolean;
  finePointer: boolean;
}

function detectTier(): QualityProfile {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 480;

  if (reducedMotion || memory <= 2 || cores <= 2) {
    return {
      tier: 'essential',
      dprMax: 1,
      postProcessing: false,
      particleBudget: 400,
      reducedMotion,
      finePointer,
    };
  }

  if (!finePointer || smallScreen || memory <= 4) {
    return {
      tier: 'balanced',
      dprMax: 1.75,
      postProcessing: true,
      particleBudget: 1600,
      reducedMotion,
      finePointer,
    };
  }

  return {
    tier: 'cinema',
    dprMax: 2,
    postProcessing: true,
    particleBudget: 4000,
    reducedMotion,
    finePointer,
  };
}

let profile: QualityProfile | null = null;

export function getQuality(): QualityProfile {
  if (!profile) profile = Object.freeze(detectTier());
  return profile;
}
