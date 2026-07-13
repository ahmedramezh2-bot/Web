import { ConfigValidationError } from '@lib/errors';

import { REGIONS, ZONES, getWorldNode, type WorldNode } from './registry';

/**
 * The Spatial Graph — how the world's Physical Locations connect.
 *
 * Nodes are the registry's Regions and Zones; edges are the World
 * Blueprint §2 traversal types. The Main Path is the sequential spine;
 * Discipline Zones hang off The Origin Core via service edges (the
 * post-Origin functional layer, Technical Addendum §8 / Camera Bible
 * §8's Service Transition). Hidden Zone edges arrive with authored
 * content — the graph accepts them; none exist yet.
 */

export type EdgeKind = 'path' | 'bridge' | 'portal' | 'service' | 'hidden';

export interface WorldEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: EdgeKind;
  readonly bidirectional: boolean;
}

export class SpatialGraph {
  private readonly adjacency = new Map<string, WorldEdge[]>();
  private readonly edges: WorldEdge[] = [];

  public addEdge(edge: WorldEdge): void {
    if (!getWorldNode(edge.from) || !getWorldNode(edge.to)) {
      throw new ConfigValidationError(
        `spatial edge references unknown node: ${edge.from} -> ${edge.to}`,
      );
    }
    this.edges.push(edge);
    this.link(edge.from, edge);
    if (edge.bidirectional) {
      this.link(edge.to, edge);
    }
  }

  private link(nodeId: string, edge: WorldEdge): void {
    const list = this.adjacency.get(nodeId);
    if (list) {
      list.push(edge);
    } else {
      this.adjacency.set(nodeId, [edge]);
    }
  }

  public neighbors(nodeId: string): readonly WorldNode[] {
    const list = this.adjacency.get(nodeId) ?? [];
    const result: WorldNode[] = [];
    for (const edge of list) {
      const otherId = edge.from === nodeId ? edge.to : edge.from;
      const node = getWorldNode(otherId);
      if (node) {
        result.push(node);
      }
    }
    return result;
  }

  public edgesFrom(nodeId: string): readonly WorldEdge[] {
    return this.adjacency.get(nodeId) ?? [];
  }

  public allEdges(): readonly WorldEdge[] {
    return this.edges;
  }
}

/**
 * Builds the canonical baseline graph: the Main Path spine in region
 * order, plus service edges from The Origin Core to every Discipline
 * Zone. Authored content extends this; it never rebuilds it.
 */
export function buildBaselineGraph(): SpatialGraph {
  const graph = new SpatialGraph();

  for (let i = 0; i < REGIONS.length - 1; i += 1) {
    const from = REGIONS[i];
    const to = REGIONS[i + 1];
    if (from && to) {
      graph.addEdge({ from: from.id, to: to.id, kind: 'path', bidirectional: true });
    }
  }

  for (const zone of ZONES) {
    graph.addEdge({ from: 'origin-core', to: zone.id, kind: 'service', bidirectional: true });
  }

  return graph;
}
