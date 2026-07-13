/**
 * Generic typed event emitter — the one pub/sub primitive the story
 * and world dispatchers both build on, so event plumbing is written
 * once (Development Standards §6: never duplicate logic).
 *
 * Deliberately synchronous and allocation-light: emit iterates a Set,
 * no queues, no microtasks — narrative and world events fire inside
 * the frame that caused them, keeping cause and effect on one clock.
 */

export type EventMap = Record<string, unknown>;

export class TypedEmitter<TEvents extends EventMap> {
  private readonly listeners = new Map<keyof TEvents, Set<(payload: never) => void>>();

  public on<K extends keyof TEvents>(
    event: K,
    listener: (payload: TEvents[K]) => void,
  ): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as (payload: never) => void);
    return () => {
      set.delete(listener as (payload: never) => void);
    };
  }

  public emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const set = this.listeners.get(event);
    if (!set) {
      return;
    }
    for (const listener of set) {
      (listener as (payload: TEvents[K]) => void)(payload);
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
