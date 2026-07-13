/**
 * The Accessibility Layer — the parallel, equally-considered path
 * through HEBRA (UI Integration Bible §10: never a stripped-down
 * "accessible mode," never an afterthought).
 *
 * Reduced Motion itself lives in the camera store (Camera Bible §16 —
 * an authored branch, read there by every motion system). This module
 * owns the DOM-side mechanics: focus management for panel lifecycles,
 * and polite screen-reader announcements for narrative moments that
 * sighted visitors receive visually.
 */

/** Everything focusable inside a container, in DOM order — the focus trap's working set. */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface FocusTrapHandle {
  readonly release: () => void;
}

/**
 * Traps Tab focus inside a container while a panel is open and
 * restores focus to the previously-focused element on release —
 * standard modal-dialog focus behavior per WAI-ARIA authoring
 * practice, applied to world-integrated panels.
 */
export function trapFocus(container: HTMLElement): FocusTrapHandle {
  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : undefined;

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener('keydown', onKeyDown);
  const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  firstFocusable?.focus();

  return {
    release: () => {
      container.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    },
  };
}

let liveRegion: HTMLElement | undefined;

/**
 * Politely announce a narrative moment to screen readers (aria-live
 * region, created once, visually hidden). The announcement is the
 * accessible parallel of what sighted visitors receive through the
 * camera and lighting — same story, different channel.
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clipPath = 'inset(50%)';
    liveRegion.style.whiteSpace = 'nowrap';
    document.body.appendChild(liveRegion);
  }
  // Clearing first re-triggers announcement of identical consecutive messages.
  liveRegion.textContent = '';
  liveRegion.textContent = message;
}
