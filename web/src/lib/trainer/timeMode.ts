// Time mode rules: a 60 s clock; each completed line adds time, but the bonus shrinks so the clock "speeds up".

export const TIME_START_SECONDS = 60;
export const TIME_BASE_BONUS = 5;
export const TIME_MIN_BONUS = 1;
export const TIME_BONUS_STEP = 0.5;
/** The clock never holds more than this, so the bar stays meaningful. */
export const TIME_MAX_SECONDS = 90;

/** Seconds added after finishing a line, given how many lines were already completed before it. */
export function timeBonusSeconds(completedBefore: number): number {
  return Math.max(TIME_MIN_BONUS, TIME_BASE_BONUS - TIME_BONUS_STEP * Math.max(0, completedBefore));
}

/** New remaining seconds after completing a line. */
export function addTimeBonus(remainingSeconds: number, completedBefore: number): number {
  return Math.min(TIME_MAX_SECONDS, remainingSeconds + timeBonusSeconds(completedBefore));
}
