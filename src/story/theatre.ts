/**
 * Story — one responsibility: Theatre.js is the Film Director.
 *
 * The project and its master sheet are created once, here, and every
 * cinematic sequence (camera, light, environment, music layers) is
 * choreographed on Theatre sheets — never with ad-hoc tweens
 * (Creative Bible: Motion / Engineering).
 *
 * GSAP is deliberately NOT imported in this module: interface
 * micro-motion and cinema direction stay separate.
 *
 * Studio (the editor) mounts only in dev, or when the URL carries
 * `?edit` — a director's tool, never shipped to visitors' eyes.
 */

import { getProject, type IProject, type ISheet } from '@theatre/core';
import { STORY } from '@/config/constants';
import bakedState from './state.json';

let project: IProject | null = null;

export function getStoryProject(): IProject {
  if (!project) {
    // The baked state ships with the bundle. Directors working in
    // `?edit` overwrite it via Studio's Export and commit the JSON —
    // that is how choreography becomes canon.
    project = getProject(STORY.project, { state: bakedState });
  }
  return project;
}

/** The master journey sheet — chapters attach their tracks here. */
export function getJourneySheet(): ISheet {
  return getStoryProject().sheet(STORY.journeySheet);
}

/** Mount the director's console when explicitly invited. */
export async function mountStudioIfInvited(): Promise<void> {
  const invited =
    import.meta.env.DEV || new URLSearchParams(window.location.search).has('edit');
  if (!invited) return;
  const studio = (await import('@theatre/studio')).default;
  studio.initialize();
}
