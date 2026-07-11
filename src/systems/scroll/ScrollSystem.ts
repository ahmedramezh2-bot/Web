/**
 * ScrollSystem — one responsibility: movement through the universe.
 *
 * Lenis owns physical scrolling; GSAP's ticker drives Lenis's RAF so
 * the whole experience shares a single clock (Creative Bible:
 * Engineering — never two systems solving one problem). ScrollTrigger
 * is synchronized here and nowhere else.
 *
 * Everything downstream consumes the normalized signal:
 *   { position, velocity, progress }
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL } from '@/config/constants';
import { getQuality } from '@/systems/performance/QualitySystem';

export interface ScrollSignal {
  position: number;
  velocity: number;
  progress: number; // 0..1 through the whole journey
}

type Listener = (signal: ScrollSignal) => void;

class ScrollSystemImpl {
  private lenis: Lenis | null = null;
  private listeners = new Set<Listener>();
  private signal: ScrollSignal = { position: 0, velocity: 0, progress: 0 };
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    gsap.registerPlugin(ScrollTrigger);

    if (getQuality().reducedMotion) {
      // The dimension holds still: native scrolling, no inertia,
      // but the same signal contract for every consumer.
      window.addEventListener(
        'scroll',
        () => this.emit(window.scrollY, 0),
        { passive: true },
      );
      return;
    }

    this.lenis = new Lenis({
      duration: SCROLL.duration,
      wheelMultiplier: SCROLL.wheelMultiplier,
      touchMultiplier: SCROLL.touchMultiplier,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    this.lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
      ScrollTrigger.update();
      this.emit(e.scroll, e.velocity);
    });

    // One clock: GSAP's ticker drives Lenis.
    gsap.ticker.add((time) => this.lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  private emit(position: number, velocity: number): void {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.signal = { position, velocity, progress: Math.min(1, position / max) };
    this.listeners.forEach((l) => l(this.signal));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  current(): ScrollSignal {
    return this.signal;
  }

  /** Cinematic navigation — anchors ride the same physics. */
  travelTo(target: string | number, duration = 1.8): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, { duration });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView();
    } else {
      window.scrollTo(0, target);
    }
  }

  /** The world can hold its breath (menus, modal moments). */
  hold(): void {
    this.lenis?.stop();
  }

  release(): void {
    this.lenis?.start();
  }
}

export const ScrollSystem = new ScrollSystemImpl();
