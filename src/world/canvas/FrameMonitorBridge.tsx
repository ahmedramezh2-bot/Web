'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

import { PerformanceMonitor, warnOnBudgetExceeded } from '@performance/monitor';
import type { QualityTierProfile } from '@quality/tiers';

/**
 * Render Loop Architecture — the bridge between R3F's own `useFrame`
 * scheduling and the engine's Performance Monitor. Owns no rendering
 * itself; it only samples the loop R3F already runs, per Rendering
 * Bible §2's "R3F owns rendering, not direction" — this component
 * directs nothing, it only measures.
 */
const BUDGET_WARNING_THROTTLE_MS = 5000;

export function FrameMonitorBridge({ tierProfile }: { tierProfile: QualityTierProfile }) {
  const monitorRef = useRef<PerformanceMonitor | undefined>(undefined);
  const lastWarningRef = useRef(0);

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor();
    return () => {
      monitorRef.current?.reset();
      monitorRef.current = undefined;
    };
  }, []);

  useFrame((state) => {
    const monitor = monitorRef.current;
    if (!monitor) {
      return;
    }
    const nowMs = state.clock.elapsedTime * 1000;
    monitor.tick(nowMs);
    const average = monitor.averageFrameTimeMs();
    if (average === undefined) {
      return;
    }
    if (
      average > tierProfile.frameBudgetMs &&
      nowMs - lastWarningRef.current > BUDGET_WARNING_THROTTLE_MS
    ) {
      lastWarningRef.current = nowMs;
      warnOnBudgetExceeded(
        { frameTimeMs: average, fps: 1000 / average, timestamp: nowMs },
        tierProfile.frameBudgetMs,
      );
    }
  });

  return null;
}
