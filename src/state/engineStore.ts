import { create } from 'zustand';

/**
 * Core State Initialization — engine lifecycle only.
 *
 * Zustand stores are never business logic (Development Standards §6) —
 * this store holds exactly the engine's own boot status and nothing
 * about story, camera, or world content, all of which remain reserved
 * for their own owning milestones. A wider shared-state store (current
 * chapter, quality tier, audio, discovery/skip flags — per src/state's
 * original design intent) is built once those systems exist; building
 * it now would blur this milestone's boundary into theirs.
 */

export type EngineLifecycleStatus = 'idle' | 'booting' | 'ready' | 'error';

interface EngineState {
  readonly status: EngineLifecycleStatus;
  readonly error: string | undefined;
  readonly setStatus: (status: EngineLifecycleStatus) => void;
  readonly setError: (message: string) => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  status: 'idle',
  error: undefined,
  setStatus: (status) => set({ status }),
  setError: (message) => set({ status: 'error', error: message }),
}));
