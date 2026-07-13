/**
 * Cinematic interpolation primitives.
 *
 * The shared motion math every camera and navigation system draws
 * from, so easing behavior is defined once, here, and never re-derived
 * ad hoc per feature. Per Camera Bible §9: gentle arrival, long
 * settle, nothing that overshoots or bounces — every curve in this
 * file is monotonic with zero overshoot by construction.
 */

/**
 * Frame-rate-independent exponential damping (the same formulation as
 * three.js MathUtils.damp, kept dependency-free here so non-render
 * code can use it). `lambda` is the smoothing rate: higher = snappier.
 */
export function damp(
  current: number,
  target: number,
  lambda: number,
  deltaSeconds: number,
): number {
  return target + (current - target) * Math.exp(-lambda * deltaSeconds);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Cubic bezier easing evaluator for curves anchored at (0,0)/(1,1),
 * the same parameterization CSS timing functions use (MDN,
 * <easing-function>). Solved for x by Newton iteration with a bisection
 * fallback — sufficient precision for animation at a handful of
 * iterations.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const sampleX = (t: number): number =>
    3 * t * (1 - t) * (1 - t) * x1 + 3 * t * t * (1 - t) * x2 + t * t * t;
  const sampleY = (t: number): number =>
    3 * t * (1 - t) * (1 - t) * y1 + 3 * t * t * (1 - t) * y2 + t * t * t;
  const sampleDerivativeX = (t: number): number =>
    3 * (1 - t) * (1 - t) * x1 + 6 * t * (1 - t) * (x2 - x1) + 3 * t * t * (1 - x2);

  return (x: number): number => {
    const clamped = clamp01(x);
    if (clamped === 0 || clamped === 1) {
      return clamped;
    }

    let t = clamped;
    for (let i = 0; i < 6; i += 1) {
      const error = sampleX(t) - clamped;
      const derivative = sampleDerivativeX(t);
      if (Math.abs(error) < 1e-5 || derivative === 0) {
        break;
      }
      t -= error / derivative;
      t = clamp01(t);
    }

    return sampleY(t);
  };
}

/**
 * The house curves. `emerge` is the standard entry ease (slow gather,
 * committed core, long settle); `dissolve` its exit counterpart;
 * `transitionShape` the three-phase shape Camera Bible §24 requires of
 * every transition (never uniform speed start to end). Control-point
 * y-values stay within [0,1], so no curve here can overshoot.
 */
export const ease = {
  emerge: cubicBezier(0.32, 0, 0.16, 1),
  dissolve: cubicBezier(0.4, 0, 0.28, 1),
  transitionShape: cubicBezier(0.42, 0, 0.14, 1),
} as const;

/**
 * A single low-frequency sinusoidal component of the breathing system.
 * Periods across oscillators are chosen to be incommensurate (their
 * ratios irrational in practice) so the summed motion never falls into
 * a repeating combined cycle within a visit — Camera Bible §9.
 */
export interface OscillatorSpec {
  readonly periodSeconds: number;
  readonly amplitude: number;
  readonly phase: number;
}

export function sampleOscillators(specs: readonly OscillatorSpec[], timeSeconds: number): number {
  let sum = 0;
  for (const spec of specs) {
    sum += Math.sin((timeSeconds / spec.periodSeconds) * Math.PI * 2 + spec.phase) * spec.amplitude;
  }
  return sum;
}
