import { z } from 'zod';

import { ConfigValidationError } from './errors';

/**
 * Configuration Layer.
 *
 * The single, validated source of runtime configuration. Nothing else
 * in the engine reads `process.env` directly — every value passes
 * through this schema once, at bootstrap, so a malformed environment
 * fails loud here instead of producing a confusing failure three
 * systems downstream.
 */

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export type EngineConfig = Readonly<{
  environment: 'development' | 'production' | 'test';
  appEnvironment: 'development' | 'staging' | 'production';
  isProduction: boolean;
}>;

let cachedConfig: EngineConfig | undefined;

/**
 * Load and validate configuration once, then reuse the cached result.
 * Never re-parses `process.env` per call — configuration is fixed for
 * the lifetime of a running process, per the Configuration Layer's own
 * single-source-of-truth mandate (Design Token Bible §1's principle,
 * applied here to runtime config rather than design values).
 */
export function loadConfig(): EngineConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const parsed = environmentSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });

  if (!parsed.success) {
    throw new ConfigValidationError(
      `Environment configuration failed validation: ${parsed.error.message}`,
      parsed.error,
    );
  }

  cachedConfig = {
    environment: parsed.data.NODE_ENV,
    appEnvironment: parsed.data.NEXT_PUBLIC_APP_ENV,
    isProduction: parsed.data.NODE_ENV === 'production',
  };

  return cachedConfig;
}

/**
 * Test-only escape hatch — never called from production code paths.
 * Exists so a future Testing Framework (Development Standards §8) can
 * exercise config-dependent systems under different environments
 * without process-level env mutation.
 */
export function resetConfigCache(): void {
  cachedConfig = undefined;
}
