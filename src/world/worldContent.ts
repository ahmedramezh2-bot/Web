import type { AudioEngineHandle } from '@audio/audioEngine';
import { registerAudioZones } from '@audio/zones';
import type { CameraSystemHandle } from '@camera/cameraSystem';
import { TheatreAuthority } from '@cinematic/theatreAuthority';
import { createLogger } from '@lib/logger';
import { damp } from '@lib/motion';
import { sharedTicker } from '@lib/ticker';
import type { MaterialSystemHandle } from '@materials/materialSystem';
import { registerMaterialProfiles } from '@materials/profiles';
import { registerShaderLibrary } from '@shaders/library';
import type { ShaderSystemHandle } from '@shaders/shaderSystem';
import { usePresenceStore } from '@state/presenceStore';
import type { ChapterId } from '@story/chapters';
import type { StoryEngineHandle } from '@story/storyEngine';

import type { EnvironmentEngineHandle } from './environment/environmentEngine';
import { registerWorldEnvironments } from './environment/regions';
import type { FxEngineHandle } from './fx/fxEngine';
import type { LightingSystemHandle } from './lighting/lightingSystem';
import type { WorldEngineHandle } from './worldEngine';

/**
 * World Content — the Phase H bootstrap. Everything authored (material
 * profiles, the shader library, the nine region environments, the
 * ambient beds, the cinematic journey) registers here, through the
 * infrastructure built in Phases A–G; this module is deliberately the
 * only place where "the world exists" is decided.
 *
 * It also runs the world's narrative couplings:
 * - chapter → lighting arc (exposure eased per Lighting Bible §9)
 * - region → ambient bed cross-fades
 * - presence → the shared uPresence uniform (glyphs responding, 01:24)
 * - the Theatre.js director's seat over the journey tracks
 */

const logger = createLogger('WorldContent');

/**
 * Per-chapter exposure targets — the lighting arc of the film. Void
 * begins in near-darkness; the Origin is the single brightest beat
 * (Genesis Dialect, Lighting Bible §8); the ending relaxes toward calm
 * ("Everything fades. Not to black. To calm." — 04:00).
 */
const CHAPTER_EXPOSURE: Readonly<Record<ChapterId, number>> = {
  void: 0.8,
  monument: 1.0,
  fragments: 1.08,
  origin: 1.4,
  awakening: 1.2,
  threshold: 1.05,
};

const ZONE_FADE_IN_SECONDS = 2.5;
const ZONE_FADE_OUT_SECONDS = 4;
const PRESENCE_DAMP_LAMBDA = 2;

export interface WorldContentDeps {
  readonly environment: EnvironmentEngineHandle;
  readonly materials: MaterialSystemHandle;
  readonly shaders: ShaderSystemHandle;
  readonly fx: FxEngineHandle;
  readonly lighting: LightingSystemHandle;
  readonly audio: AudioEngineHandle;
  readonly camera: CameraSystemHandle;
  readonly story: StoryEngineHandle;
  readonly world: WorldEngineHandle;
}

export interface WorldContentHandle {
  readonly dispose: () => void;
}

export function initWorldContent(deps: WorldContentDeps): WorldContentHandle {
  const { environment, materials, shaders, fx, lighting, audio, camera, story, world } = deps;

  // ── Authored registries ───────────────────────────────────────────
  registerMaterialProfiles(materials);

  // uPresence joins the shared uniform clock before any material is
  // instantiated, so every glyph surface reads one damped value.
  shaders.uniforms['uPresence'] = { value: 0 };
  registerShaderLibrary(shaders);

  registerWorldEnvironments({ environment, materials, shaders, fx, lighting });
  registerAudioZones(audio);

  // ── The director's seat ───────────────────────────────────────────
  const authority = new TheatreAuthority();
  camera.rig.setAuthority(authority);
  void authority.connect();

  // ── Narrative couplings ───────────────────────────────────────────
  const offChapter = story.events.on('chapter-entered', ({ chapter }) => {
    lighting.setExposureTarget(CHAPTER_EXPOSURE[chapter as ChapterId] ?? 1);
  });
  // The journey opens in the Void's register, before any boundary fires.
  lighting.setExposureTarget(CHAPTER_EXPOSURE.void);

  const offRegionEntered = world.events.on('region-entered', ({ regionId, from }) => {
    if (from !== undefined) {
      audio.setZoneLevel(from, 0, ZONE_FADE_OUT_SECONDS);
    }
    audio.setZoneLevel(regionId, 1, ZONE_FADE_IN_SECONDS);
  });

  // The first bed rises with the first region once audio is running —
  // region-entered only fires on changes, so prime the starting region.
  audio.setZoneLevel('starfield-reach', 1, ZONE_FADE_IN_SECONDS);

  const removeTick = sharedTicker.add((deltaSeconds) => {
    const uniform = shaders.uniforms['uPresence'];
    if (uniform) {
      uniform.value = damp(
        uniform.value as number,
        usePresenceStore.getState().strength,
        PRESENCE_DAMP_LAMBDA,
        deltaSeconds,
      );
    }
  });

  logger.info('world content registered', {
    regions: 9,
    materials: 12,
    shaders: 7,
    beds: 9,
  });

  return {
    dispose: () => {
      offChapter();
      offRegionEntered();
      removeTick();
    },
  };
}
