import type { NextConfig } from 'next';

/**
 * Kept intentionally minimal in Phase 0.
 * Bundle-splitting strategy (Theatre Studio, React Flow, dev HUD -> lazy)
 * is an Engineering Review item for Phase 1/11, not Phase 0.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei'],
  },
};

export default nextConfig;
