import { createLogger } from '@lib/logger';
import { sharedTicker } from '@lib/ticker';
import { useNavigationStore } from '@state/navigationStore';
import { useWorldStore } from '@state/worldStore';

import { createWorldEmitter, type WorldEmitter } from './events';
import { regionAtProgress, REGIONS, type Region } from './registry';
import { buildBaselineGraph, type SpatialGraph } from './spatialGraph';
import { StreamingManager } from './streaming';
import { WorldClock } from './worldTime';

/**
 * The World Engine — the spatial runtime's composition root.
 *
 * One world exists (Part 3's law; docs/bible/26 §7 reserves the word
 * "World" for it exclusively). This engine owns that world's lifecycle:
 * region membership as progress moves, streaming reconciliation, the
 * world clock, the spatial graph, and the Origin crossing. Multi-world
 * support, in HEBRA's constitutional sense, means this engine is
 * instantiated from a definition rather than globals — a future
 * expansion could construct another; HEBRA registers exactly one, and
 * the active world is never unloaded or replaced.
 */

const logger = createLogger('WorldEngine');

/** Region-change hysteresis in progress units — same boundary-flap guard the story engine applies to chapters. */
const REGION_HYSTERESIS = 0.002;

export interface WorldEngineHandle {
  readonly events: WorldEmitter;
  readonly graph: SpatialGraph;
  readonly streaming: StreamingManager;
  readonly clock: WorldClock;
  readonly activeRegion: () => Region;
  readonly dispose: () => void;
}

export function initWorldEngine(): WorldEngineHandle {
  const events = createWorldEmitter();
  const graph = buildBaselineGraph();
  const streaming = new StreamingManager(events);
  const clock = new WorldClock();

  let active: Region = regionAtProgress(0);
  let originReached = false;
  useWorldStore.getState().setActiveRegion(active.id);

  // Loaded-set mirror for the store: updated on load/unload events,
  // never recomputed per frame.
  const loaded = new Set<string>();
  const offLoaded = events.on('region-loaded', ({ regionId }) => {
    loaded.add(regionId);
    useWorldStore.getState().setLoadedRegions([...loaded]);
  });
  const offUnloaded = events.on('region-unloaded', ({ regionId }) => {
    loaded.delete(regionId);
    useWorldStore.getState().setLoadedRegions([...loaded]);
  });

  const removeTick = sharedTicker.add((deltaSeconds) => {
    clock.advance(deltaSeconds);

    const progress = useNavigationStore.getState().progress;
    streaming.update(progress);

    const next = regionAtProgress(progress);
    if (next.id !== active.id && clearsRegionHysteresis(progress, active, next)) {
      const previous = active;
      active = next;
      useWorldStore.getState().setActiveRegion(next.id);
      events.emit('region-exited', { regionId: previous.id, to: next.id });
      events.emit('region-entered', { regionId: next.id, from: previous.id });

      if (next.id === 'origin-core' && !originReached) {
        originReached = true;
        events.emit('origin-reached', { firstTime: true });
      }
    }
  });

  logger.info('world engine initialized', {
    regions: REGIONS.length,
    edges: graph.allEdges().length,
  });

  return {
    events,
    graph,
    streaming,
    clock,
    activeRegion: () => active,
    dispose: () => {
      removeTick();
      offLoaded();
      offUnloaded();
      events.clear();
    },
  };
}

/** A region change is real once progress clears the shared boundary by the hysteresis margin in the direction of travel. */
function clearsRegionHysteresis(progress: number, current: Region, next: Region): boolean {
  if (next.span[0] >= current.span[1]) {
    return progress >= next.span[0] + REGION_HYSTERESIS;
  }
  return progress <= current.span[0] - REGION_HYSTERESIS;
}
