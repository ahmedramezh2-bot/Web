import { ShaderMaterial, type IUniform, type ShaderMaterialParameters } from 'three';

import { loadConfig } from '@lib/config';
import { EngineError } from '@lib/errors';
import { createLogger } from '@lib/logger';
import type { QualityTier } from '@quality/tiers';

/**
 * The Shader System — the Shader Bible (docs/bible/27) as running
 * infrastructure.
 *
 * Every shader belongs to exactly one of the five categories (§2) and
 * must declare the §3 required fields before it may exist — the
 * registration type IS the checklist, so an undocumented shader cannot
 * compile into the system. The Uniform Manager is the "one clock, many
 * listeners" principle at the GPU boundary: shared uniforms are one
 * object updated once per frame, referenced (never copied) by every
 * shader material, per three.js's documented uniform-sharing behavior.
 *
 * No artistic shader exists here. The system that powers them does.
 */

const logger = createLogger('ShaderSystem');

/** Shader Bible §2 — the five categories, verbatim. */
export type ShaderCategory =
  'material' | 'lighting' | 'volumetric-atmospheric' | 'post-rendering' | 'particle-fx';

/** Shader Bible §6 — complexity tiers within Appendix F's budget. */
export type ShaderComplexityTier = 'hero' | 'standard' | 'ambient';

/**
 * Shader Bible §3's seven required fields, as the registration type.
 * A definition missing any field is a type error — documentation-
 * before-existence, enforced mechanically.
 */
export interface ShaderDefinition {
  readonly id: string;
  readonly category: ShaderCategory;
  /** The specific Bible requirement executed, cited by section (§3, Purpose). */
  readonly purpose: string;
  readonly governingBibles: readonly string[];
  readonly inputs: readonly string[];
  readonly complexityTier: ShaderComplexityTier;
  /** Authored cheaper path per tier — never an automatic truncation (§6). */
  readonly fallback: Partial<Record<QualityTier, ShaderSources>>;
  readonly ownership: string;
  readonly sources: ShaderSources;
}

export interface ShaderSources {
  readonly vertexShader: string;
  readonly fragmentShader: string;
}

/** The shared uniform clock — one object, updated once per frame, referenced by every shader. */
export interface SharedUniforms {
  readonly uTime: IUniform<number>;
  readonly uWorldTime: IUniform<number>;
  readonly uProgress: IUniform<number>;
  [uniform: string]: IUniform;
}

/**
 * Rendering Bible §2's pipeline order, reserved as the Render Pass
 * Foundation — the post-processing milestone composes real passes
 * against these slots; nothing composes them yet.
 */
export const RENDER_PASS_ORDER = ['scene', 'post-processing', 'tone-mapping', 'output'] as const;
export type RenderPassSlot = (typeof RENDER_PASS_ORDER)[number];

interface RegisteredShader {
  readonly definition: ShaderDefinition;
  readonly instances: Set<ShaderMaterial>;
}

export interface ShaderSystemHandle {
  readonly uniforms: SharedUniforms;
  readonly register: (definition: ShaderDefinition) => void;
  /** Instantiate a registered shader. Shared uniforms are injected by reference. */
  readonly createMaterial: (
    id: string,
    parameters?: Omit<ShaderMaterialParameters, 'vertexShader' | 'fragmentShader'>,
  ) => ShaderMaterial;
  readonly releaseMaterial: (id: string, material: ShaderMaterial) => void;
  /** Advance the shared clock — called once per frame by the canvas bridge. */
  readonly update: (deltaSeconds: number, worldTimeSeconds: number, progress: number) => void;
  readonly setQualityTier: (tier: QualityTier) => void;
  /** Development-only source swap — every live instance of the shader recompiles. */
  readonly hotSwap: (id: string, sources: Partial<ShaderSources>) => void;
  readonly dispose: () => void;
}

export function initShaderSystem(initialTier: QualityTier): ShaderSystemHandle {
  const registry = new Map<string, RegisteredShader>();
  let tier = initialTier;

  const uniforms: SharedUniforms = {
    uTime: { value: 0 },
    uWorldTime: { value: 0 },
    uProgress: { value: 0 },
  };

  const sourcesFor = (definition: ShaderDefinition): ShaderSources =>
    definition.fallback[tier] ?? definition.sources;

  return {
    uniforms,
    register: (definition) => {
      if (registry.has(definition.id)) {
        throw new EngineError(`shader "${definition.id}" is already registered`);
      }
      registry.set(definition.id, { definition, instances: new Set() });
    },
    createMaterial: (id, parameters = {}) => {
      const entry = registry.get(id);
      if (!entry) {
        throw new EngineError(`shader "${id}" is not registered — register before instantiating`);
      }
      const sources = sourcesFor(entry.definition);
      const material = new ShaderMaterial({
        ...parameters,
        vertexShader: sources.vertexShader,
        fragmentShader: sources.fragmentShader,
        uniforms: { ...uniforms, ...(parameters.uniforms ?? {}) },
      });
      material.name = `shader:${id}`;
      // Ownership marker: disposal happens through releaseMaterial,
      // never through the environment engine's subtree sweep.
      material.userData['sharedOwnership'] = true;
      entry.instances.add(material);
      return material;
    },
    releaseMaterial: (id, material) => {
      const entry = registry.get(id);
      entry?.instances.delete(material);
      material.dispose();
    },
    update: (deltaSeconds, worldTimeSeconds, progress) => {
      uniforms.uTime.value += deltaSeconds;
      uniforms.uWorldTime.value = worldTimeSeconds;
      uniforms.uProgress.value = progress;
    },
    setQualityTier: (next) => {
      if (next === tier) {
        return;
      }
      tier = next;
      // Live instances re-source under the new tier — an authored
      // fallback path, never an automatic truncation (Shader Bible §6).
      for (const entry of registry.values()) {
        const sources = sourcesFor(entry.definition);
        for (const material of entry.instances) {
          material.vertexShader = sources.vertexShader;
          material.fragmentShader = sources.fragmentShader;
          material.needsUpdate = true;
        }
      }
    },
    hotSwap: (id, sources) => {
      if (loadConfig().isProduction) {
        logger.warn('hotSwap ignored in production', { id });
        return;
      }
      const entry = registry.get(id);
      if (!entry) {
        return;
      }
      for (const material of entry.instances) {
        if (sources.vertexShader) {
          material.vertexShader = sources.vertexShader;
        }
        if (sources.fragmentShader) {
          material.fragmentShader = sources.fragmentShader;
        }
        material.needsUpdate = true;
      }
    },
    dispose: () => {
      for (const entry of registry.values()) {
        for (const material of entry.instances) {
          material.dispose();
        }
        entry.instances.clear();
      }
      registry.clear();
    },
  };
}
