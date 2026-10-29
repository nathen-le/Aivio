/**
 * Lets sign-out wait for unsaved progress without the auth layer knowing how
 * progress is stored. The progress hook registers a flusher for the signed-in
 * account; logout calls flushPendingSaves() before ending the session.
 */
type Flusher = () => Promise<boolean>;

let activeFlusher: Flusher | null = null;

export function registerPendingSaveFlusher(flusher: Flusher): () => void {
  activeFlusher = flusher;
  return () => {
    if (activeFlusher === flusher) activeFlusher = null;
  };
}

/** Resolves true when nothing is left unsaved, false if a save failed or timed out. */
export async function flushPendingSaves(timeoutMs = 10_000): Promise<boolean> {
  const flusher = activeFlusher;
  if (!flusher) return true;
  const timeout = new Promise<boolean>((resolve) => {
    window.setTimeout(() => resolve(false), timeoutMs);
  });
  try {
    return await Promise.race([flusher(), timeout]);
  } catch {
    return false;
  }
}

/** Thrown by logout when unsaved progress could not be written first. */
export class UnsavedProgressError extends Error {
  constructor() {
    super('Your latest progress has not been saved yet.');
    this.name = 'UnsavedProgressError';
  }
}
