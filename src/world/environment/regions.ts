import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DodecahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  OctahedronGeometry,
  PointLight,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
  type Points,
} from 'three';

import { createLogger } from '@lib/logger';
import type { MaterialSystemHandle, MaterialFamilyId } from '@materials/materialSystem';
import type { ShaderSystemHandle } from '@shaders/shaderSystem';

import type { FxEngineHandle } from '../fx/fxEngine';
import type { LightingSystemHandle } from '../lighting/lightingSystem';
import type { EnvironmentBuildContext, EnvironmentEngineHandle } from './environmentEngine';

/**
 * The world — the nine Main Path Physical Locations (docs/bible/26 §3)
 * authored from Part 1's script, each rendered in its assigned
 * Environmental Dialect. Nothing here is generic scenery: every object
 * executes a written beat, cited at its construction site.
 *
 * Placement is deterministic (seeded pseudo-random), so the world is
 * identical for every visitor on every visit — "nothing feels
 * procedural… everything feels intentionally designed" (script 01:48)
 * — while still carrying Natural Imperfection in its distributions.
 *
 * Every builder returns a cleanup that releases its shared materials,
 * shader instances, particle allocations, and lights; geometry the
 * builder owns is disposed by the engine's subtree sweep.
 */

const logger = createLogger('WorldRegions');

export interface WorldEnvironmentDeps {
  readonly environment: EnvironmentEngineHandle;
  readonly materials: MaterialSystemHandle;
  readonly shaders: ShaderSystemHandle;
  readonly fx: FxEngineHandle;
  readonly lighting: LightingSystemHandle;
}

/** Deterministic unit random — mulberry32, seeded per use-site. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tracks a builder's shared resources; returned as its cleanup. */
class RegionResources {
  private readonly releases: Array<() => void> = [];

  public material(
    materials: MaterialSystemHandle,
    family: MaterialFamilyId,
    variant?: string,
  ): Material {
    const instance = materials.acquire(family, variant);
    this.releases.push(() => {
      materials.release(family, variant);
    });
    return instance;
  }

  public shader(
    shaders: ShaderSystemHandle,
    id: string,
    parameters?: Parameters<ShaderSystemHandle['createMaterial']>[1],
  ): ReturnType<ShaderSystemHandle['createMaterial']> {
    const instance = shaders.createMaterial(id, parameters);
    this.releases.push(() => {
      shaders.releaseMaterial(id, instance);
    });
    return instance;
  }

  public particles(
    fx: FxEngineHandle,
    count: number,
    material: Material,
    scatter: (positions: Float32Array) => void,
  ): Points | undefined {
    const allocation = fx.allocateParticles(count, material);
    if (!allocation) {
      logger.warn('particle allocation refused — region renders without this layer', { count });
      return undefined;
    }
    const attribute = allocation.points.geometry.getAttribute('position') as BufferAttribute;
    scatter(attribute.array as Float32Array);
    attribute.needsUpdate = true;
    allocation.points.geometry.computeBoundingSphere();
    this.releases.push(allocation.release);
    return allocation.points;
  }

  public light(lighting: LightingSystemHandle, light: PointLight, wantsShadow: boolean): void {
    this.releases.push(lighting.registerLight(light, wantsShadow));
  }

  public cleanup(): () => void {
    return () => {
      for (const release of this.releases) {
        release();
      }
      this.releases.length = 0;
    };
  }
}

function instancedScatter(
  geometry: BufferGeometry,
  material: Material,
  count: number,
  seed: number,
  place: (
    random: () => number,
    index: number,
  ) => { position: Vector3; scale: Vector3; rotY: number },
): InstancedMesh {
  const mesh = new InstancedMesh(geometry, material, count);
  const random = seededRandom(seed);
  const matrix = new Matrix4();
  const quaternion = new Quaternion();
  const up = new Vector3(0, 1, 0);
  for (let index = 0; index < count; index += 1) {
    const { position, scale, rotY } = place(random, index);
    quaternion.setFromAxisAngle(up, rotY);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

const PARTICLE_MATERIAL_DEFAULTS = {
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
} as const;

export function registerWorldEnvironments(deps: WorldEnvironmentDeps): void {
  const { environment, materials, shaders, fx, lighting } = deps;

  // ── THE STARFIELD REACH — Void, The Vast Dialect ──────────────────
  // Script 00:00–00:16: "Not empty. Alive. Tiny invisible particles"
  // and, at 00:08, one microscopic distant star that pulses.
  environment.registerEnvironment('starfield-reach', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const starMaterial = resources.shader(shaders, 'starfield', {
      ...PARTICLE_MATERIAL_DEFAULTS,
      uniforms: { uPointScale: { value: 1.0 } },
    });
    const random = seededRandom(11);
    const stars = resources.particles(fx, 3200, starMaterial, (positions) => {
      for (let i = 0; i < positions.length; i += 3) {
        // A vast shell around the opening stretch of the path — deep
        // space in every direction, nothing near enough to touch.
        positions[i] = (random() - 0.5) * 700;
        positions[i + 1] = (random() - 0.5) * 500;
        positions[i + 2] = 380 - random() * 500;
      }
    });
    if (stars) {
      root.add(stars);
    }

    return resources.cleanup();
  });

  // ── THE COSMIC DUST FIELD — Void, The Vast Dialect ────────────────
  // Script 00:16: "Dust. Gas. Invisible particles. Soft volumetric
  // fog." At 00:28–00:45 the star becomes "something else. Unknown.
  // Ancient." — the first light, which opens at the chapter boundary.
  environment.registerEnvironment('cosmic-dust-field', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const dustMaterial = resources.shader(shaders, 'cosmic-dust', {
      ...PARTICLE_MATERIAL_DEFAULTS,
      uniforms: { uPointScale: { value: 6.0 } },
    });
    const random = seededRandom(23);
    const dust = resources.particles(fx, 2600, dustMaterial, (positions) => {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (random() - 0.5) * 180;
        positions[i + 1] = (random() - 0.5) * 90;
        positions[i + 2] = 310 - random() * 90;
      }
    });
    if (dust) {
      root.add(dust);
    }

    // The first light — the star that is "no longer a star" (00:28).
    // Energy Crystal in solid form: internally lit, never surface-lit.
    const firstLight = new Mesh(
      new SphereGeometry(1.1, 32, 32),
      resources.material(materials, 'energy-crystal', 'first-light'),
    );
    firstLight.position.set(0, 2.1, 239);
    root.add(firstLight);

    // Its inner light reacts to the visitor (00:40) — a real light
    // source, warm against the Vast Dialect's cold register.
    const glow = new PointLight(0xfff2dd, 18, 90, 2);
    glow.position.copy(firstLight.position);
    resources.light(lighting, glow, false);

    return resources.cleanup();
  });

  // ── THE MONUMENT RANGE — Monument, The Reverent Dialect ───────────
  // Script 01:12–01:24: "Gigantic floating monoliths… they are
  // memories," surfaces covered with living glyphs that move beneath
  // the surface and respond to presence.
  environment.registerEnvironment('monument-range', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    // uPresence arrives through the shared uniform clock (worldContent
    // drives it from the presence store); awareness is authored per
    // location — the Range notices more than the Ring.
    const glyphMaterial = resources.shader(shaders, 'glyph-flow', {
      uniforms: { uAwareness: { value: 0.6 } },
    });

    // Five monoliths — impossibly massive, no visible beginning or end
    // (01:18): heights run far past the fog of legibility.
    const monolithGeometry = new BoxGeometry(6, 44, 2.4);
    const placements: ReadonlyArray<{ x: number; y: number; z: number; rotY: number; s: number }> =
      [
        { x: -14, y: 6, z: 208, rotY: 0.22, s: 1.0 },
        { x: 16, y: 10, z: 196, rotY: -0.35, s: 1.35 },
        { x: -22, y: 14, z: 186, rotY: 0.6, s: 0.85 },
        { x: 9, y: 4, z: 214, rotY: -0.1, s: 0.7 },
        { x: 26, y: 18, z: 182, rotY: 0.95, s: 1.1 },
      ];
    for (const p of placements) {
      const monolith = new Mesh(monolithGeometry, glyphMaterial);
      monolith.position.set(p.x, p.y, p.z);
      monolith.rotation.y = p.rotY;
      monolith.scale.setScalar(p.s);
      root.add(monolith);
    }

    // Obsidian shards drifting between the monuments — the darkness
    // holds the world's brightest highlights (Material Bible §3).
    const shards = instancedScatter(
      new OctahedronGeometry(0.6),
      resources.material(materials, 'black-obsidian'),
      36,
      37,
      (random) => ({
        position: new Vector3((random() - 0.5) * 70, 2 + random() * 24, 230 - random() * 55),
        scale: new Vector3(1, 1 + random() * 2.2, 1).multiplyScalar(0.4 + random() * 0.9),
        rotY: random() * Math.PI * 2,
      }),
    );
    root.add(shards);

    // The Reverent Dialect's vertical shaft: one restrained, sacred
    // hard light from above (Lighting Bible §8).
    const shaft = new PointLight(0xdfeaff, 30, 140, 2);
    shaft.position.set(0, 46, 198);
    // wantsShadow: false — the renderer's shadow-map pass is off and
    // no receiving surfaces exist yet; requesting a shadow the scene
    // cannot render would misstate the budget (Lighting Bible §7
    // shadow authoring arrives with receiving architecture).
    resources.light(lighting, shaft, false);

    return resources.cleanup();
  });

  // ── THE SENTINEL RING — Monument, The Reverent Dialect ────────────
  // Script 02:12: "Gigantic floating structures slowly rotate around a
  // central source of light" — the ring the path passes through.
  environment.registerEnvironment('sentinel-ring', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const stoneMaterial = resources.material(materials, 'architectural-stone');
    const glyphMaterial = resources.shader(shaders, 'glyph-flow', {
      uniforms: { uAwareness: { value: 0.35 } },
    });

    const center = new Vector3(0, 4.5, 150);
    const sentinelGeometry = new BoxGeometry(2.2, 18, 2.2);
    const count = 9;
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      const radius = 24;
      const sentinel = new Mesh(sentinelGeometry, index % 3 === 0 ? glyphMaterial : stoneMaterial);
      sentinel.position.set(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(index * 2.39996) * 3,
        center.z + Math.sin(angle) * radius,
      );
      sentinel.lookAt(center);
      root.add(sentinel);
    }

    // The ring itself — worked, historic metal carrying visible age.
    const ring = new Mesh(
      new TorusGeometry(24, 0.5, 12, 96),
      resources.material(materials, 'ancient-alloy'),
    );
    ring.position.copy(center);
    ring.rotation.x = Math.PI / 2;
    root.add(ring);

    // The central source the structures rotate around (02:12).
    const heart = new PointLight(0xffe8c8, 24, 120, 2);
    heart.position.copy(center);
    resources.light(lighting, heart, false);

    return resources.cleanup();
  });

  // ── THE CRYSTAL GARDEN — Fragments, The Generative Dialect ────────
  // Script 02:28–02:40: the first Artifact — "polished obsidian, white
  // crystal, and liquid metal" — opens among growing crystal forms.
  environment.registerEnvironment('crystal-garden', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const crystals = instancedScatter(
      new OctahedronGeometry(1),
      resources.material(materials, 'unknown-crystal'),
      28,
      53,
      (random) => ({
        position: new Vector3((random() - 0.5) * 60, -2 + random() * 10, 115 - random() * 55),
        scale: new Vector3(0.6, 1.2 + random() * 2.4, 0.6).multiplyScalar(0.5 + random()),
        rotY: random() * Math.PI * 2,
      }),
    );
    root.add(crystals);

    const veins = instancedScatter(
      new OctahedronGeometry(0.5),
      resources.material(materials, 'energy-crystal'),
      14,
      59,
      (random) => ({
        position: new Vector3((random() - 0.5) * 50, -1 + random() * 6, 110 - random() * 45),
        scale: new Vector3(1, 1.6 + random() * 1.4, 1).multiplyScalar(0.35 + random() * 0.5),
        rotY: random() * Math.PI * 2,
      }),
    );
    root.add(veins);

    const minerals = instancedScatter(
      new DodecahedronGeometry(0.45),
      resources.material(materials, 'transparent-minerals'),
      18,
      61,
      (random) => ({
        position: new Vector3((random() - 0.5) * 55, -2 + random() * 4, 112 - random() * 50),
        scale: new Vector3(1, 1, 1).multiplyScalar(0.4 + random() * 0.7),
        rotY: random() * Math.PI * 2,
      }),
    );
    root.add(minerals);

    // The Artifact (02:28): obsidian base, liquid-metal band, white
    // crystal core — "this object has appeared before… now the visitor
    // finally notices."
    const artifactBase = new Mesh(
      new CylinderGeometry(0.9, 1.2, 0.5, 24),
      resources.material(materials, 'black-obsidian', 'artifact'),
    );
    artifactBase.position.set(2, 1.0, 86);
    root.add(artifactBase);

    const artifactBand = new Mesh(
      new TorusGeometry(0.7, 0.12, 10, 48),
      resources.material(materials, 'liquid-metal'),
    );
    artifactBand.position.set(2, 1.55, 86);
    artifactBand.rotation.x = Math.PI / 2;
    root.add(artifactBand);

    const artifactCore = new Mesh(
      new OctahedronGeometry(0.42),
      resources.material(materials, 'unknown-crystal', 'artifact-core'),
    );
    artifactCore.position.set(2, 1.85, 86);
    root.add(artifactCore);

    // Generative Dialect: energy-light warmth pooling around growth.
    const gardenLight = new PointLight(0xbfe8ff, 14, 80, 2);
    gardenLight.position.set(0, 8, 92);
    resources.light(lighting, gardenLight, false);

    return resources.cleanup();
  });

  // ── THE ENERGY STREAM — Fragments→Origin, The Active Dialect ──────
  // Script 02:22: "Soft particles travel between every structure. Like
  // information. Like memories. Like thoughts."
  environment.registerEnvironment('energy-stream', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const streamMaterial = resources.shader(shaders, 'energy-stream', {
      ...PARTICLE_MATERIAL_DEFAULTS,
      uniforms: { uPointScale: { value: 2.2 } },
    });
    const random = seededRandom(71);
    const stream = resources.particles(fx, 5200, streamMaterial, (positions) => {
      for (let i = 0; i < positions.length; i += 3) {
        // A loose braid narrowing toward the Origin — information
        // converging on meaning.
        const t = random();
        const z = 62 - t * 64;
        const braid = Math.sin(t * 14 + random() * 0.6) * (4 - t * 3);
        positions[i] = braid + (random() - 0.5) * (6 - t * 4.5);
        positions[i + 1] = 1.2 + Math.cos(t * 11) * (2.5 - t * 1.8) + (random() - 0.5) * 2;
        positions[i + 2] = z;
      }
    });
    if (stream) {
      root.add(stream);
    }

    // Two liquid-metal arcs the stream threads through — transformation
    // material, reserved for exactly this (Material Bible §3).
    const arcMaterial = resources.material(materials, 'liquid-metal', 'stream-arc');
    for (const [z, scale] of [
      [44, 5],
      [18, 3.4],
    ] as const) {
      const arc = new Mesh(new TorusGeometry(scale, 0.22, 10, 64, Math.PI * 1.2), arcMaterial);
      arc.position.set(0, 1.4, z);
      arc.rotation.z = Math.PI * -0.1;
      root.add(arc);
    }

    return resources.cleanup();
  });

  // ── THE ORIGIN CORE — Origin, The Genesis Dialect ─────────────────
  // Script 02:52–03:18: the gigantic sphere whose surface holds
  // millions of unique microscopic symbols; it opens from inside, and
  // the visitor is gently pulled through.
  environment.registerEnvironment('origin-core', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const surfaceMaterial = resources.shader(shaders, 'origin-surface', {});
    const sphere = new Mesh(new SphereGeometry(14, 96, 64), surfaceMaterial);
    sphere.position.set(0, 0, 0);
    root.add(sphere);

    // The folding interior — Impossible Matter, authored for exactly
    // this beat (03:12: "space folds inward"). A receding shell ahead
    // of the camera, passed through at the chapter's very end — never
    // a wall that envelops the frame.
    const fold = new Mesh(
      new SphereGeometry(8, 48, 32),
      resources.material(materials, 'impossible-matter'),
    );
    (fold.material as Material & { side?: number }).side = 1; // BackSide
    fold.position.set(0, 0, -26);
    root.add(fold);

    // Sacred Stone fragments in slow orbit — the material reserved for
    // Origin-tied objects, distinct at a glance (Material Bible §3).
    const fragments = instancedScatter(
      new BoxGeometry(1.2, 0.5, 0.8),
      resources.material(materials, 'sacred-stone'),
      16,
      83,
      (random, index) => {
        const angle = (index / 16) * Math.PI * 2 + random() * 0.3;
        const radius = 18 + random() * 6;
        return {
          position: new Vector3(
            Math.cos(angle) * radius,
            (random() - 0.5) * 10,
            Math.sin(angle) * radius,
          ),
          scale: new Vector3(1, 1, 1).multiplyScalar(0.6 + random()),
          rotY: random() * Math.PI * 2,
        };
      },
    );
    root.add(fragments);

    // Genesis Dialect — the single full-intensity Origin Light in the
    // entire experience (Lighting Bible §8).
    const originLight = new PointLight(0xfff6e8, 60, 200, 1.8);
    originLight.position.set(0, 0, 0);
    resources.light(lighting, originLight, false);

    return resources.cleanup();
  });

  // ── THE DISTANT HEART — Awakening, The Recollective Dialect ───────
  // Script 03:18–03:42: inside — "pure white infinity… thousands of
  // unfinished creations. They are not abandoned. They are waiting."
  environment.registerEnvironment('distant-heart', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    // White infinity: an enveloping interior shell, softly self-lit —
    // "light has weight, silence has texture, distance has no meaning."
    const infinityMaterial = resources.material(materials, 'memory-stone', 'infinity');
    const shell = infinityMaterial as Material & {
      side?: number;
      emissive?: Color;
      emissiveIntensity?: number;
    };
    shell.side = 1; // BackSide
    shell.emissive = new Color(0xf2efe8);
    shell.emissiveIntensity = 0.55;
    const infinity = new Mesh(new SphereGeometry(55, 48, 32), infinityMaterial);
    infinity.position.set(0, 0, -70);
    root.add(infinity);

    const driftMaterial = resources.shader(shaders, 'memory-drift', {
      ...PARTICLE_MATERIAL_DEFAULTS,
      uniforms: { uPointScale: { value: 8.0 } },
    });
    const random = seededRandom(97);
    const drift = resources.particles(fx, 2200, driftMaterial, (positions) => {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (random() - 0.5) * 80;
        positions[i + 1] = (random() - 0.5) * 50;
        positions[i + 2] = -35 - random() * 65;
      }
    });
    if (drift) {
      root.add(drift);
    }

    // Unfinished creations — half-built frames, deliberately
    // incomplete: memory stone for what waits, white stone for what is
    // already half-real (03:24).
    const memoryMaterial = resources.material(materials, 'memory-stone');
    const whiteMaterial = resources.material(materials, 'white-stone');
    const frameGeometry = new BoxGeometry(2.4, 0.3, 0.3);
    const placementRandom = seededRandom(101);
    for (let index = 0; index < 14; index += 1) {
      const cluster = new Vector3(
        (placementRandom() - 0.5) * 60,
        (placementRandom() - 0.5) * 30,
        -45 - placementRandom() * 50,
      );
      // Each creation is a partial frame — 3 of an implied 12 edges,
      // "not abandoned, waiting."
      for (let edge = 0; edge < 3; edge += 1) {
        const bar = new Mesh(frameGeometry, edge === 0 ? whiteMaterial : memoryMaterial);
        bar.position.set(
          cluster.x + (placementRandom() - 0.5) * 2,
          cluster.y + edge * 1.1,
          cluster.z + (placementRandom() - 0.5) * 2,
        );
        bar.rotation.y = edge * (Math.PI / 2) + placementRandom() * 0.2;
        bar.scale.setScalar(0.8 + placementRandom() * 1.6);
        root.add(bar);
      }
    }

    return resources.cleanup();
  });

  // ── THE RISING GATE — Threshold, Vast blended toward Genesis ──────
  // Script 01:54/04:00: "an enormous circular gateway… inside the
  // gateway, nothing" — until the end, when the light forms "not as a
  // logo. As a promise," and up becomes the dominant axis.
  environment.registerEnvironment('rising-gate', ({ root }: EnvironmentBuildContext) => {
    const resources = new RegionResources();

    const gateCenter = new Vector3(0, 20, -120);

    const gateRing = new Mesh(
      new TorusGeometry(10, 1.1, 16, 96),
      resources.material(materials, 'sacred-stone', 'gate'),
    );
    gateRing.position.copy(gateCenter);
    root.add(gateRing);

    const apertureMaterial = resources.shader(shaders, 'gateway-light', {
      transparent: true,
      depthWrite: false,
    });
    const aperture = new Mesh(new CircleGeometry(9.2, 64), apertureMaterial);
    aperture.position.copy(gateCenter);
    root.add(aperture);

    // Rising white-stone steps — hope is vertical (Camera Bible §4).
    // They flank the ascent below and beside the path; the camera's
    // final stretch stays clear so the gate owns the last frame.
    const steps = instancedScatter(
      new BoxGeometry(3.2, 0.35, 1.6),
      resources.material(materials, 'white-stone', 'steps'),
      10,
      113,
      (random, index) => ({
        position: new Vector3(
          (index % 2 === 0 ? 4.5 : -4.5) + Math.sin(index * 0.7) * 1.5,
          1.5 + index * 1.4,
          -90 - index * 2.0,
        ),
        scale: new Vector3(1, 1, 1).multiplyScalar(0.9 + random() * 0.3),
        rotY: (random() - 0.5) * 0.3,
      }),
    );
    root.add(steps);

    // A final scatter of stars above the gate — the sky the visitor
    // rises into.
    const starMaterial = resources.shader(shaders, 'starfield', {
      ...PARTICLE_MATERIAL_DEFAULTS,
      uniforms: { uPointScale: { value: 0.9 } },
    });
    const random = seededRandom(127);
    const stars = resources.particles(fx, 1400, starMaterial, (positions) => {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = (random() - 0.5) * 240;
        positions[i + 1] = 20 + random() * 160;
        positions[i + 2] = -80 - random() * 160;
      }
    });
    if (stars) {
      root.add(stars);
    }

    // The gate's own light — warm, infinite, never blinding.
    const gateLight = new PointLight(0xfff8ec, 36, 160, 2);
    gateLight.position.copy(gateCenter);
    resources.light(lighting, gateLight, false);

    return resources.cleanup();
  });

  logger.info('world environments registered', { regions: 9 });
}
