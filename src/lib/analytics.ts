import { createLogger } from './logger';

/**
 * Privacy-first Analytics — Part 11's metrics (time exploring, chapter
 * completion, journey depth) and nothing else. No identifiers, no
 * fingerprinting, no cookies, no third-party scripts.
 *
 * Disabled by default: events buffer in memory and go nowhere until a
 * transport is explicitly configured at deployment time. Error
 * reporting shares the same pipeline — an uncaught error is an event,
 * subject to the same privacy floor (messages only, never stack-borne
 * user data).
 */

const logger = createLogger('Analytics');

export interface AnalyticsEvent {
  readonly kind: string;
  readonly detail: string;
  readonly sessionTimeMs: number;
}

export type AnalyticsTransport = (events: readonly AnalyticsEvent[]) => Promise<void>;

/** Buffer cap — memory stays bounded when no transport ever arrives. */
const MAX_BUFFERED_EVENTS = 500;

/** Flush cadence once a transport exists. */
const FLUSH_INTERVAL_MS = 15000;

export interface AnalyticsHubHandle {
  readonly record: (kind: string, detail: string) => void;
  readonly setTransport: (transport: AnalyticsTransport) => void;
  readonly installErrorReporting: () => () => void;
  readonly dispose: () => void;
}

export function initAnalyticsHub(): AnalyticsHubHandle {
  const sessionStart = typeof performance !== 'undefined' ? performance.now() : 0;
  const buffer: AnalyticsEvent[] = [];
  let transport: AnalyticsTransport | undefined;
  let flushTimer: ReturnType<typeof setInterval> | undefined;

  const flush = async (): Promise<void> => {
    if (!transport || buffer.length === 0) {
      return;
    }
    const batch = buffer.splice(0, buffer.length);
    try {
      await transport(batch);
    } catch (cause) {
      logger.warn('analytics flush failed — batch dropped', {
        count: batch.length,
        message: cause instanceof Error ? cause.message : String(cause),
      });
    }
  };

  return {
    record: (kind, detail) => {
      buffer.push({
        kind,
        detail,
        sessionTimeMs: Math.round(performance.now() - sessionStart),
      });
      if (buffer.length > MAX_BUFFERED_EVENTS) {
        buffer.shift();
      }
    },
    setTransport: (next) => {
      transport = next;
      flushTimer ??= setInterval(() => {
        void flush();
      }, FLUSH_INTERVAL_MS);
    },
    installErrorReporting: () => {
      const onError = (event: ErrorEvent): void => {
        buffer.push({
          kind: 'error',
          detail: event.message,
          sessionTimeMs: Math.round(performance.now() - sessionStart),
        });
      };
      const onRejection = (event: PromiseRejectionEvent): void => {
        const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
        buffer.push({
          kind: 'unhandled-rejection',
          detail: reason,
          sessionTimeMs: Math.round(performance.now() - sessionStart),
        });
      };
      window.addEventListener('error', onError);
      window.addEventListener('unhandledrejection', onRejection);
      return () => {
        window.removeEventListener('error', onError);
        window.removeEventListener('unhandledrejection', onRejection);
      };
    },
    dispose: () => {
      if (flushTimer !== undefined) {
        clearInterval(flushTimer);
      }
      buffer.length = 0;
    },
  };
}
