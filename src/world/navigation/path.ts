import { CatmullRomCurve3, Curve, CurvePath, LineCurve3, Vector3 } from 'three';

/**
 * Multi-axis navigation path primitives — World Blueprint §2 and
 * Camera Bible §10, expressed as geometry.
 *
 * The journey is a 3D path with real variance on every axis: forward,
 * backward, lateral, vertical, diagonal, curved, orbital, spiral, and
 * branching — never a vertical webpage's single axis wearing a
 * costume. Everything here builds on three.js's own Curve classes
 * (official API: getPointAt/getTangentAt are arc-length
 * parameterized), so sampling cost and correctness rest on the
 * engine, not on custom math.
 *
 * These are primitives only. No authored world path exists yet — that
 * is M8/M9 content, built from these pieces.
 */

export interface PathSample {
  readonly position: Vector3;
  readonly tangent: Vector3;
}

export interface WorldPath {
  /** Samples position and unit tangent at arc-length-parameterized t (0..1) into the provided vectors. */
  sample(t: number, into: PathSample): void;
  getLength(): number;
}

/** Orbit primitive — partial revolution around a center. Camera Bible §14 caps a single continuous orbit at three-quarters of a revolution; the cap is enforced here, at the geometry level, so no caller can violate it. */
export const MAX_ORBIT_SWEEP = Math.PI * 1.5;

class OrbitCurve extends Curve<Vector3> {
  public constructor(
    private readonly center: Vector3,
    private readonly radius: number,
    private readonly startAngle: number,
    private readonly sweep: number,
    private readonly height: number,
  ) {
    super();
  }

  public override getPoint(t: number, target = new Vector3()): Vector3 {
    const angle = this.startAngle + this.sweep * t;
    return target.set(
      this.center.x + Math.cos(angle) * this.radius,
      this.center.y + this.height,
      this.center.z + Math.sin(angle) * this.radius,
    );
  }
}

/** Spiral primitive — orbit + rise, the Camera Language's rarest move (§8). Same sweep cap as Orbit. */
class HelixCurve extends Curve<Vector3> {
  public constructor(
    private readonly center: Vector3,
    private readonly radius: number,
    private readonly startAngle: number,
    private readonly sweep: number,
    private readonly startHeight: number,
    private readonly rise: number,
  ) {
    super();
  }

  public override getPoint(t: number, target = new Vector3()): Vector3 {
    const angle = this.startAngle + this.sweep * t;
    return target.set(
      this.center.x + Math.cos(angle) * this.radius,
      this.center.y + this.startHeight + this.rise * t,
      this.center.z + Math.sin(angle) * this.radius,
    );
  }
}

class CurveAdapter implements WorldPath {
  public constructor(public readonly curve: Curve<Vector3>) {}

  public sample(t: number, into: PathSample): void {
    this.curve.getPointAt(Math.min(Math.max(t, 0), 1), into.position);
    this.curve.getTangentAt(Math.min(Math.max(t, 0), 1), into.tangent);
  }

  public getLength(): number {
    return this.curve.getLength();
  }
}

export function createLinePath(from: Vector3, to: Vector3): WorldPath {
  return new CurveAdapter(new LineCurve3(from.clone(), to.clone()));
}

/** Smooth path through waypoints — Curve travel per Camera Bible §8 (all Traveling-state motion is Curve by default; straight lines are rationed). */
export function createSmoothPath(waypoints: readonly Vector3[]): WorldPath {
  return new CurveAdapter(
    new CatmullRomCurve3(
      waypoints.map((point) => point.clone()),
      false,
      'centripetal',
    ),
  );
}

export function createOrbitPath(
  center: Vector3,
  radius: number,
  startAngle: number,
  sweep: number,
  height = 0,
): WorldPath {
  const cappedSweep = Math.sign(sweep) * Math.min(Math.abs(sweep), MAX_ORBIT_SWEEP);
  return new CurveAdapter(new OrbitCurve(center.clone(), radius, startAngle, cappedSweep, height));
}

export function createSpiralPath(
  center: Vector3,
  radius: number,
  startAngle: number,
  sweep: number,
  startHeight: number,
  rise: number,
): WorldPath {
  const cappedSweep = Math.sign(sweep) * Math.min(Math.abs(sweep), MAX_ORBIT_SWEEP);
  return new CurveAdapter(
    new HelixCurve(center.clone(), radius, startAngle, cappedSweep, startHeight, rise),
  );
}

/** Vertical travel — Rise/Dive per Camera Bible §8. A line whose dominant axis is Y. */
export function createVerticalPath(from: Vector3, heightDelta: number): WorldPath {
  return createLinePath(from, from.clone().setY(from.y + heightDelta));
}

/** Sequential composition — bridges, corridors, chambers as distinct segments (World Blueprint §4's Transition Spaces). Uses three.js CurvePath's own arc-length handling. */
export function createCompositePath(segments: readonly WorldPath[]): WorldPath {
  const curvePath = new CurvePath<Vector3>();
  for (const segment of segments) {
    if (segment instanceof CurveAdapter) {
      curvePath.add(segment.curve);
    }
  }
  return new CurveAdapter(curvePath);
}

/**
 * Branch transitions — World Blueprint §2's Portal/Bridge forks.
 * A base path that continues into whichever branch is currently
 * selected. Selection is a navigation decision made by authored
 * content (a Discipline Zone entry), never by free steering.
 */
export class BranchingPath implements WorldPath {
  private active: string;

  public constructor(
    private readonly base: WorldPath,
    private readonly branches: Readonly<Record<string, WorldPath>>,
    initialBranch: string,
  ) {
    this.active = initialBranch;
  }

  public selectBranch(key: string): boolean {
    if (!(key in this.branches)) {
      return false;
    }
    this.active = key;
    return true;
  }

  public get activeBranch(): string {
    return this.active;
  }

  public sample(t: number, into: PathSample): void {
    const branch = this.branches[this.active];
    if (!branch) {
      this.base.sample(t, into);
      return;
    }
    const baseLength = this.base.getLength();
    const totalLength = baseLength + branch.getLength();
    const split = totalLength > 0 ? baseLength / totalLength : 0.5;

    if (t <= split || split === 0) {
      this.base.sample(split > 0 ? t / split : 0, into);
    } else {
      branch.sample((t - split) / (1 - split), into);
    }
  }

  public getLength(): number {
    const branch = this.branches[this.active];
    return this.base.getLength() + (branch ? branch.getLength() : 0);
  }
}

export function createPathSample(): PathSample {
  return { position: new Vector3(), tangent: new Vector3() };
}
