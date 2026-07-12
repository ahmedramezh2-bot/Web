/**
 * Structured logging infrastructure.
 *
 * Never a raw `console.log` scattered through feature code — every log
 * passes through here so level, scope, and production behavior are
 * enforced in one place (Development Standards §12: documented once,
 * never re-explained ad hoc at each call site).
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  readonly level: LogLevel;
  readonly scope: string;
  readonly message: string;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly timestamp: number;
}

type LogSink = (entry: LogEntry) => void;

const isProduction = process.env.NODE_ENV === 'production';

const consoleSink: LogSink = (entry) => {
  const prefix = `[${entry.scope}]`;
  switch (entry.level) {
    case 'debug':
    case 'info':
      // Silenced in production — debug/info are development-only signal.
      if (!isProduction) {
        // eslint-disable-next-line no-console
        console.log(prefix, entry.message, entry.data ?? '');
      }
      break;
    case 'warn':
      console.warn(prefix, entry.message, entry.data ?? '');
      break;
    case 'error':
      console.error(prefix, entry.message, entry.data ?? '');
      break;
  }
};

const sinks: LogSink[] = [consoleSink];

/**
 * Register an additional log sink (e.g. a future remote diagnostics
 * pipeline). Never required for the engine to function — logging must
 * never become a dependency anything else waits on.
 */
export function addLogSink(sink: LogSink): void {
  sinks.push(sink);
}

function emit(
  level: LogLevel,
  scope: string,
  message: string,
  data?: Record<string, unknown>,
): void {
  const entry: LogEntry = {
    level,
    scope,
    message,
    ...(data !== undefined ? { data } : {}),
    timestamp: Date.now(),
  };
  for (const sink of sinks) {
    sink(entry);
  }
}

/**
 * Create a scoped logger. Every system that logs owns its own scope
 * name, so a log line always answers "who said this" per Development
 * Standards' naming discipline.
 */
export function createLogger(scope: string): {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
} {
  return {
    debug: (message, data) => emit('debug', scope, message, data),
    info: (message, data) => emit('info', scope, message, data),
    warn: (message, data) => emit('warn', scope, message, data),
    error: (message, data) => emit('error', scope, message, data),
  };
}
