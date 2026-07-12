/**
 * Typed engine-level error hierarchy.
 *
 * Every failure the engine bootstrap can produce is a named class, never
 * a bare `throw new Error(string)` — so an Error Boundary (or a future
 * diagnostics sink) can branch on failure kind instead of parsing text.
 * Uses the native ES2022 `Error.cause` chain rather than a shadowing
 * custom field, so `cause` keeps its built-in semantics.
 */

export class EngineError extends Error {
  public override readonly name: string = 'EngineError';

  public constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    Object.setPrototypeOf(this, EngineError.prototype);
  }
}

/**
 * Thrown when a registered system fails to initialize. Carries the
 * system's id so the Error Boundary and logger can report exactly which
 * module broke the bootstrap sequence.
 */
export class SystemInitError extends EngineError {
  public override readonly name = 'SystemInitError';

  public constructor(
    public readonly systemId: string,
    message: string,
    cause?: unknown,
  ) {
    super(`System "${systemId}" failed to initialize: ${message}`, cause);
    Object.setPrototypeOf(this, SystemInitError.prototype);
  }
}

/**
 * Thrown when the System Registry detects a dependency it cannot
 * resolve — either a missing system or a circular reference. Per
 * Development Standards §2, circular dependencies are never patched
 * around at runtime; they are a registration bug to fix at the source.
 */
export class DependencyResolutionError extends EngineError {
  public override readonly name = 'DependencyResolutionError';

  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DependencyResolutionError.prototype);
  }
}

/**
 * Thrown when runtime configuration fails validation (Configuration
 * Layer). A malformed config fails loud here, never silently deep
 * inside a system that merely consumes it.
 */
export class ConfigValidationError extends EngineError {
  public override readonly name = 'ConfigValidationError';

  public constructor(message: string, cause?: unknown) {
    super(message, cause);
    Object.setPrototypeOf(this, ConfigValidationError.prototype);
  }
}
