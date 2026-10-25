import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FakeIndexedDB } from "./fake-idb";
import { createProgress } from "./service";
import { idbBackend, memoryBackend } from "./storage";
import { SCHEMA_VERSION } from "./model";
import { migrate, ProgressDataError, snapshotFromRecords, validateSnapshot } from "./snapshot";
import { course, learnLines, resultFor, setup } from "./test-utils";

const italian = course("italian-game");
const london = course("london-system");

describe("memory backend", () => {
  it("clones values so callers cannot mutate stored state", async () => {
    const b = memoryBackend();
    const v = { a: [1] };
    await b.set("k", v);
    v.a.push(2);
    expect(await b.loadAll()).toEqual({ k: { a: [1] } });
    await b.del("k");
    expect(await b.loadAll()).toEqual({});
  });

  it("persists across instances sharing a backend (the write-through layout)", async () => {
    const s = setup();
    await learnLines(s.p, italian, 2);
    await s.p.recordScore({ mode: "drill", courseId: london.id, value: 4 });
    expect([...s.backend.data.keys()].sort()).toEqual(["course:italian-game", "course:london-system", "meta"]);
    expect((s.backend.data.get("meta") as { schemaVersion: number }).schemaVersion).toBe(SCHEMA_VERSION);
  });
});

describe("IndexedDB adapter (via a fake IDBFactory and the real idb-keyval)", () => {
  let fake: FakeIndexedDB;
  beforeEach(() => {
    fake = new FakeIndexedDB();
    vi.stubGlobal("indexedDB", fake);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("round-trips progress across a simulated page reload", async () => {
    const first = setup({ backend: idbBackend() });
    await learnLines(first.p, italian, 3);
    await first.p.recordLine(italian, resultFor(italian, italian.lines[0].id, "practice", (i) => (i === 1 ? "again" : "good")));
    await first.p.recordScore({ mode: "time", courseId: italian.id, value: 12 });
    const before = await first.p.getCourseProgress(italian);

    // what is physically stored
    const stored = fake.dump();
    expect(Object.keys(stored).sort()).toEqual(["course:italian-game", "meta"]);

    // "reload": new backend + new service over the same IndexedDB
    const second = createProgress({ backend: idbBackend(), now: first.clock.now, fuzz: false });
    expect(await second.getCourseProgress(italian)).toEqual(before);
    expect(await second.getStreak()).toEqual(await first.p.getStreak());
    expect(await second.topScores("time", italian.id)).toEqual(await first.p.topScores("time", italian.id));
    expect(await second.nextLearnLine(italian)).toBe(italian.lines[3].id);
    expect(await second.startedCourses()).toEqual([italian.id]);
  });

  it("uses the dedicated 'opening-gym' database and 'kv' store", async () => {
    const { p } = setup({ backend: idbBackend() });
    await learnLines(p, italian, 1);
    expect(Object.keys(fake.dump("opening-gym"))).toContain("meta");
    expect(Object.keys(fake.dump("keyval-store"))).toEqual([]);
  });

  it("reset and import delete the stale records from IndexedDB", async () => {
    const { p, clock } = setup({ backend: idbBackend() });
    await learnLines(p, italian, 1);
    await learnLines(p, london, 1);
    expect(Object.keys(fake.dump()).sort()).toEqual(["course:italian-game", "course:london-system", "meta"]);
    await p.resetCourse(london.id);
    expect(Object.keys(fake.dump()).sort()).toEqual(["course:italian-game", "meta"]);
    const json = await p.exportAll();
    await p.resetCourse(italian.id);
    expect(Object.keys(fake.dump())).toEqual(["meta"]);
    await p.importAll(json);
    expect(Object.keys(fake.dump()).sort()).toEqual(["course:italian-game", "meta"]);
    clock.advance(0);
  });

  it("degrades to memory-only when IndexedDB cannot be opened", async () => {
    fake.failOpen = true;
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const backend = idbBackend();
    const { p } = setup({ backend });
    await learnLines(p, italian, 2);
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(2);
    expect(backend.degraded).toBe(true);
    expect(fake.dump()).toEqual({});
  });

  it("degrades when a write fails midway, keeping everything in memory", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const backend = idbBackend();
    const { p } = setup({ backend });
    await learnLines(p, italian, 1);
    expect(backend.degraded).toBe(false);
    fake.failWrites = true;
    await learnLines(p, italian, 1);
    expect(backend.degraded).toBe(true);
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(2);
    expect((fake.dump()["course:italian-game"] as { learned: object }).learned).toBeTypeOf("object"); // earlier data still on disk
  });

  it("gives up on a hanging IndexedDB after the timeout", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    (fake as unknown as { open: () => unknown }).open = () => ({}); // request that never fires
    const backend = idbBackend({ timeoutMs: 20 });
    expect(await backend.loadAll()).toEqual({});
    expect(backend.degraded).toBe(true);
  });
});

describe("no IndexedDB at all (jsdom / private mode)", () => {
  it("falls back to memory silently enough and keeps working", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(typeof indexedDB).toBe("undefined");
    const backend = idbBackend();
    const { p } = setup({ backend });
    await learnLines(p, italian, 1);
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(1);
    expect(backend.degraded).toBe(true);
    vi.restoreAllMocks();
  });
});

describe("schema versioning and migration", () => {
  const rec = (extra: Record<string, unknown> = {}) => ({
    schemaVersion: 2,
    activity: {},
    streak: { current: 2, best: 4, lastDay: "2025-06-10" },
    scores: { global: { drill: [], time: [] }, byCourse: {} },
    ...extra,
  });

  it("stamps the current schemaVersion on stored meta and on exports", async () => {
    const { p, backend } = setup();
    await learnLines(p, italian, 1);
    expect((backend.data.get("meta") as { schemaVersion: number }).schemaVersion).toBe(SCHEMA_VERSION);
    expect(JSON.parse(await p.exportAll()).schemaVersion).toBe(SCHEMA_VERSION);
  });

  it("migrate() applies stepwise migrations in order", () => {
    const steps: string[] = [];
    const out = migrate(
      { schemaVersion: 1, a: 1 },
      {
        1: (d) => (steps.push("1->2"), { ...d, b: 2 }),
        2: (d) => (steps.push("2->3"), { ...d, c: 3 }),
      },
      3,
    );
    expect(steps).toEqual(["1->2", "2->3"]);
    expect(out).toMatchObject({ schemaVersion: 3, a: 1, b: 2, c: 3 });
  });

  it("migrate() rejects missing steps, bad versions and newer data", () => {
    expect(() => migrate({ schemaVersion: 1 }, {}, 2)).toThrow(/No migration/);
    expect(() => migrate({}, {}, 1)).toThrow(ProgressDataError);
    expect(() => migrate({ schemaVersion: 0 }, {}, 1)).toThrow(ProgressDataError);
    expect(() => migrate({ schemaVersion: 2 }, {}, 1)).toThrow(/newer version/);
  });

  it("loads well-formed records", () => {
    const { snapshot, dirty } = snapshotFromRecords({
      meta: rec(),
      "course:italian-game": { courseId: "italian-game", learned: { x: 5 }, cards: {}, lapses: {}, lastPracticed: 7, bestDrillStreak: 1, bestTime: 2 },
    });
    expect(dirty).toBe(false);
    expect(snapshot.streak).toEqual({ current: 2, best: 4, lastDay: "2025-06-10" });
    expect(snapshot.courses["italian-game"].learned).toEqual({ x: 5 });
  });

  it("drops corrupt course records but keeps the rest, and flags a rewrite", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { snapshot, dirty } = snapshotFromRecords({
      meta: rec(),
      "course:good": { courseId: "good", learned: {}, cards: {}, lapses: {} },
      "course:bad": { courseId: "bad", learned: "nope" },
    });
    expect(Object.keys(snapshot.courses)).toEqual(["good"]);
    expect(dirty).toBe(true);
    vi.restoreAllMocks();
  });

  it("recovers from an unreadable meta record by starting fresh", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { snapshot, dirty } = snapshotFromRecords({ meta: "garbage" });
    expect(snapshot.streak.current).toBe(0);
    expect(dirty).toBe(true);
    vi.restoreAllMocks();
  });

  it("keeps course records when the meta record is missing", () => {
    const { snapshot } = snapshotFromRecords({ "course:a": { courseId: "a", learned: { l: 1 }, cards: {}, lapses: {} } });
    expect(Object.keys(snapshot.courses)).toEqual(["a"]);
  });

  it("data from a NEWER app version is never overwritten: runs in memory, storage untouched", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const future = { meta: { schemaVersion: 99, whatever: true }, "course:italian-game": { weird: "future shape" } };
    const backend = memoryBackend(future);
    const p = createProgress({ backend, fuzz: false });
    await learnLines(p, italian, 1); // works for this session
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(1);
    expect(await backend.loadAll()).toEqual(future);
    vi.restoreAllMocks();
  });

  it("an explicit successful import after that restores persistence", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const backend = memoryBackend({ meta: { schemaVersion: 99 } });
    const p = createProgress({ backend, fuzz: false });
    const donor = setup();
    await learnLines(donor.p, italian, 1);
    await p.importAll(await donor.p.exportAll());
    expect((backend.data.get("meta") as { schemaVersion: number }).schemaVersion).toBe(SCHEMA_VERSION);
    vi.restoreAllMocks();
  });

  it("validateSnapshot strips unknown fields and clamps best >= current", () => {
    const out = validateSnapshot({ ...rec({ streak: { current: 5, best: 1, lastDay: "" }, courses: {}, junk: 1 }) });
    expect(out.streak.best).toBe(5);
    expect(out).not.toHaveProperty("junk");
  });
});
