/**
 * Motion primitives — GSAP's domain: interface micro-motion only.
 * Cinematic sequences belong to Theatre (src/story), never here.
 *
 * The house eases are registered once; every UI transition speaks
 * the same dialect (Creative Bible: Motion — no generic easing).
 */

import { gsap } from 'gsap';

let registered = false;

export function registerMotionLanguage(): void {
  if (registered) return;
  registered = true;
  // Gentle arrival, long settle — nothing bounces in this universe.
  gsap.registerEase('hebra.emerge', (p: number) => 1 - Math.pow(1 - p, 4));
  gsap.registerEase('hebra.dissolve', (p: number) => p * p * (3 - 2 * p));
  gsap.defaults({ ease: 'hebra.emerge', duration: 1.2 });
}

/** Everything emerges; nothing appears (Creative Bible: Storytelling). */
export function emerge(target: gsap.TweenTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 28, filter: 'blur(10px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', ...vars },
  );
}

/** Everything dissolves; nothing disappears abruptly. */
export function dissolve(target: gsap.TweenTarget, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.to(target, {
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.9,
    ease: 'hebra.dissolve',
    ...vars,
  });
}
