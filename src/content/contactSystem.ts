import { z } from 'zod';

import { createLogger } from '@lib/logger';

/**
 * The Contact System — validation layer and submission pipeline for
 * the Contact destination (Level 4, hosted in The Identity Zone).
 *
 * Transport is pluggable and absent by default: no backend endpoint
 * exists yet, and this system never pretends one does — a submission
 * with no transport fails honestly with 'unavailable', never fakes
 * success. Validation happens here, once, for whatever surface
 * (world-integrated panel, keyboard-accessible parallel path)
 * eventually collects the message.
 */

const logger = createLogger('ContactSystem');

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export type SubmissionResult =
  | { readonly status: 'sent' }
  | { readonly status: 'invalid'; readonly issues: readonly string[] }
  | { readonly status: 'unavailable' }
  | { readonly status: 'failed'; readonly reason: string };

/** The pluggable delivery mechanism — registered at deployment configuration time, never hardcoded. */
export type ContactTransport = (message: ContactMessage) => Promise<void>;

export interface ContactSystemHandle {
  readonly setTransport: (transport: ContactTransport) => void;
  readonly submit: (input: unknown) => Promise<SubmissionResult>;
}

export function initContactSystem(): ContactSystemHandle {
  let transport: ContactTransport | undefined;

  return {
    setTransport: (next) => {
      transport = next;
    },
    submit: async (input) => {
      const parsed = contactMessageSchema.safeParse(input);
      if (!parsed.success) {
        return {
          status: 'invalid',
          issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
        };
      }
      if (!transport) {
        logger.warn('contact submission with no transport configured');
        return { status: 'unavailable' };
      }
      try {
        await transport(parsed.data);
        return { status: 'sent' };
      } catch (cause) {
        const reason = cause instanceof Error ? cause.message : String(cause);
        logger.error('contact transport failed', { reason });
        return { status: 'failed', reason };
      }
    },
  };
}
