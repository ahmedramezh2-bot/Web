'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side loader boundary for the World Canvas.
 *
 * `next/dynamic`'s `ssr: false` option is only permitted inside a
 * Client Component — this file exists solely to hold that boundary so
 * the root page itself can stay a Server Component. WebGL has no
 * server-side representation; deferring the three.js/R3F payload out
 * of the synchronous initial bundle keeps First Load JS inside
 * Appendix F's <300KB gzip target.
 */
export const CanvasLoader = dynamic(
  () => import('./HebraCanvas').then((module) => module.HebraCanvas),
  { ssr: false },
);
