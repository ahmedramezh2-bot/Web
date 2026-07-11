/**
 * PointerSystem — one responsibility: the visitor's presence.
 *
 * Desktop mouse, touch pressure and (where freely granted) device
 * orientation are folded into one normalized consciousness signal:
 *
 *   { x, y ∈ -1..1, speed, mode }
 *
 * Consumers never read raw DOM events; they subscribe here. This is
 * what lets "the universe notice the visitor" consistently across
 * camera, light, particles and typography.
 */

export type PointerMode = 'mouse' | 'touch' | 'gyro';

export interface PresenceSignal {
  x: number;
  y: number;
  speed: number;
  mode: PointerMode;
}

type Listener = (signal: PresenceSignal) => void;

class PointerSystemImpl {
  private listeners = new Set<Listener>();
  private signal: PresenceSignal = { x: 0, y: 0, speed: 0, mode: 'mouse' };
  private last = { x: 0, y: 0, t: 0 };
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;

    window.addEventListener(
      'pointermove',
      (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        const now = performance.now();
        const dt = Math.max(1, now - this.last.t);
        const speed = Math.min(
          1,
          (Math.hypot(x - this.last.x, y - this.last.y) / dt) * 900,
        );
        this.last = { x, y, t: now };
        this.emit({ x, y, speed, mode: e.pointerType === 'touch' ? 'touch' : 'mouse' });
      },
      { passive: true },
    );

    // Gyroscope parallax only where the platform grants it silently.
    window.addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma == null || e.beta == null) return;
        this.emit({
          x: Math.max(-1, Math.min(1, e.gamma / 32)),
          y: Math.max(-1, Math.min(1, (e.beta - 42) / 36)),
          speed: 0,
          mode: 'gyro',
        });
      },
      { passive: true },
    );
  }

  private emit(signal: PresenceSignal): void {
    this.signal = signal;
    this.listeners.forEach((l) => l(signal));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  current(): PresenceSignal {
    return this.signal;
  }
}

export const PointerSystem = new PointerSystemImpl();
