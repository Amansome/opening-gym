// FSRS wrapper: one card per trained move node. Everything here is pure given (card, grade, now).
import { createEmptyCard, fsrs, generatorParameters, Rating, State, type Card, type Grade as FsrsGrade } from "ts-fsrs";
import type { Grade } from "../types";
import type { StoredCard } from "./model";

const RATING: Record<Grade, FsrsGrade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

export function toRating(grade: Grade): FsrsGrade {
  return RATING[grade];
}

function toCard(s: StoredCard): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state as State,
    last_review: s.last_review === undefined ? undefined : new Date(s.last_review),
  };
}

function fromCard(c: Card): StoredCard {
  const out: StoredCard = {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
  };
  if (c.last_review) out.last_review = c.last_review.getTime();
  return out;
}

export interface Scheduler {
  /** Apply one graded review. `card` undefined = a brand-new card. */
  review(card: StoredCard | undefined, grade: Grade, now: number): StoredCard;
  /** Probability (0..1) of recalling the move right now; 0 for a card never reviewed. */
  retrievability(card: StoredCard, now: number): number;
}

export interface SchedulerOptions {
  /** Randomise intervals slightly so cards learned together do not all fall due together. Default true. */
  fuzz?: boolean;
  /** Target recall probability at the due date. Default 0.9. */
  retention?: number;
}

export function createScheduler(opts: SchedulerOptions = {}): Scheduler {
  // enable_short_term=false: skip minute-level learning steps. An opening trainer repeats a move inside the
  // session anyway, and a "due in 10 minutes" line right after Learn would be noise on the home page.
  const f = fsrs(
    generatorParameters({
      enable_fuzz: opts.fuzz ?? true,
      enable_short_term: false,
      request_retention: opts.retention ?? 0.9,
    }),
  );
  return {
    review(stored, grade, now) {
      const card = stored ? toCard(stored) : createEmptyCard(new Date(now));
      // Guard against a clock that moved backwards: never review "before" the previous review.
      const at = card.last_review ? Math.max(now, card.last_review.getTime()) : now;
      return fromCard(f.next(card, new Date(at), toRating(grade)).card);
    },
    retrievability(stored, now) {
      if (stored.state === State.New || stored.last_review === undefined) return 0;
      const r = f.get_retrievability(toCard(stored), new Date(Math.max(now, stored.last_review)), false);
      return Number.isFinite(r) ? Math.min(1, Math.max(0, r)) : 0;
    },
  };
}
