/**
 * WebGL capability probe.
 *
 * The renderer must never be the thing that discovers WebGL is
 * unavailable — three.js reports that discovery as an uncaught
 * exception and console errors mid-mount. Probing a detached canvas
 * first (MDN: HTMLCanvasElement.getContext returns null when the
 * context cannot be created) lets the application decline the canvas
 * gracefully: the server-rendered Threshold Shell simply remains, the
 * engine systems keep running, and nothing throws.
 *
 * The result is cached — context availability does not change within
 * a page's lifetime, and probing costs a real GPU context handle.
 */

let cached: boolean | undefined;

export function isWebGlSupported(): boolean {
  if (cached !== undefined) {
    return cached;
  }
  if (typeof document === 'undefined') {
    return false;
  }
  const probe = document.createElement('canvas');
  const context = probe.getContext('webgl2') ?? probe.getContext('webgl');
  cached = context !== null;
  // Free the probe's GPU handle immediately rather than waiting for GC.
  context?.getExtension('WEBGL_lose_context')?.loseContext();
  return cached;
}
