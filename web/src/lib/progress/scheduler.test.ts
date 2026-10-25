import { describe, expect, it } from "vitest";
import { createScheduler } from "./scheduler";
import { DAY } from "./test-utils";

const NOW = Date.UTC(2025, 5, 10, 12);
const s = createScheduler({ fuzz: false });

describe("scheduler (ts-fsrs)", () => {
  it("schedules a failed new card sooner than a good one, and easy latest", () => {
    const again = s.review(undefined, "again", NOW);
    const hard = s.review(undefined, "hard", NOW);
    const good = s.review(undefined, "good", NOW);
    const easy = s.review(undefined, "easy", NOW);
    expect(again.due).toBeGreaterThan(NOW);
    expect(again.due).toBeLessThan(good.due);
    expect(again.due).toBeLessThanOrEqual(hard.due);
    expect(hard.due).toBeLessThan(good.due);
    expect(good.due).toBeLessThan(easy.due);
    expect(again.reps).toBe(1);
  });

  it("schedules a lapse sooner than a success on a mature card, and counts the lapse", () => {
    let card = s.review(undefined, "good", NOW);
    card = s.review(card, "good", card.due);
    const at = card.due;
    const lapsed = s.review(card, "again", at);
    const kept = s.review(card, "good", at);
    expect(lapsed.due).toBeLessThan(kept.due);
    expect(lapsed.lapses).toBe(card.lapses + 1);
    expect(lapsed.stability).toBeLessThan(kept.stability);
  });

  it("round-trips through JSON without losing information", () => {
    const card = s.review(s.review(undefined, "good", NOW), "hard", NOW + 3 * DAY);
    expect(JSON.parse(JSON.stringify(card))).toEqual(card);
    expect(s.review(JSON.parse(JSON.stringify(card)), "good", NOW + 10 * DAY)).toEqual(s.review(card, "good", NOW + 10 * DAY));
  });

  it("retrievability is 1 right after a review, decays with time, and a failed card is weaker", () => {
    const good = s.review(undefined, "good", NOW);
    expect(s.retrievability(good, NOW)).toBeCloseTo(1, 5);
    const later = s.retrievability(good, NOW + 10 * DAY);
    const muchLater = s.retrievability(good, NOW + 60 * DAY);
    expect(later).toBeLessThan(1);
    expect(muchLater).toBeLessThan(later);
    expect(muchLater).toBeGreaterThan(0);
    const again = s.review(undefined, "again", NOW);
    expect(s.retrievability(again, NOW + 3 * DAY)).toBeLessThan(s.retrievability(good, NOW + 3 * DAY));
  });

  it("is about 90% at the due date (default retention)", () => {
    const good = s.review(s.review(undefined, "good", NOW), "good", NOW + 3 * DAY);
    expect(s.retrievability(good, good.due)).toBeGreaterThan(0.85);
    expect(s.retrievability(good, good.due)).toBeLessThan(0.95);
  });

  it("does not blow up when the clock goes backwards", () => {
    const card = s.review(undefined, "good", NOW);
    const back = s.review(card, "good", NOW - DAY);
    expect(Number.isFinite(back.due)).toBe(true);
    expect(back.due).toBeGreaterThanOrEqual(card.due - 1);
    expect(s.retrievability(card, NOW - DAY)).toBeCloseTo(1, 5);
  });

  it("fuzz option still yields a valid schedule", () => {
    const f = createScheduler({ fuzz: true });
    let card = f.review(undefined, "good", NOW);
    for (let i = 0; i < 5; i++) card = f.review(card, "good", card.due);
    expect(card.due).toBeGreaterThan(NOW + 10 * DAY);
  });
});
