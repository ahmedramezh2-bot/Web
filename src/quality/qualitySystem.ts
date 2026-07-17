import { createLogger } from '@lib/logger';
import { useQualityStore } from '@state/qualityStore';

import { classifyStartingTier, readCapabilitySnapshot, type QualityTier } from './tiers';

/**
 * Rendering Quality Manager / Adaptive Quality Detection.
 *
 * A registerable engine system (see src/lib/systemRegistry.ts) that
 * measures device capability once at boot and publishes a starting
 * quality tier. Registered with no dependencies so it can initialize
 * in parallel with anything else — quality classification does not
 * need the renderer to exist first, only `navigator`/`document`.
 */

const logger = createLogger('QualitySystem');

export interface QualitySystemHandle {
  readonly tier: QualityTier;
}

export function initQualitySystem(): QualitySystemHandle {
  const snapshot = readCapabilitySnapshot();
  const tier = classifyStartingTier(snapshot);

  useQualityStore.getState().setTier(tier);
  logger.info('starting quality tier classified', { tier, snapshot });

  return { tier };
}
