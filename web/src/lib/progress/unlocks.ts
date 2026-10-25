// Mode unlock rules.
import type { Mode } from "../types";

export interface UnlockResult {
  unlocked: Record<Mode, boolean>;
  hint?: string;
}

/** Lines to learn before Drill and Time open: 3, or every line when the course is smaller. */
export function drillThreshold(totalLines: number): number {
  return Math.max(1, Math.min(3, totalLines));
}

/**
 * @param learned       trainable lines learned in this course
 * @param totalLines    trainable lines in this course
 * @param learnedAnywhere trainable lines learned in any course (for Dojo)
 */
export function computeUnlocks(learned: number, totalLines: number, learnedAnywhere: number): UnlockResult {
  const need = drillThreshold(totalLines);
  const unlocked: Record<Mode, boolean> = {
    learn: true,
    practice: learned >= 1,
    drill: learned >= need,
    time: learned >= need,
    dojo: Math.max(learned, learnedAnywhere) >= 1,
  };
  const lines = (n: number) => `${n} more ${n === 1 ? "line" : "lines"}`;
  let hint: string | undefined;
  if (!unlocked.practice) hint = `Learn ${lines(1)} to unlock Practice`;
  else if (!unlocked.drill) hint = `Learn ${lines(need - learned)} to unlock Drill and Time`;
  return { unlocked, hint };
}
