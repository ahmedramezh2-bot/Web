/**
 * Storage that never throws — private modes and file:// contexts
 * must degrade silently (Creative Bible: Quality — error tolerance).
 */

export const store = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* the void forgets, gracefully */
    }
  },
};
