import { CanvasLoader } from '@world/canvas/CanvasLoader';

/**
 * Root route. Mounts the persistent World Canvas only — per this
 * folder's own scope, no chapter content, no story, no UI.
 *
 * Stays a Server Component; the actual `next/dynamic({ ssr: false })`
 * boundary lives in CanvasLoader, since that option is only valid
 * inside a Client Component.
 */
export default function RootPage() {
  return <CanvasLoader />;
}
