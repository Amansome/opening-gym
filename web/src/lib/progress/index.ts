// Progress module: spaced repetition (ts-fsrs), unlocks, streaks, scores, JSON backup.
// Pages and the Trainer import ONLY from "lib/progress" (this file) and "lib/progress/useProgress".
import type { ProgressApi } from "./api";
import { createProgress } from "./service";
import { idbBackend } from "./storage";

export * from "./api";
export { createProgress, type ProgressOptions } from "./service";
export { idbBackend, memoryBackend, type KvBackend } from "./storage";
export { ProgressDataError } from "./snapshot";

/** The app-wide instance: IndexedDB ("opening-gym" / "kv") with memory-only fallback. */
export const progress: ProgressApi = createProgress({ backend: idbBackend() });
export { localDayKey } from "./dates";
