/**
 * World Time Foundation — the world's own clock, distinct from wall
 * time and from any single animation's clock.
 *
 * Lighting evolution (Lighting Bible §9's breathing/expansion/rest
 * arcs), audio evolution (Audio Production Bible §9's world
 * evolution), and idle world behaviors all read this one clock, so
 * "the world's age this session" has exactly one answer. Pausable and
 * scalable for authored moments; read imperatively (a per-frame store
 * write would tax every subscriber for a value most systems sample
 * on their own schedule).
 */

export class WorldClock {
  private elapsed = 0;
  private scale = 1;
  private paused = false;

  /** Advance by real delta seconds — called once per shared-ticker frame by the world engine. */
  public advance(deltaSeconds: number): void {
    if (!this.paused) {
      this.elapsed += deltaSeconds * this.scale;
    }
  }

  /** World-seconds elapsed this session. */
  public now(): number {
    return this.elapsed;
  }

  public setScale(scale: number): void {
    this.scale = Math.max(0, scale);
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
  }

  public get isPaused(): boolean {
    return this.paused;
  }
}
