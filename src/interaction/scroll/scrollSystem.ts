import Lenis from 'lenis';

import { createLogger } from '@lib/logger';
import { useNavigationStore } from '@state/navigationStore';

/**
 * The scroll abstraction layer — Camera Bible §10 and §15.
 *
 * The browser's scroll event is not page scroll. It is a physical
 * input signal, intercepted by Lenis, that the world consumes as one
 * scalar: narrative progress. Lenis is the metronome; it has no
 * opinion about what the scalar means in 3D space.
 *
 * Implementation note: Lenis needs a scrollable surface to translate
 * wheel/touch physics into a bounded value. The track element this
 * module creates is exactly that — an input transducer, invisible
 * content whose height defines input *resolution*, never a page
 * layout. Nothing in the world is laid out against it, and no
 * consumer beyond this file knows it exists.
 */

const logger = createLogger('ScrollSystem');

/** Track length in viewport-heights — input resolution per journey, not page length. Provisional pending feel review. */
const TRACK_LENGTH_VH = 800;

/** Touch travel is heavier to start, slower to stop than wheel (Camera Bible §13) — expressed through Lenis's own documented multipliers. */
const WHEEL_MULTIPLIER = 1;
const TOUCH_MULTIPLIER = 1.35;

/** Lenis lerp — the first smoothing stage; WorldProgress adds the second. Provisional. */
const LENIS_LERP = 0.09;

export interface ScrollSystemHandle {
  /** Latest normalized scroll progress 0..1 straight from Lenis. */
  readonly getProgress: () => number;
  readonly dispose: () => void;
}

export function initScrollSystem(): ScrollSystemHandle {
  const wrapper = document.createElement('div');
  wrapper.className = 'hebra-scroll-track';
  wrapper.setAttribute('aria-hidden', 'true');

  const content = document.createElement('div');
  content.className = 'hebra-scroll-track-content';
  content.style.height = `${TRACK_LENGTH_VH}vh`;

  wrapper.appendChild(content);
  document.body.appendChild(wrapper);

  const lenis = new Lenis({
    wrapper,
    content,
    smoothWheel: true,
    syncTouch: true,
    wheelMultiplier: WHEEL_MULTIPLIER,
    touchMultiplier: TOUCH_MULTIPLIER,
    lerp: LENIS_LERP,
  });

  let progress = 0;
  let sawInput = false;

  lenis.on('scroll', (instance: Lenis) => {
    progress = instance.limit > 0 ? instance.scroll / instance.limit : 0;
    if (!sawInput && instance.scroll > 0.5) {
      sawInput = true;
      useNavigationStore.getState().markInput();
    }
  });

  let rafId = 0;
  const raf = (time: number): void => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  logger.info('scroll system initialized', { trackLengthVh: TRACK_LENGTH_VH });

  return {
    getProgress: () => progress,
    dispose: () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      wrapper.remove();
    },
  };
}
