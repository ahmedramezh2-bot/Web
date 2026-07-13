import { CanvasLoader } from '@world/canvas/CanvasLoader';

/**
 * Root route. Mounts the persistent World Canvas plus the Threshold
 * Shell — the server-rendered surface underneath it.
 *
 * The shell exists because WebGL has no server-side representation:
 * without it the document body ships empty (no first paint, nothing
 * for crawlers or screen readers until JavaScript boots). It renders
 * the world's identity — name and one-line nature — and nothing more;
 * the canvas, once mounted, covers it entirely. Colors are the Color
 * Bible §4 near-black / near-white anchors, provisional values until
 * Design Token authoring.
 *
 * Stays a Server Component; the actual `next/dynamic({ ssr: false })`
 * boundary lives in CanvasLoader, since that option is only valid
 * inside a Client Component.
 */
export default function RootPage() {
  return (
    <>
      <main className="hebra-threshold">
        <h1 className="hebra-threshold-name">HEBRA</h1>
        <p className="hebra-threshold-nature">
          A digital civilization — a cinematic world of design, identity, and interactive
          experience.
        </p>
        <noscript>
          <p className="hebra-threshold-nature">HEBRA is a living world; it requires JavaScript.</p>
        </noscript>
      </main>
      <CanvasLoader />
    </>
  );
}
