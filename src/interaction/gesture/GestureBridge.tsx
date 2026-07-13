'use client';

import { useGesture } from '@use-gesture/react';
import { useEffect, useRef } from 'react';

import { useNavigationStore } from '@state/navigationStore';

/**
 * Gesture normalization — the @use-gesture layer that reads deliberate
 * drag gestures as navigation intent (Camera Bible §13: deliberate
 * swipes are a Yielding-state signal, never a steering signal).
 *
 * Observation-only by design: Lenis owns wheel/touch scroll physics;
 * this bridge only *recognizes* gesture character (deliberateness,
 * direction) and reports it. It prevents no defaults and competes
 * with no other input system.
 */

/** Drag velocity (px/ms, per @use-gesture's velocity units) that reads as deliberate. Provisional pending feel review. */
const DELIBERATE_DRAG_VELOCITY = 1.4;

export function GestureBridge() {
  // The gesture target must exist at bind time; window only exists on
  // the client, so binding waits for mount via a ref-populated effect.
  const targetRef = useRef<Window | null>(null);

  useEffect(() => {
    targetRef.current = window;
  }, []);

  useGesture(
    {
      onDrag: ({ velocity: [, vy], last }) => {
        if (last) {
          return;
        }
        if (Math.abs(vy) >= DELIBERATE_DRAG_VELOCITY) {
          useNavigationStore.getState().markInput();
        }
      },
      onWheel: () => {
        useNavigationStore.getState().markInput();
      },
    },
    {
      target: targetRef,
      eventOptions: { passive: true },
    },
  );

  return null;
}
