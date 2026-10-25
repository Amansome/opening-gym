import { describe, expect, it } from "vitest";
import { addTimeBonus, timeBonusSeconds, TIME_MAX_SECONDS } from "./timeMode";
import { interleave, pickRandom } from "./selection";

describe("time bonus", () => {
  it("starts at +5 s and shrinks to a floor of 1 s", () => {
    expect(timeBonusSeconds(0)).toBe(5);
    expect(timeBonusSeconds(1)).toBe(4.5);
    expect(timeBonusSeconds(4)).toBe(3);
    expect(timeBonusSeconds(8)).toBe(1);
    expect(timeBonusSeconds(50)).toBe(1);
  });
  it("is strictly non-increasing", () => {
    let prev = Infinity;
    for (let i = 0; i < 30; i++) {
      const b = timeBonusSeconds(i);
      expect(b).toBeLessThanOrEqual(prev);
      prev = b;
    }
  });
  it("caps the clock", () => {
    expect(addTimeBonus(88, 0)).toBe(TIME_MAX_SECONDS);
    expect(addTimeBonus(10, 0)).toBe(15);
  });
});

describe("selection helpers", () => {
  it("pickRandom avoids the previous item when there is a choice", () => {
    for (let i = 0; i < 20; i++) expect(pickRandom([1, 2], (x) => x === 1)).toBe(2);
    expect(pickRandom([1], (x) => x === 1)).toBe(1);
    expect(pickRandom([])).toBeUndefined();
    expect(pickRandom([1, 2, 3], undefined, () => 0.999)).toBe(3);
  });
  it("interleave round-robins", () => {
    expect(interleave([["a1", "a2"], ["b1"], ["c1", "c2", "c3"]])).toEqual(["a1", "b1", "c1", "a2", "c2", "c3"]);
    expect(interleave([])).toEqual([]);
  });
});
