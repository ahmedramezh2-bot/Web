import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Providers } from './providers';

import './globals.css';

/**
 * Next.js route entry.
 *
 * Owns nothing artistic — only mounts Providers (engine bootstrap +
 * error boundary) around whatever a route renders. Per this folder's
 * own scope: reserved for chapter deep-link routing once the World and
 * Camera systems exist; empty of any of that until then.
 */

export const metadata: Metadata = {
  title: 'HEBRA',
  description:
    'HEBRA — a digital civilization. A cinematic world of design, identity, and interactive experience.',
  openGraph: {
    title: 'HEBRA',
    description:
      'HEBRA — a digital civilization. A cinematic world of design, identity, and interactive experience.',
    type: 'website',
    siteName: 'HEBRA',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
