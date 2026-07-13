import type { NextConfig } from 'next';

/**
 * Bundle discipline is enforced structurally, not here: the three.js/
 * R3F payload loads behind `CanvasLoader`'s dynamic boundary, Tone.js
 * behind the gesture-gated audio start, GSAP behind `loadUiMotion()`.
 * Theatre Studio and React Flow are development-facing and never enter
 * a visitor bundle.
 *
 * Security headers follow the Next.js headers() reference. Notes:
 * - No CSP yet: R3F/three inject inline styles and the app has no
 *   user-generated content or third-party scripts to contain; a strict
 *   CSP is deferred to deployment configuration where the hosting
 *   origin is known.
 * - Permissions-Policy deliberately leaves gyroscope/accelerometer
 *   ungoverned: presence input (Camera Bible §9) may use device
 *   orientation when a visitor grants it.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
