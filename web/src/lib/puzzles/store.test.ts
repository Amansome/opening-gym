import { describe, expect, it } from "vitest";
import { createPuzzleStore, memoryKv } from "./store";
import type { PuzzleKv } from "./store";

describe("puzzle store", () => {
  it("round-trips solved and failed results through the backend", async () => {
    const kv = memoryKv();
    const a = createPuzzleStore(kv, () => 1000);
    await a.recordFailed("p1");
    await a.recordSolved("p1", false);
    await a.recordSolved("p2", true);
    await a.recordSolved("p3", true);

    const b = createPuzzleStore(kv); // a fresh instance reads what was written
    const p = await b.load();
    expect(p.records.p1).toMatchObject({ solved: 1, failed: 1, streak: 0, last: "solved", at: 1000 });
    expect(p.records.p2).toMatchObject({ solved: 1, failed: 0, streak: 1, bestStreak: 1 });
    expect(p.meta).toEqual({ streak: 2, bestStreak: 2 });
  });

  it("a failure or a helped solve ends the streak but keeps the best", async () => {
    const s = createPuzzleStore(memoryKv());
    await s.recordSolved("a", true);
    await s.recordSolved("b", true);
    await s.recordSolved("c", true);
    expect((await s.load()).meta).toEqual({ streak: 3, bestStreak: 3 });
    await s.recordFailed("d");
    expect((await s.load()).meta).toEqual({ streak: 0, bestStreak: 3 });
    await s.recordSolved("e", true);
    await s.recordSolved("f", false);
    expect((await s.load()).meta).toEqual({ streak: 0, bestStreak: 3 });
  });

  it("tracks a per-puzzle streak of clean solves", async () => {
    const s = createPuzzleStore(memoryKv());
    await s.recordSolved("a", true);
    await s.recordSolved("a", true);
    expect((await s.load()).records.a).toMatchObject({ streak: 2, bestStreak: 2, solved: 2 });
    await s.recordFailed("a");
    expect((await s.load()).records.a).toMatchObject({ streak: 0, bestStreak: 2, failed: 1, last: "failed" });
  });

  it("serialises quick consecutive writes", async () => {
    const s = createPuzzleStore(memoryKv());
    await Promise.all([s.recordSolved("a", true), s.recordSolved("b", true), s.recordSolved("c", true)]);
    expect((await s.load()).meta.streak).toBe(3);
  });

  it("starts empty and survives corrupt stored data", async () => {
    const kv = memoryKv();
    expect(await createPuzzleStore(kv).load()).toEqual({ records: {}, meta: { streak: 0, bestStreak: 0 } });
    await kv.set("progress", { records: { x: "nonsense", y: { solved: "2" } }, meta: null });
    const p = await createPuzzleStore(kv).load();
    expect(p.records.x).toBeUndefined();
    expect(p.records.y.solved).toBe(2);
    expect(p.meta.streak).toBe(0);
  });

  it("keeps working in memory when the backend throws", async () => {
    const broken: PuzzleKv = { get: async () => { throw new Error("no idb"); }, set: async () => { throw new Error("no idb"); } };
    const s = createPuzzleStore(broken);
    const p = await s.recordSolved("a", true);
    expect(p.meta.streak).toBe(1);
    expect((await s.load()).records.a.solved).toBe(1);
  });

  it("reset clears everything", async () => {
    const s = createPuzzleStore(memoryKv());
    await s.recordSolved("a", true);
    expect(await s.reset()).toEqual({ records: {}, meta: { streak: 0, bestStreak: 0 } });
  });
});
