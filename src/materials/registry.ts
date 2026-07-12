/**
 * Material registry — one responsibility: give every living material
 * a heartbeat without every component owning a clock.
 *
 * Materials whose shaders carry a `uTime` uniform register here once;
 * the World advances them all from a single useFrame. No component
 * ever touches another component's material.
 */

type TickTarget = { value: number };

const clocks = new Set<TickTarget>();

export function registerClock(uniform: TickTarget): () => void {
  clocks.add(uniform);
  return () => clocks.delete(uniform);
}

export function tickMaterials(elapsed: number): void {
  clocks.forEach((u) => {
    u.value = elapsed;
  });
}
