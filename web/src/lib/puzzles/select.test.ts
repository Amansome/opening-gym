import { describe, expect, it } from "vitest";
import { countByCourse, countSet, filterPuzzles, pickNext, priority } from "./select";
import { blackPuzzle, longPuzzle, matePuzzle } from "./fixtures";
import type { PuzzleRecord } from "./types";

const all = [longPuzzle, matePuzzle, blackPuzzle];
const rec = (over: Partial<PuzzleRecord>): PuzzleRecord => ({ solved: 0, failed: 0, streak: 0, bestStreak: 0, last: "solved", at: 1, ...over });

describe("set filtering", () => {
  it("returns everything with no filter", () => {
    expect(filterPuzzles(all, {})).toHaveLength(3);
  });
  it("filters by course ids (any source matches)", () => {
    expect(filterPuzzles(all, { courseIds: ["petrov-defence"] }).map((p) => p.id)).toEqual(["p-black"]);
    expect(filterPuzzles(all, { courseIds: ["italian-game", "petrov-defence"] })).toHaveLength(3);
    expect(filterPuzzles(all, { courseIds: [] })).toHaveLength(0); // "my openings" with none started
    expect(filterPuzzles(all, { courseIds: null })).toHaveLength(3);
  });
  it("filters by side to move", () => {
    expect(filterPuzzles(all, { side: "black" }).map((p) => p.id)).toEqual(["p-black"]);
    expect(filterPuzzles(all, { side: "white" })).toHaveLength(2);
  });
  it("filters by difficulty and combines filters", () => {
    expect(filterPuzzles(all, { level: 3 }).map((p) => p.id)).toEqual(["p-black"]);
    expect(filterPuzzles(all, { level: 1, side: "white" })).toHaveLength(2);
    expect(filterPuzzles(all, { level: 2 })).toHaveLength(0);
    expect(filterPuzzles(all, { level: "all", side: "all" })).toHaveLength(3);
  });
  it("counts per course", () => {
    expect(countByCourse(all)).toEqual({ "italian-game": 2, "petrov-defence": 1 });
  });
});

describe("picking the next puzzle", () => {
  it("prefers failed over unseen over solved", () => {
    expect(priority(rec({ last: "failed" }))).toBeLessThan(priority(undefined));
    expect(priority(undefined)).toBeLessThan(priority(rec({ solved: 1 })));
    expect(priority(rec({ solved: 1 }))).toBeLessThan(priority(rec({ solved: 4 })));
  });
  it("picks a previously failed puzzle first", () => {
    const records = { "p-long": rec({ solved: 2 }), "p-mate": rec({ last: "failed", failed: 1 }), "p-black": rec({ solved: 1 }) };
    for (const r of [0, 0.5, 0.99]) expect(pickNext(all, records, null, () => r)?.id).toBe("p-mate");
  });
  it("prefers unsolved over solved when nothing failed", () => {
    const records = { "p-long": rec({ solved: 2 }), "p-mate": rec({ solved: 1 }) };
    expect(pickNext(all, records, null, () => 0)?.id).toBe("p-black");
  });
  it("does not repeat the puzzle just played, unless it is the only one", () => {
    expect(pickNext(all, {}, "p-long", () => 0)?.id).not.toBe("p-long");
    expect(pickNext([longPuzzle], {}, "p-long")?.id).toBe("p-long");
  });
  it("returns null for an empty set", () => {
    expect(pickNext([], {}, null)).toBeNull();
  });
  it("counts a set", () => {
    const records = { "p-long": rec({}), "p-mate": rec({ last: "failed" }) };
    expect(countSet(all, records)).toEqual({ total: 3, solved: 1, failed: 1, fresh: 1 });
  });
});
