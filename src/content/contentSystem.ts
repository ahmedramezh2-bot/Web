import { z } from 'zod';

import { ConfigValidationError } from '@lib/errors';
import { createLogger } from '@lib/logger';

/**
 * The Content System — every piece of business and narrative copy
 * enters the world through here, Zod-validated at the boundary
 * (content/schema doctrine: a malformed document fails loud here,
 * never deep in a renderer).
 *
 * The five Services are Level 4 Business Destinations — constitutional
 * data (docs/bible/26 §5), transcribed with their canonical host
 * Zones, never invented. Their *copy* (descriptions, case studies) is
 * authored content that arrives through registration; none is invented
 * here. The portfolio registry is genuinely empty: real projects are
 * real-world facts this system receives, never fabricates.
 */

const logger = createLogger('ContentSystem');

export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

/** Bilingual text — Arabic is a first-class parallel system (Typography Bible §10), so the type refuses monolingual content. */
const localizedTextSchema = z.object({ en: z.string().min(1), ar: z.string().min(1) });
export type LocalizedText = z.infer<typeof localizedTextSchema>;

const serviceSchema = z.object({
  id: z.string().min(1),
  /** Canonical Level 4 name — constitutional, docs/bible/26 §5. */
  name: z.string().min(1),
  /** The Discipline Zone hosting this destination — docs/bible/26 §3. */
  hostZone: z.string().min(1),
  /** Authored copy — registered by content authoring, absent until then. */
  description: localizedTextSchema.optional(),
});
export type Service = z.infer<typeof serviceSchema>;

const projectSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  category: z.string().min(1),
  summary: localizedTextSchema,
  /** Media references resolved by the asset pipeline — paths, never embedded blobs. */
  media: z.array(z.string()).readonly(),
});
export type Project = z.infer<typeof projectSchema>;

/** The five canonical Business Destinations plus the three informational ones, with their constitutional host Zones. */
const SERVICES_DATA: readonly Service[] = [
  { id: 'website-design', name: 'Website Design', hostZone: 'creation-zone' },
  { id: 'brand-identity', name: 'Brand Identity', hostZone: 'creation-zone' },
  { id: 'interactive-experiences', name: 'Interactive Experiences', hostZone: 'architecture-zone' },
  { id: 'ai-systems', name: 'AI Systems', hostZone: 'technology-zone' },
  { id: 'career-boost', name: 'Career Boost', hostZone: 'legacy-zone' },
  { id: 'projects', name: 'Projects', hostZone: 'creation-zone' },
  { id: 'about', name: 'About', hostZone: 'identity-zone' },
  { id: 'contact', name: 'Contact', hostZone: 'identity-zone' },
];

export interface ContentSystemHandle {
  readonly services: () => readonly Service[];
  readonly service: (id: string) => Service | undefined;
  /** Attach authored copy to a canonical service — validated, never replacing identity fields. */
  readonly setServiceCopy: (id: string, description: LocalizedText) => boolean;
  readonly projects: () => readonly Project[];
  readonly registerProject: (project: Project) => boolean;
  readonly projectsByCategory: (category: string) => readonly Project[];
}

export function initContentSystem(): ContentSystemHandle {
  const parsedServices = z.array(serviceSchema).safeParse(SERVICES_DATA);
  if (!parsedServices.success) {
    throw new ConfigValidationError(`service registry invalid: ${parsedServices.error.message}`);
  }

  const services = new Map<string, Service>(
    parsedServices.data.map((service) => [service.id, service]),
  );
  const projects = new Map<string, Project>();

  return {
    services: () => [...services.values()],
    service: (id) => services.get(id),
    setServiceCopy: (id, description) => {
      const existing = services.get(id);
      if (!existing) {
        logger.error('copy for unknown service refused', { id });
        return false;
      }
      const parsed = localizedTextSchema.safeParse(description);
      if (!parsed.success) {
        logger.error('service copy failed validation', { id });
        return false;
      }
      services.set(id, { ...existing, description: parsed.data });
      return true;
    },
    projects: () => [...projects.values()],
    registerProject: (project) => {
      const parsed = projectSchema.safeParse(project);
      if (!parsed.success) {
        logger.error('project failed validation', { id: project.id });
        return false;
      }
      if (projects.has(parsed.data.id)) {
        logger.error('duplicate project id refused', { id: parsed.data.id });
        return false;
      }
      projects.set(parsed.data.id, parsed.data);
      return true;
    },
    projectsByCategory: (category) =>
      [...projects.values()].filter((project) => project.category === category),
  };
}
