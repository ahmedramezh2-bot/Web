/**
 * HEBRA — world constants.
 * One source of truth; no magic numbers scattered through systems.
 */

/** The palette, mirrored from tokens.css for WebGL use. */
export const PALETTE = {
  void: '#030304',
  white: '#f2f2f5',
  silver: '#9a9da8',
  coldBlue: '#6f8bdf',
  gold: '#c8a24a',
} as const;

/** Theatre.js project + sheet names. Stable IDs — saved states depend on them. */
export const STORY = {
  project: 'HEBRA',
  journeySheet: 'Journey',
} as const;

/** Lenis tuning: heavy, physical, never floaty. */
export const SCROLL = {
  duration: 1.35,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.4,
} as const;

/** Global z-layers so systems never fight over stacking. */
export const LAYERS = {
  stage: 0,
  surface: 1,
  veil: 90,
  devHud: 99,
} as const;
