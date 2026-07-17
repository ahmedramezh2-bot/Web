import { createLogger } from '@lib/logger';

/**
 * Performance Monitoring Infrastructure.
 *
 * Frame-time measurement only — no draw-call budgeting, no LOD, no
 * instancing helpers yet (those consume this infrastructure but belong
 * to the systems that actually draw something, none of which exist
 * before M3's Rendering Foundation and beyond). This module's entire
 * job, per Performance Bible §7's Measurement discipline, is to make
 * "measure before optimize" possible — it has no opinion about what a
 * measurement should trigger.
 */

const logger = createLogger('PerformanceMonitor');

export interface FrameSample {
  readonly frameTimeMs: number;
  readonly fps: number;
  readonly timestamp: number;
}

export type FrameSampleListener = (sample: FrameSample) => void;

/**
 * A minimal, dependency-free frame-time monitor. Call `tick()` once per
 * animation frame (the render loop owns calling it — this class never
 * schedules its own frames per Rendering Bible §2's "R3F owns
 * rendering, not direction" principle applied to monitoring too).
 */
export class PerformanceMonitor {
  private lastTimestamp: number | undefined;
  private readonly listeners = new Set<FrameSampleListener>();
  private readonly rollingWindow: number[] = [];
  private readonly rollingWindowSize = 60;

  public subscribe(listener: FrameSampleListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public tick(timestamp: number): void {
    if (this.lastTimestamp === undefined) {
      this.lastTimestamp = timestamp;
      return;
    }

    const frameTimeMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (frameTimeMs <= 0) {
      return;
    }

    this.rollingWindow.push(frameTimeMs);
    if (this.rollingWindow.length > this.rollingWindowSize) {
      this.rollingWindow.shift();
    }

    const sample: FrameSample = {
      frameTimeMs,
      fps: 1000 / frameTimeMs,
      timestamp,
    };

    for (const listener of this.listeners) {
      listener(sample);
    }
  }

  /** Average frame time across the rolling window, or undefined before enough samples exist. */
  public averageFrameTimeMs(): number | undefined {
    if (this.rollingWindow.length === 0) {
      return undefined;
    }
    const sum = this.rollingWindow.reduce((total, value) => total + value, 0);
    return sum / this.rollingWindow.length;
  }

  public reset(): void {
    this.lastTimestamp = undefined;
    this.rollingWindow.length = 0;
  }
}

/**
 * Logs a one-time warning if a frame exceeds the given budget, per
 * Appendix F's frame budgets (8.3ms @ 120fps, 11.1ms @ 90fps, 16.6ms
 * @ 60fps). Intentionally simple — real budget enforcement per quality
 * tier belongs to the Quality system (M3), which owns interpreting
 * these numbers, not producing them.
 */
export function warnOnBudgetExceeded(sample: FrameSample, budgetMs: number): void {
  if (sample.frameTimeMs > budgetMs) {
    logger.warn('frame exceeded budget', {
      frameTimeMs: Math.round(sample.frameTimeMs * 100) / 100,
      budgetMs,
    });
  }
}
