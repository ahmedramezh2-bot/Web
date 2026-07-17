import type { AuthoritySampleContext, CinematicAuthority } from '@camera/authority';
import type { CameraPose } from '@camera/pose';
import { createLogger } from '@lib/logger';

import { JourneyAuthority } from './journey';

/**
 * The Theatre.js director's seat — Camera Bible §5 level 1, §15.
 *
 * Per the Theatre.js documentation, `@theatre/core` runs authored
 * animation from a project state exported by Theatre Studio;
 * `sequence.position` is a settable playhead. This adapter:
 *
 * - creates the HEBRA project/sheet/director object via the documented
 *   `getProject` → `project.sheet` → `sheet.object` API,
 * - drives `sequence.position` from journey progress every frame, so
 *   any studio-authored keyframes play in journey-time, and
 * - applies the director object's values as calibrated adjustments on
 *   top of the code-authored Journey tracks (`journey.ts`).
 *
 * The base choreography lives in code because Theatre's keyframe state
 * is produced by the Studio GUI (its internal JSON is not a documented
 * hand-authoring surface) — the sheet exposes the same dials so a
 * studio session can refine the film without a code change. @theatre/
 * core is imported dynamically: the director's seat must not enter the
 * First Load bundle (Appendix F).
 */

const logger = createLogger('TheatreAuthority');

/** Journey-time length of the Theatre sequence, in sequence seconds. */
const SEQUENCE_LENGTH_SECONDS = 240;

interface DirectorValues {
  intensity: number;
  fovBias: number;
  gazeLift: number;
}

export class TheatreAuthority implements CinematicAuthority {
  private readonly journey = new JourneyAuthority();
  private readonly director: DirectorValues = { intensity: 1, fovBias: 0, gazeLift: 0 };
  private setSequencePosition: ((seconds: number) => void) | undefined;

  /**
   * Loads @theatre/core and seats the sheet. Safe to call once, any
   * time after boot; until it resolves the seat runs on the journey
   * tracks alone with neutral director values.
   */
  public async connect(): Promise<void> {
    try {
      const theatre = await import('@theatre/core');
      // Without @theatre/studio in the bundle, core requires an
      // explicit state (its own runtime error says exactly this). The
      // empty-but-valid state below is the documented production shape;
      // a studio-exported file replaces it when the film is refined.
      const project = theatre.getProject('HEBRA', {
        state: { sheetsById: {}, definitionVersion: '0.4.0', revisionHistory: [] },
      });
      const sheet = project.sheet('camera');
      const director = sheet.object('director', {
        intensity: theatre.types.number(1, { range: [0, 1] }),
        fovBias: theatre.types.number(0, { range: [-8, 8] }),
        gazeLift: theatre.types.number(0, { range: [-4, 4] }),
      });
      director.onValuesChange((values) => {
        this.director.intensity = values.intensity;
        this.director.fovBias = values.fovBias;
        this.director.gazeLift = values.gazeLift;
      });
      this.setSequencePosition = (seconds) => {
        sheet.sequence.position = seconds;
      };
      await project.ready;
      logger.info('Theatre.js director seated');
    } catch (cause) {
      // The film still plays on the journey tracks — the seat degrades
      // to code-authored choreography, never to a broken camera.
      logger.warn('Theatre.js unavailable — journey tracks only', {
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  }

  public samplePose(context: AuthoritySampleContext, into: CameraPose): void {
    this.journey.samplePose(context, into);
    this.setSequencePosition?.(context.progress * SEQUENCE_LENGTH_SECONDS);
    into.fov += this.director.fovBias * this.director.intensity;
    into.target.y += this.director.gazeLift * this.director.intensity;
  }
}
