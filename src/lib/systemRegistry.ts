import { DependencyResolutionError, SystemInitError } from './errors';
import { createLogger } from './logger';

/**
 * System Registration / Service Registration / Dependency Boundaries.
 *
 * A system is any independent engine module (rendering, quality,
 * audio, camera — one per Development Standards §6's single-
 * responsibility principle) that needs a well-defined init order. The
 * registry never lets two systems' responsibilities blur into each
 * other; it only sequences already-independent units correctly.
 */

const logger = createLogger('SystemRegistry');

/**
 * Yield the main thread between system inits so boot never forms one
 * long task — input stays responsive while the engine assembles.
 * scheduler.yield() where available (MDN: limited availability, its
 * continuations get a boosted-priority queue); MDN's documented
 * setTimeout(0) fallback everywhere else.
 */
async function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) {
    await scheduler.yield();
    return;
  }
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

export interface SystemDefinition<T = unknown> {
  /** Unique, stable id — used in dependency lists and error messages. */
  readonly id: string;
  /** Ids of systems that must be initialized before this one. */
  readonly dependsOn?: readonly string[];
  /** Performs the system's own setup and returns its public handle. */
  readonly init: () => T | Promise<T>;
}

export class SystemRegistry {
  private readonly definitions = new Map<string, SystemDefinition>();
  private readonly instances = new Map<string, unknown>();
  private booted = false;

  /**
   * Register a system. Registration is declarative and order-independent
   * — the registry resolves actual init order from `dependsOn` alone,
   * so registration call order never silently becomes load-bearing.
   */
  public register<T>(definition: SystemDefinition<T>): void {
    if (this.booted) {
      throw new SystemInitError(
        definition.id,
        'cannot register a system after the registry has already booted',
      );
    }
    if (this.definitions.has(definition.id)) {
      throw new SystemInitError(definition.id, 'a system with this id is already registered');
    }
    this.definitions.set(definition.id, definition as SystemDefinition);
  }

  /** Retrieve an already-initialized system's handle, strictly typed by the caller. */
  public get<T>(id: string): T {
    if (!this.instances.has(id)) {
      throw new SystemInitError(id, 'requested before it was initialized');
    }
    return this.instances.get(id) as T;
  }

  public has(id: string): boolean {
    return this.instances.has(id);
  }

  /**
   * Resolve dependency order and initialize every registered system
   * exactly once. Detects circular dependencies and missing
   * dependencies before initializing anything, per Development
   * Standards §2's "prevent circular dependencies" rule — this is a
   * registration-time check, never a runtime surprise.
   */
  public async boot(): Promise<void> {
    if (this.booted) {
      return;
    }

    const order = resolveInitOrder(this.definitions);

    for (const id of order) {
      const definition = this.definitions.get(id);
      if (!definition) {
        // Unreachable given resolveInitOrder only returns known ids,
        // but keeps this loop's typing honest under strict mode.
        continue;
      }
      try {
        logger.debug(`initializing "${id}"`);
        const instance = await definition.init();
        this.instances.set(id, instance);
      } catch (cause) {
        throw new SystemInitError(id, 'init() threw', cause);
      }
      await yieldToMain();
    }

    this.booted = true;
    logger.info('all systems initialized', { count: order.length });
  }

  public isBooted(): boolean {
    return this.booted;
  }
}

/**
 * Topologically sorts registered systems by their declared dependencies.
 * Throws DependencyResolutionError on a missing dependency or a cycle —
 * both are registration bugs, never something the engine should paper
 * over silently.
 */
function resolveInitOrder(definitions: Map<string, SystemDefinition>): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(id: string): void {
    if (visited.has(id)) {
      return;
    }
    if (visiting.has(id)) {
      throw new DependencyResolutionError(
        `circular dependency detected while resolving system "${id}"`,
      );
    }

    const definition = definitions.get(id);
    if (!definition) {
      throw new DependencyResolutionError(
        `system "${id}" is listed as a dependency but was never registered`,
      );
    }

    visiting.add(id);
    for (const dependencyId of definition.dependsOn ?? []) {
      visit(dependencyId);
    }
    visiting.delete(id);

    visited.add(id);
    order.push(id);
  }

  for (const id of definitions.keys()) {
    visit(id);
  }

  return order;
}
