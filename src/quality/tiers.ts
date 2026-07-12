/**
 * Adaptive quality-tier system.
 *
 * Cinema / Balanced / Essential — HEBRA's naming for Appendix F's Tier
 * A/B/C (Performance Bible §3). Tiers are capability-measured, never a
 * device-type branch: this module never asks "is this mobile," only
 * "what can this GPU/CPU actually sustain." Camera behavior, world
 * layout, and story content are identical across every tier per
 * Performance Bible §3 — only render cost changes, and this module
 * decides render cost alone.
 */

export type QualityTier = 'cinema' | 'balanced' | 'essential';

export interface QualityCapabilitySnapshot {
  readonly hardwareConcurrency: number;
  readonly deviceMemoryGb: number | undefined;
  readonly maxTextureSize: number | undefined;
  readonly maxAnisotropy: number | undefined;
  readonly hasFloatTextures: boolean;
}

export interface QualityTierProfile {
  readonly tier: QualityTier;
  /** Frame budget in milliseconds this tier targets, per Appendix F. */
  readonly frameBudgetMs: number;
  /** Device pixel ratio ceiling — the first, cheapest lever to pull under load. */
  readonly maxPixelRatio: number;
}

export const QUALITY_TIER_PROFILES: Readonly<Record<QualityTier, QualityTierProfile>> = {
  cinema: { tier: 'cinema', frameBudgetMs: 8.3, maxPixelRatio: 2 },
  balanced: { tier: 'balanced', frameBudgetMs: 11.1, maxPixelRatio: 1.5 },
  essential: { tier: 'essential', frameBudgetMs: 16.6, maxPixelRatio: 1 },
};

/**
 * Reads what the current device can report about itself, with no
 * assumption about what kind of device it is. Every field is optional
 * except `hardwareConcurrency` because not every browser exposes the
 * rest — the classifier below degrades gracefully when a field is
 * missing rather than guessing.
 */
export function readCapabilitySnapshot(): QualityCapabilitySnapshot {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const deviceMemoryGb = (nav as { deviceMemory?: number } | undefined)?.deviceMemory;

  let maxTextureSize: number | undefined;
  let maxAnisotropy: number | undefined;
  let hasFloatTextures = false;

  if (typeof document !== 'undefined') {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const anisotropyExt =
        gl.getExtension('EXT_texture_filter_anisotropic') ??
        gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
      if (anisotropyExt) {
        maxAnisotropy = gl.getParameter(anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      }
      hasFloatTextures = Boolean(
        gl.getExtension('OES_texture_float') ?? gl.getExtension('EXT_color_buffer_float'),
      );
    }
  }

  return {
    hardwareConcurrency: nav?.hardwareConcurrency ?? 4,
    deviceMemoryGb,
    maxTextureSize,
    maxAnisotropy,
    hasFloatTextures,
  };
}

/**
 * Classifies a capability snapshot into a starting tier. This is a
 * one-time, boot-time estimate — the tier is expected to be revised
 * downward at runtime once real frame-time measurements exist (per
 * Performance Bible §1's "measure before optimize" rule and the
 * Shader Bible §6's identical stance on not inventing numbers before
 * there's something real to measure). No thresholds here are final;
 * they are a conservative starting point, logged as such.
 */
export function classifyStartingTier(snapshot: QualityCapabilitySnapshot): QualityTier {
  const lowMemory = snapshot.deviceMemoryGb !== undefined && snapshot.deviceMemoryGb <= 2;
  const lowCores = snapshot.hardwareConcurrency <= 2;
  const smallTextures = snapshot.maxTextureSize !== undefined && snapshot.maxTextureSize < 4096;

  if (lowMemory || lowCores || smallTextures || !snapshot.hasFloatTextures) {
    return 'essential';
  }

  const highMemory = snapshot.deviceMemoryGb === undefined || snapshot.deviceMemoryGb >= 8;
  const highCores = snapshot.hardwareConcurrency >= 8;
  const largeTextures = snapshot.maxTextureSize !== undefined && snapshot.maxTextureSize >= 8192;

  if (highMemory && highCores && largeTextures) {
    return 'cinema';
  }

  return 'balanced';
}
