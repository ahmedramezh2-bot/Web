import { z } from 'zod';

import { ConfigValidationError } from '@lib/errors';
import { CHAPTER_IDS, type ChapterId } from '@story/chapters';

/**
 * The World Registry — Levels 2 and 3 of the Canonical Naming
 * Architecture (docs/bible/26 §3–§4) as validated runtime data.
 *
 * Regions are the Main Path's Physical Locations; Zones are the six
 * post-Origin Discipline Zones. Names, kinds, chapter assignments and
 * Dialect assignments are constitutional data transcribed from
 * docs/bible/26 — never invented here. Progress spans are authored
 * against the script-derived chapter timeline (see REGIONS_DATA).
 */

export const DIALECT_IDS = [
  'attentive',
  'reverent',
  'active',
  'vast',
  'hushed',
  'genesis',
  'generative',
  'recollective',
] as const;

export type DialectId = (typeof DIALECT_IDS)[number];

const regionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.literal('region'),
  chapter: z.enum(CHAPTER_IDS),
  dialects: z.array(z.enum(DIALECT_IDS)).min(1),
  /** Main Path progress span [start, end], tiling the owning chapter's span. */
  span: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]),
});

const zoneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.literal('zone'),
  dialects: z.array(z.enum(DIALECT_IDS)).min(1),
  /** Zones live off the Main Path — reached via branch edges, never a progress span. */
  hosts: z.array(z.string()).readonly(),
});

export type Region = z.infer<typeof regionSchema>;
export type Zone = z.infer<typeof zoneSchema>;
export type WorldNode = Region | Zone;

/**
 * Level 2 Main Path locations, per docs/bible/26 §3. Spans are
 * authored against the script-derived chapter spans in
 * `@story/chapters` (Part 1's 00:00–04:00 timeline): each region
 * tiles its owning chapter's span, with the connective Energy Stream
 * carrying the second half of Fragments toward the Origin exactly as
 * docs/bible/26 §3 marks it ("Fragments → Origin (connective)").
 */
const REGIONS_DATA: readonly Region[] = [
  {
    id: 'starfield-reach',
    name: 'The Starfield Reach',
    kind: 'region',
    chapter: 'void',
    dialects: ['vast'],
    span: [0, 0.125],
  },
  {
    id: 'cosmic-dust-field',
    name: 'The Cosmic Dust Field',
    kind: 'region',
    chapter: 'void',
    dialects: ['vast'],
    span: [0.125, 0.25],
  },
  {
    id: 'monument-range',
    name: 'The Monument Range',
    kind: 'region',
    chapter: 'monument',
    dialects: ['reverent'],
    span: [0.25, 0.375],
  },
  {
    id: 'sentinel-ring',
    name: 'The Sentinel Ring',
    kind: 'region',
    chapter: 'monument',
    dialects: ['reverent'],
    span: [0.375, 0.5],
  },
  {
    id: 'crystal-garden',
    name: 'The Crystal Garden',
    kind: 'region',
    chapter: 'fragments',
    dialects: ['generative'],
    span: [0.5, 0.625],
  },
  {
    id: 'energy-stream',
    name: 'The Energy Stream',
    kind: 'region',
    chapter: 'fragments',
    dialects: ['active'],
    span: [0.625, 0.75],
  },
  {
    id: 'origin-core',
    name: 'The Origin Core',
    kind: 'region',
    chapter: 'origin',
    dialects: ['genesis'],
    span: [0.75, 0.875],
  },
  {
    id: 'distant-heart',
    name: 'The Distant Heart',
    kind: 'region',
    chapter: 'awakening',
    dialects: ['recollective'],
    span: [0.875, 0.9375],
  },
  {
    id: 'rising-gate',
    name: 'The Rising Gate',
    kind: 'region',
    chapter: 'threshold',
    dialects: ['vast', 'genesis'],
    span: [0.9375, 1],
  },
];

/** Level 2 Discipline Zones with their Level 4 Business Destination hosts, per docs/bible/26 §3. */
const ZONES_DATA: readonly Zone[] = [
  {
    id: 'creation-zone',
    name: 'The Creation Zone',
    kind: 'zone',
    dialects: ['generative', 'active'],
    hosts: ['website-design', 'brand-identity', 'projects'],
  },
  {
    id: 'identity-zone',
    name: 'The Identity Zone',
    kind: 'zone',
    dialects: ['attentive'],
    hosts: ['about', 'contact'],
  },
  {
    id: 'architecture-zone',
    name: 'The Architecture Zone',
    kind: 'zone',
    dialects: ['reverent'],
    hosts: ['interactive-experiences'],
  },
  {
    id: 'technology-zone',
    name: 'The Technology Zone',
    kind: 'zone',
    dialects: ['active'],
    hosts: ['ai-systems'],
  },
  {
    id: 'imagination-zone',
    name: 'The Imagination Zone',
    kind: 'zone',
    dialects: ['vast'],
    hosts: [],
  },
  {
    id: 'legacy-zone',
    name: 'The Legacy Zone',
    kind: 'zone',
    dialects: ['recollective', 'hushed'],
    hosts: ['career-boost'],
  },
];

function validate(): { regions: readonly Region[]; zones: readonly Zone[] } {
  const regions = z.array(regionSchema).safeParse(REGIONS_DATA);
  const zones = z.array(zoneSchema).safeParse(ZONES_DATA);
  if (!regions.success) {
    throw new ConfigValidationError(`region registry invalid: ${regions.error.message}`);
  }
  if (!zones.success) {
    throw new ConfigValidationError(`zone registry invalid: ${zones.error.message}`);
  }
  // Region spans must tile [0,1] contiguously — streaming depends on it.
  let cursor = 0;
  for (const region of regions.data) {
    if (Math.abs(region.span[0] - cursor) > 1e-9 || region.span[1] <= region.span[0]) {
      throw new ConfigValidationError(`region "${region.id}" breaks the Main Path tiling`);
    }
    cursor = region.span[1];
  }
  if (Math.abs(cursor - 1) > 1e-9) {
    throw new ConfigValidationError('region spans do not cover the Main Path');
  }
  const ids = new Set<string>();
  for (const node of [...regions.data, ...zones.data]) {
    if (ids.has(node.id)) {
      throw new ConfigValidationError(`duplicate world node id "${node.id}"`);
    }
    ids.add(node.id);
  }
  return { regions: regions.data, zones: zones.data };
}

const validated = validate();

export const REGIONS: readonly Region[] = validated.regions;
export const ZONES: readonly Zone[] = validated.zones;

const NODE_BY_ID = new Map<string, WorldNode>(
  [...REGIONS, ...ZONES].map((node) => [node.id, node]),
);

export function getWorldNode(id: string): WorldNode | undefined {
  return NODE_BY_ID.get(id);
}

export function regionAtProgress(progress: number): Region {
  const p = Math.min(Math.max(progress, 0), 1);
  for (const region of REGIONS) {
    const isLast = region === REGIONS[REGIONS.length - 1];
    if (p < region.span[1] || (isLast && p <= region.span[1])) {
      return region;
    }
  }
  return REGIONS[REGIONS.length - 1] as Region;
}

export function regionsForChapter(chapter: ChapterId): readonly Region[] {
  return REGIONS.filter((region) => region.chapter === chapter);
}
