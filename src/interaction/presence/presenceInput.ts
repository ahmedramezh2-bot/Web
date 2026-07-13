import { clamp } from '@lib/motion';
import { usePresenceStore } from '@state/presenceStore';

/**
 * Unified presence input — Camera Bible §12 (desktop) and §13 (mobile).
 *
 * One attachment point, two models, differentiated by the event's own
 * pointerType (capability-driven, never device sniffing):
 *
 * - mouse: continuous positional tracking, normalized -1..1 from
 *   viewport center, full strength — desktop's precise gaze lean.
 * - touch: pressure-style influence — intensity builds with hold
 *   duration, not drag distance; a finger is not a mouse and is never
 *   treated as one (§13, §14).
 *
 * Output is only ever the normalized presence signal. Nothing here
 * touches the camera — the rig's presence layer consumes the store.
 */

/** Touch pressure reaches full strength after this hold duration (§13's duration-scaled intensity). Provisional. */
const TOUCH_FULL_PRESSURE_SECONDS = 1.2;

export interface PresenceInputHandle {
  readonly dispose: () => void;
}

export function attachPresenceInput(target: Window = window): PresenceInputHandle {
  let touchActive = false;
  let touchStartTime = 0;
  let touchX = 0;
  let touchY = 0;
  let pressureRafId = 0;

  const normalized = (clientX: number, clientY: number): { x: number; y: number } => ({
    x: clamp((clientX / target.innerWidth) * 2 - 1, -1, 1),
    y: clamp(-((clientY / target.innerHeight) * 2 - 1), -1, 1),
  });

  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') {
      if (touchActive) {
        const point = normalized(event.clientX, event.clientY);
        touchX = point.x;
        touchY = point.y;
      }
      return;
    }
    const point = normalized(event.clientX, event.clientY);
    usePresenceStore.getState().setSignal(point.x, point.y, 1, 'mouse');
  };

  const pressureLoop = (): void => {
    if (!touchActive) {
      return;
    }
    const held = (performance.now() - touchStartTime) / 1000;
    const strength = clamp(held / TOUCH_FULL_PRESSURE_SECONDS, 0, 1);
    usePresenceStore.getState().setSignal(touchX, touchY, strength, 'touch');
    pressureRafId = requestAnimationFrame(pressureLoop);
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') {
      return;
    }
    touchActive = true;
    touchStartTime = performance.now();
    const point = normalized(event.clientX, event.clientY);
    touchX = point.x;
    touchY = point.y;
    pressureRafId = requestAnimationFrame(pressureLoop);
  };

  const onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') {
      return;
    }
    touchActive = false;
    cancelAnimationFrame(pressureRafId);
    usePresenceStore.getState().clear();
  };

  target.addEventListener('pointermove', onPointerMove, { passive: true });
  target.addEventListener('pointerdown', onPointerDown, { passive: true });
  target.addEventListener('pointerup', onPointerEnd, { passive: true });
  target.addEventListener('pointercancel', onPointerEnd, { passive: true });

  return {
    dispose: () => {
      cancelAnimationFrame(pressureRafId);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerdown', onPointerDown);
      target.removeEventListener('pointerup', onPointerEnd);
      target.removeEventListener('pointercancel', onPointerEnd);
    },
  };
}
