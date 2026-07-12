import * as THREE from 'three';
import type { WebGLRenderer } from 'three';

import type { QualityTierProfile } from '@quality/tiers';

/**
 * Rendering Configuration / Color Management / ACES Tone Mapping / HDR
 * preparation.
 *
 * Implements Rendering Bible §2's pipeline ordering at the renderer
 * level: linear working space, ACES-informed tone mapping, correct
 * output color space. No post-processing, no lighting, no scene
 * content is configured here — this module's only job is making sure
 * the renderer itself is honest about color before anything is drawn
 * into it, per Rendering Bible §1's "rendering is honest, it adds no
 * opinion" philosophy.
 */

export interface RendererConfig {
  readonly toneMapping: THREE.ToneMapping;
  readonly toneMappingExposure: number;
  readonly outputColorSpace: THREE.ColorSpace;
  readonly antialias: boolean;
  readonly powerPreference: WebGLPowerPreference;
}

/**
 * Base configuration shared by every quality tier — color management
 * and tone mapping are foundational per Rendering Bible §1's Hierarchy
 * rule and are never varied per-tier; only cost-side parameters
 * (antialias, pixel ratio — applied separately by the Canvas) change.
 */
export const BASE_RENDERER_CONFIG: RendererConfig = {
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1,
  outputColorSpace: THREE.SRGBColorSpace,
  antialias: true,
  powerPreference: 'high-performance',
};

/**
 * Applies the base renderer configuration to a live WebGLRenderer
 * instance. Called once, from the Canvas's `onCreated` — never
 * reapplied per frame, since none of these values change after the
 * renderer exists.
 */
export function configureRenderer(renderer: WebGLRenderer, tier: QualityTierProfile): void {
  renderer.toneMapping = BASE_RENDERER_CONFIG.toneMapping;
  renderer.toneMappingExposure = BASE_RENDERER_CONFIG.toneMappingExposure;
  renderer.outputColorSpace = BASE_RENDERER_CONFIG.outputColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.maxPixelRatio));
}
