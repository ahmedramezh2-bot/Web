import { TypedEmitter } from '@lib/events';

/**
 * The World Event Dispatcher — spatial facts, as the story dispatcher
 * is narrative facts. Same emitter primitive, separate channel:
 * a system that cares where the visitor *is* subscribes here; a system
 * that cares where the story *is* subscribes to story events. The two
 * correlate but are never conflated (chapters are Level 1, regions are
 * Level 2 — docs/bible/26).
 */

export interface WorldEvents extends Record<string, unknown> {
  'region-entered': { readonly regionId: string; readonly from: string | undefined };
  'region-exited': { readonly regionId: string; readonly to: string };
  'region-load-requested': { readonly regionId: string };
  'region-loaded': { readonly regionId: string };
  'region-unloaded': { readonly regionId: string };
  /** The one-time crossing into The Origin Core — the functional layer unlock. */
  'origin-reached': { readonly firstTime: boolean };
}

export type WorldEmitter = TypedEmitter<WorldEvents>;

export function createWorldEmitter(): WorldEmitter {
  return new TypedEmitter<WorldEvents>();
}
