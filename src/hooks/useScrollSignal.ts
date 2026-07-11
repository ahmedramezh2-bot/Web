/**
 * React bridge to ScrollSystem. Components receive the signal through
 * a ref + optional rAF-safe callback — never through setState, so
 * scrolling never causes React renders.
 */

import { useEffect, useRef } from 'react';
import { ScrollSystem, type ScrollSignal } from '@/systems/scroll/ScrollSystem';

export function useScrollSignal(onSignal?: (signal: ScrollSignal) => void) {
  const signalRef = useRef<ScrollSignal>(ScrollSystem.current());

  useEffect(() => {
    return ScrollSystem.subscribe((signal) => {
      signalRef.current = signal;
      onSignal?.(signal);
    });
  }, [onSignal]);

  return signalRef;
}
