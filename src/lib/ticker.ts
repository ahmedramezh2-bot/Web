/**
 * The shared frame ticker — one requestAnimationFrame loop for every
 * non-render system (navigation, story, world time). R3F owns its own
 * loop inside the canvas; everything outside it shares this one, so
 * the app never accumulates parallel rAF loops as systems grow.
 *
 * Starts lazily with the first subscriber, stops with the last —
 * an idle page schedules no frames.
 */

export type TickListener = (deltaSeconds: number, timeMs: number) => void;

/** Delta clamp — a backgrounded tab's first frame back must not lurch (same bound the camera bridge applies). */
const MAX_DELTA_SECONDS = 0.1;

export class Ticker {
  private readonly listeners = new Set<TickListener>();
  private rafId = 0;
  private running = false;
  private lastTime = 0;

  public add(listener: TickListener): () => void {
    this.listeners.add(listener);
    if (!this.running) {
      this.start();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  }

  private start(): void {
    this.running = true;
    this.lastTime = performance.now();
    const frame = (timeMs: number): void => {
      if (!this.running) {
        return;
      }
      const deltaSeconds = Math.min((timeMs - this.lastTime) / 1000, MAX_DELTA_SECONDS);
      this.lastTime = timeMs;
      for (const listener of this.listeners) {
        listener(deltaSeconds, timeMs);
      }
      this.rafId = requestAnimationFrame(frame);
    };
    this.rafId = requestAnimationFrame(frame);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }
}

/** The application-wide shared ticker instance. */
export const sharedTicker = new Ticker();
