import type { MaterialSystemHandle } from './materialSystem';

/**
 * Authored PBR profiles for the twelve constitutional material
 * families — Material Bible §3 identities rendered as
 * MeshPhysicalMaterial parameters, reflection behavior per Lighting
 * Bible §10, imperfection philosophy per Appendix D ("nothing in
 * HEBRA reflects perfectly": every gloss value stops short of 0
 * roughness, every mirror short of a rendering demo).
 *
 * Per-tier overrides reduce *cost*, never identity (Appendix F):
 * transmission — the most expensive path — degrades to opacity-based
 * translucency in Essential; colors and roughness registers never
 * change between tiers.
 */

export function registerMaterialProfiles(materials: MaterialSystemHandle): void {
  // §3: "the world's darkest, sharpest material… holds the world's
  // brightest highlights against near-total blackness."
  materials.registerProfile('black-obsidian', {
    base: {
      color: 0x07070c,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.4,
    },
    perTier: { essential: { clearcoat: 0, envMapIntensity: 1.1 } },
  });

  // §3: "primary neutral architectural material; soft-edged, quietly
  // aged, the canvas most other materials are set against."
  materials.registerProfile('white-stone', {
    base: { color: 0xcbc5ba, metalness: 0, roughness: 0.85, envMapIntensity: 0.35 },
  });

  // §3: "refractive, internally complex… most associated with
  // Impossible Light and mystery." Lighting §10: refractive more than
  // reflective — light passes through and disperses.
  materials.registerProfile('unknown-crystal', {
    base: {
      color: 0xbfd3e6,
      metalness: 0,
      roughness: 0.18,
      transmission: 0.92,
      thickness: 1.4,
      ior: 1.65,
      attenuationColor: 0x86a8c8,
      attenuationDistance: 2.2,
      envMapIntensity: 0.9,
    },
    perTier: {
      balanced: { thickness: 0.9 },
      essential: { transmission: 0, transparent: true, opacity: 0.55, thickness: 0 },
    },
  });

  // §3: "perpetually on the edge of motion; the most reflective family
  // in the world, reserved for objects tied to transformation."
  materials.registerProfile('liquid-metal', {
    base: { color: 0xd8dce2, metalness: 1, roughness: 0.07, envMapIntensity: 1.6 },
    perTier: { essential: { envMapIntensity: 1.2, roughness: 0.12 } },
  });

  // §3: "worked, historic metal… carrying visible age as its dominant
  // characteristic" — patina-warm, diffused reflections.
  materials.registerProfile('ancient-alloy', {
    base: { color: 0x8a7f6a, metalness: 1, roughness: 0.48, envMapIntensity: 0.8 },
  });

  // §3: "translucent, subtly responsive, used where the story wants an
  // object to feel aware" — evolution is driven at runtime by the
  // animation engine, the profile provides the aware baseline.
  materials.registerProfile('living-glass', {
    base: {
      color: 0xdfe8e4,
      metalness: 0,
      roughness: 0.12,
      transmission: 0.85,
      thickness: 0.8,
      ior: 1.5,
      emissive: 0x1a2420,
      emissiveIntensity: 0.25,
      envMapIntensity: 1,
    },
    perTier: { essential: { transmission: 0, transparent: true, opacity: 0.6, thickness: 0 } },
  });

  // §3: "primary carrier of Energy Light in solid form; internally lit
  // rather than surface-lit" — emissive dominates, surface stays calm.
  materials.registerProfile('energy-crystal', {
    base: {
      color: 0x0e1a24,
      metalness: 0,
      roughness: 0.3,
      emissive: 0x5fb8e8,
      emissiveIntensity: 1.8,
      envMapIntensity: 0.5,
    },
    perTier: { essential: { emissiveIntensity: 1.4 } },
  });

  // §3: "softer, calmer cousins of Unknown Crystal… smaller-scale and
  // more intimate objects (Artifacts)."
  materials.registerProfile('transparent-minerals', {
    base: {
      color: 0xd8d2c8,
      metalness: 0,
      roughness: 0.35,
      transmission: 0.7,
      thickness: 0.5,
      ior: 1.45,
      envMapIntensity: 0.6,
    },
    perTier: { essential: { transmission: 0, transparent: true, opacity: 0.7, thickness: 0 } },
  });

  // §3: "deliberately undefined in detail… authored only when a
  // specific narrative beat requires it." The beat that requires it is
  // the Origin's folding interior (script 03:12) — matter that reads
  // as neither solid nor light: iridescence over near-black.
  materials.registerProfile('impossible-matter', {
    base: {
      color: 0x05050a,
      metalness: 0.4,
      roughness: 0.2,
      // Restrained thin-film: a suggestion of impossibility at grazing
      // angles, never a hue that competes with Genesis light's warm
      // white truth (Lighting Bible §8).
      iridescence: 0.45,
      iridescenceIOR: 1.5,
      envMapIntensity: 1.2,
    },
    perTier: { essential: { iridescence: 0, envMapIntensity: 0.9 } },
  });

  // §3: "load-bearing, large-scale cousin of White Stone… monumental
  // structure rather than surface finishing."
  materials.registerProfile('architectural-stone', {
    base: { color: 0x9a958c, metalness: 0, roughness: 0.92, envMapIntensity: 0.25 },
  });

  // §3: "reserved exclusively for objects tied to the Origin and
  // Awakening chapters — its distinction must always be legible at a
  // glance": warm, faintly self-evident in darkness.
  materials.registerProfile('sacred-stone', {
    base: {
      color: 0xc8bfa8,
      metalness: 0,
      roughness: 0.7,
      emissive: 0x8a7448,
      emissiveIntensity: 0.12,
      envMapIntensity: 0.5,
    },
  });

  // §3: "desaturated, softer-edged, paired narratively with Memory
  // Light" — recedes in darkness, never fully present.
  materials.registerProfile('memory-stone', {
    base: {
      color: 0x8d8d92,
      metalness: 0,
      roughness: 0.88,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 0.2,
    },
  });
}
