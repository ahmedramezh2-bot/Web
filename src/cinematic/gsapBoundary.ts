/**
 * The GSAP runtime boundary — Development Standards §6, enforced at
 * the import level.
 *
 * GSAP owns UI motion only: typography, panels, interface transitions,
 * micro animations. It never competes with Theatre.js for cinematic
 * direction and never touches world-camera transform (Camera Bible
 * §15). This module is the ONLY sanctioned way to reach GSAP — a
 * lazy, code-split loader, so GSAP's weight stays out of the initial
 * bundle (Appendix F) and out of every world-side chunk that has no
 * business importing it. Direct `import 'gsap'` anywhere else in the
 * codebase is a Development Standards violation by definition.
 */

type GsapModule = typeof import('gsap');

let loading: Promise<GsapModule['gsap']> | undefined;

/** Load GSAP for UI-layer motion. Callers are UI components only. */
export async function loadUiMotion(): Promise<GsapModule['gsap']> {
  loading ??= import('gsap').then((module) => module.gsap);
  return loading;
}
