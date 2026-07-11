/**
 * React bridge to PointerSystem — the visitor's presence as a ref,
 * render-free by design.
 */

import { useEffect, useRef } from 'react';
import { PointerSystem, type PresenceSignal } from '@/systems/input/PointerSystem';

export function usePresence(onSignal?: (signal: PresenceSignal) => void) {
  const presenceRef = useRef<PresenceSignal>(PointerSystem.current());

  useEffect(() => {
    return PointerSystem.subscribe((signal) => {
      presenceRef.current = signal;
      onSignal?.(signal);
    });
  }, [onSignal]);

  return presenceRef;
}
