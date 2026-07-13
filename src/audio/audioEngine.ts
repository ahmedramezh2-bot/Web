import { createLogger } from '@lib/logger';
import type { QualityTier } from '@quality/tiers';

/**
 * The Audio Engine — Tone.js infrastructure per the Audio Production
 * Bible. Bus architecture, zone registry, lifecycle, and the
 * autoplay-policy gate; no sound is designed here (§2's categories
 * arrive with authored content).
 *
 * Two hard rules shape everything:
 * - Browsers require a user gesture before audio starts (Tone.js's
 *   documented Tone.start() contract). start() is therefore explicit,
 *   gesture-driven, and idempotent — audio never tries to autoplay.
 * - Tone.js is heavy; it loads dynamically on first start(), never in
 *   the initial bundle (Appendix F: heavy systems lazy — Tone named
 *   explicitly).
 */

const logger = createLogger('AudioEngine');

type ToneModule = typeof import('tone');

/** Simultaneous spatialized voices per tier — Appendix F's spatial voice limits discipline. Provisional pending measurement. */
const VOICE_LIMIT: Readonly<Record<QualityTier, number>> = {
  cinema: 24,
  balanced: 16,
  essential: 8,
};

export interface AudioBuses {
  readonly master: import('tone').Gain;
  readonly ambient: import('tone').Gain;
  readonly spatial: import('tone').Gain;
  readonly interface: import('tone').Gain;
}

export interface AmbientZoneHandle {
  /** Fade the zone's bed toward the given level (0..1) over seconds. */
  readonly setLevel: (level: number, fadeSeconds: number) => void;
  readonly dispose: () => void;
}

export type AmbientZoneBuilder = (
  tone: ToneModule,
  destination: import('tone').Gain,
) => AmbientZoneHandle;

export interface AudioEngineHandle {
  /** Gesture-gated start. Safe to call repeatedly; resolves once running. */
  readonly start: () => Promise<boolean>;
  readonly isRunning: () => boolean;
  readonly buses: () => AudioBuses | undefined;
  /** Register a region's ambient bed builder — instantiated on first start, leveled by zone activation. */
  readonly registerZone: (regionId: string, builder: AmbientZoneBuilder) => () => void;
  /** Activate a region's bed (cross-fades are the caller's narrative decision; the engine just applies levels). */
  readonly setZoneLevel: (regionId: string, level: number, fadeSeconds: number) => void;
  /** Update the spatial listener from the camera pose — called by the audio bridge once per frame while running. */
  readonly setListenerPose: (
    positionX: number,
    positionY: number,
    positionZ: number,
    forwardX: number,
    forwardY: number,
    forwardZ: number,
  ) => void;
  readonly voiceLimit: () => number;
  readonly setQualityTier: (tier: QualityTier) => void;
  readonly dispose: () => void;
}

export function initAudioEngine(initialTier: QualityTier): AudioEngineHandle {
  let tone: ToneModule | undefined;
  let buses: AudioBuses | undefined;
  let starting: Promise<boolean> | undefined;
  let tier = initialTier;

  const zoneBuilders = new Map<string, AmbientZoneBuilder>();
  const zones = new Map<string, AmbientZoneHandle>();

  const instantiateZones = (): void => {
    if (!tone || !buses) {
      return;
    }
    for (const [regionId, builder] of zoneBuilders) {
      if (!zones.has(regionId)) {
        zones.set(regionId, builder(tone, buses.ambient));
      }
    }
  };

  const start = async (): Promise<boolean> => {
    if (buses) {
      return true;
    }
    starting ??= (async () => {
      try {
        const toneModule = await import('tone');
        // Tone.start() resumes the AudioContext; per its documented
        // contract this succeeds only inside a user-gesture call chain.
        await toneModule.start();
        tone = toneModule;

        const master = new toneModule.Gain(0.9).toDestination();
        buses = {
          master,
          ambient: new toneModule.Gain(1).connect(master),
          spatial: new toneModule.Gain(1).connect(master),
          interface: new toneModule.Gain(1).connect(master),
        };

        instantiateZones();
        logger.info('audio engine running', { tier, voices: VOICE_LIMIT[tier] });
        return true;
      } catch (cause) {
        starting = undefined;
        logger.warn('audio start deferred — likely outside a user gesture', {
          message: cause instanceof Error ? cause.message : String(cause),
        });
        return false;
      }
    })();
    return starting;
  };

  return {
    start,
    isRunning: () => buses !== undefined,
    buses: () => buses,
    registerZone: (regionId, builder) => {
      zoneBuilders.set(regionId, builder);
      instantiateZones();
      return () => {
        zoneBuilders.delete(regionId);
        zones.get(regionId)?.dispose();
        zones.delete(regionId);
      };
    },
    setZoneLevel: (regionId, level, fadeSeconds) => {
      zones.get(regionId)?.setLevel(level, fadeSeconds);
    },
    setListenerPose: (px, py, pz, fx, fy, fz) => {
      if (!tone) {
        return;
      }
      const listener = tone.getListener();
      listener.positionX.value = px;
      listener.positionY.value = py;
      listener.positionZ.value = pz;
      listener.forwardX.value = fx;
      listener.forwardY.value = fy;
      listener.forwardZ.value = fz;
    },
    voiceLimit: () => VOICE_LIMIT[tier],
    setQualityTier: (next) => {
      tier = next;
    },
    dispose: () => {
      for (const zone of zones.values()) {
        zone.dispose();
      }
      zones.clear();
      zoneBuilders.clear();
      buses?.master.dispose();
      buses = undefined;
    },
  };
}
