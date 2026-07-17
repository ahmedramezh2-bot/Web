import type { AmbientZoneHandle, AudioEngineHandle } from './audioEngine';

/**
 * The ambient sound of the world — one procedural bed per Main Path
 * region, voiced in its Environmental Dialect's register (Audio
 * Production Bible §5) and the script's instruction (00:20): an
 * original composition evoking cosmic loneliness, infinite distance,
 * curiosity, and hope emerging from silence — "not music… almost a
 * feeling." No samples, no melodies: drones, air, and (only at the
 * Origin) the ancient heartbeat (03:00).
 *
 * Beds are built lazily by the audio engine on its gesture-gated
 * start; levels are driven by region entry (worldContent). Every bed
 * starts silent — silence remains equally important (01:30).
 */

type ToneModule = typeof import('tone');
type ToneGain = import('tone').Gain;

interface BedConfig {
  /** Drone partials as [frequency Hz, relative gain]. */
  readonly drones: ReadonlyArray<readonly [number, number]>;
  /** Filtered-noise air: cutoff Hz and relative gain. */
  readonly air?: { readonly cutoff: number; readonly gain: number };
  /** The Origin's heartbeat only — slow amplitude pulse in Hz. */
  readonly pulseHz?: number;
  /** The bed's ceiling — even fully active, beds stay far under full scale. */
  readonly ceiling: number;
}

function buildBed(tone: ToneModule, destination: ToneGain, config: BedConfig): AmbientZoneHandle {
  const bedGain = new tone.Gain(0).connect(destination);
  const disposables: Array<{ dispose: () => void }> = [bedGain];

  // The pulse lives on its own stage in series, so the heartbeat's LFO
  // never fights the bed's level control — bedGain.gain belongs to
  // setLevel exclusively, pulseGain.gain to the LFO exclusively.
  let sourceBus: ToneGain = bedGain;
  if (config.pulseHz !== undefined) {
    // "An almost inaudible heartbeat. Not human. Ancient." — the LFO
    // breathes the bed's amplitude around its resting level.
    const pulseGain = new tone.Gain(1).connect(bedGain);
    const lfo = new tone.LFO({ frequency: config.pulseHz, min: 0.6, max: 1 });
    lfo.connect(pulseGain.gain);
    lfo.start();
    disposables.push(pulseGain, lfo);
    sourceBus = pulseGain;
  }

  for (const [frequency, gain] of config.drones) {
    const droneGain = new tone.Gain(gain).connect(sourceBus);
    const oscillator = new tone.Oscillator({ frequency, type: 'sine' }).connect(droneGain);
    oscillator.start();
    disposables.push(droneGain, oscillator);
  }

  if (config.air) {
    const airGain = new tone.Gain(config.air.gain).connect(sourceBus);
    const filter = new tone.Filter(config.air.cutoff, 'lowpass').connect(airGain);
    const noise = new tone.Noise('brown').connect(filter);
    noise.start();
    disposables.push(airGain, filter, noise);
  }

  return {
    setLevel: (level, fadeSeconds) => {
      bedGain.gain.rampTo(Math.max(0, Math.min(1, level)) * config.ceiling, fadeSeconds);
    },
    dispose: () => {
      for (const disposable of disposables) {
        disposable.dispose();
      }
    },
  };
}

/** Region → dialect-voiced bed. Frequencies sit low and consonant; character comes from spacing and air, never melody. */
const REGION_BEDS: Readonly<Record<string, BedConfig>> = {
  // The Vast Dialect — cold, enormous, nearly empty.
  'starfield-reach': {
    drones: [
      [55, 0.5],
      [110.4, 0.12],
    ],
    air: { cutoff: 220, gain: 0.1 },
    ceiling: 0.5,
  },
  'cosmic-dust-field': {
    drones: [
      [55, 0.4],
      [82.4, 0.18],
    ],
    air: { cutoff: 320, gain: 0.14 },
    ceiling: 0.55,
  },
  // The Reverent Dialect — vertical, sacred spacing (open fifth).
  'monument-range': {
    drones: [
      [49, 0.45],
      [73.4, 0.22],
      [146.8, 0.06],
    ],
    air: { cutoff: 260, gain: 0.08 },
    ceiling: 0.6,
  },
  'sentinel-ring': {
    drones: [
      [49, 0.4],
      [98, 0.2],
      [147.1, 0.08],
    ],
    ceiling: 0.55,
  },
  // The Generative Dialect — brighter partials, quietly busy.
  'crystal-garden': {
    drones: [
      [65.4, 0.35],
      [196.5, 0.1],
      [261.9, 0.05],
    ],
    air: { cutoff: 900, gain: 0.06 },
    ceiling: 0.55,
  },
  // The Active Dialect — motion in the air band.
  'energy-stream': {
    drones: [
      [65.4, 0.3],
      [130.9, 0.16],
    ],
    air: { cutoff: 1400, gain: 0.12 },
    ceiling: 0.55,
  },
  // The Genesis Dialect — the warmest, truest chord; the heartbeat.
  'origin-core': {
    drones: [
      [58.3, 0.45],
      [87.5, 0.22],
      [116.8, 0.12],
      [175.2, 0.05],
    ],
    pulseHz: 0.5,
    ceiling: 0.7,
  },
  // The Recollective Dialect — soft, desaturated, past-tense.
  'distant-heart': {
    drones: [
      [58.3, 0.3],
      [116.5, 0.1],
    ],
    air: { cutoff: 500, gain: 0.16 },
    ceiling: 0.45,
  },
  // Vast blended toward Genesis — cold air, warm center, rising.
  'rising-gate': {
    drones: [
      [55, 0.3],
      [87.5, 0.2],
      [110.1, 0.1],
    ],
    air: { cutoff: 420, gain: 0.1 },
    ceiling: 0.6,
  },
};

export function registerAudioZones(audio: AudioEngineHandle): void {
  for (const [regionId, config] of Object.entries(REGION_BEDS)) {
    audio.registerZone(regionId, (tone, destination) => buildBed(tone, destination, config));
  }
}
