import { AmbientLight, DirectionalLight, Group, type Light } from 'three';

import { createLogger } from '@lib/logger';
import { damp } from '@lib/motion';
import type { QualityTier } from '@quality/tiers';

/**
 * The Lighting System — the reusable infrastructure the Lighting Bible
 * runs on. Controllers and budgets only: no scene is lit here, no
 * Light Identity is authored here. What exists is the machinery an
 * authored lighting setup (Phase H) plugs values into.
 *
 * Budget enforcement is this module's sharpest duty: Appendix F caps
 * realtime shadow casters (desktop 6 / mobile 2), read here through
 * quality tiers. A light registered beyond budget keeps its light and
 * loses its shadow — loudly, at registration, never as a silent
 * mid-frame surprise.
 */

const logger = createLogger('LightingSystem');

/** Shadow-caster ceilings per tier — Appendix F's desktop 6 / mobile 2, with Balanced between. Provisional mapping, tier-measured never device-assumed. */
const SHADOW_CASTER_BUDGET: Readonly<Record<QualityTier, number>> = {
  cinema: 6,
  balanced: 4,
  essential: 2,
};

/** Exposure eases between authored values — Lighting Bible §9: light evolves, never snaps. */
const EXPOSURE_DAMP_LAMBDA = 1.6;

/**
 * Kelvin → linear RGB approximation (Planckian locus fit) — the Color
 * Temperature System's single conversion point, so "warm" and "cold"
 * (Lighting Bible §4) are physical values everywhere, never ad hoc
 * hex picks.
 */
export function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const t = Math.min(Math.max(kelvin, 1000), 40000) / 100;
  let r: number;
  let g: number;
  let b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }

  const clamp255 = (value: number): number => Math.min(255, Math.max(0, value)) / 255;
  return { r: clamp255(r), g: clamp255(g), b: clamp255(b) };
}

export interface LightingSystemHandle {
  /** All managed lights parent here; the R3F scene mounts it once. */
  readonly lightsRoot: Group;
  readonly sun: DirectionalLight;
  readonly ambient: AmbientLight;
  /** Register a local light against the shadow budget. Returns an unregister. */
  readonly registerLight: (light: Light, wantsShadow: boolean) => () => void;
  /** Authored exposure target — eased toward, per Lighting Bible §9. */
  readonly setExposureTarget: (exposure: number) => void;
  /** Advance eased values; returns the exposure the renderer bridge applies this frame. */
  readonly update: (deltaSeconds: number) => number;
  readonly setQualityTier: (tier: QualityTier) => void;
  readonly dispose: () => void;
}

export function initLightingSystem(initialTier: QualityTier): LightingSystemHandle {
  const lightsRoot = new Group();
  lightsRoot.name = 'hebra-lights-root';

  // The two global controllers exist from boot with neutral, near-dark
  // defaults — HEBRA's darkness is never zero (Lighting Bible §3), and
  // authored setups raise these, never create their own globals.
  const ambient = new AmbientLight(0xffffff, 0.02);
  ambient.name = 'global-ambient';
  lightsRoot.add(ambient);

  const sun = new DirectionalLight(0xffffff, 0);
  sun.name = 'global-sun';
  sun.castShadow = false;
  lightsRoot.add(sun);

  let tier = initialTier;
  let shadowCasters = 0;
  let exposureTarget = 1;
  let exposureCurrent = 1;

  const registered = new Set<Light>();

  const registerLight = (light: Light, wantsShadow: boolean): (() => void) => {
    lightsRoot.add(light);
    registered.add(light);

    let grantedShadow = false;
    if (wantsShadow) {
      if (shadowCasters < SHADOW_CASTER_BUDGET[tier]) {
        light.castShadow = true;
        shadowCasters += 1;
        grantedShadow = true;
      } else {
        light.castShadow = false;
        logger.warn('shadow budget exhausted — light registered without shadow', {
          tier,
          budget: SHADOW_CASTER_BUDGET[tier],
        });
      }
    }

    return () => {
      lightsRoot.remove(light);
      registered.delete(light);
      if (grantedShadow) {
        shadowCasters -= 1;
      }
      light.dispose();
    };
  };

  logger.info('lighting system initialized', { tier, shadowBudget: SHADOW_CASTER_BUDGET[tier] });

  return {
    lightsRoot,
    sun,
    ambient,
    registerLight,
    setExposureTarget: (exposure) => {
      exposureTarget = Math.max(0, exposure);
    },
    update: (deltaSeconds) => {
      exposureCurrent = damp(exposureCurrent, exposureTarget, EXPOSURE_DAMP_LAMBDA, deltaSeconds);
      return exposureCurrent;
    },
    setQualityTier: (next) => {
      tier = next;
    },
    dispose: () => {
      for (const light of registered) {
        light.dispose();
      }
      registered.clear();
      ambient.dispose();
      sun.dispose();
      lightsRoot.clear();
    },
  };
}
