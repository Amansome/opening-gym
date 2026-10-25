import { describe, expect, it } from "vitest";
import { bumpActivity, ACTIVITY_KEEP_DAYS } from "./activity";
import { localDayKey } from "./dates";
import { memoryBackend } from "./storage";
import { migrate, snapshotFromRecords, validateSnapshot } from "./snapshot";
import { course, DAY, learnLines, noon, resultFor, setup } from "./test-utils";

const italian = course("italian-game");

describe("activity history", () => {
  it("starts empty", async () => {
    const { p } = setup();
    expect(await p.getActivity()).toEqual({});
  });

  it("counts completed lines per local day", async () => {
    const { p, clock } = setup({ start: noon(2025, 6, 10) });
    await learnLines(p, italian, 2);
    clock.advance(DAY);
    await learnLines(p, italian, 1);
    expect(await p.getActivity()).toEqual({ "2025-06-10": 2, "2025-06-11": 1 });
  });

  it("ignores abandoned runs", async () => {
    const { p } = setup();
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id, "learn", "good", false));
    expect(await p.getActivity()).toEqual({});
  });

  it("returns a copy that callers cannot use to mutate state", async () => {
    const { p } = setup();
    await learnLines(p, italian, 1);
    const a = await p.getActivity();
    a["1999-01-01"] = 9;
    expect(await p.getActivity()).not.toHaveProperty("1999-01-01");
  });

  it("persists in the meta record and survives a reload", async () => {
    const backend = memoryBackend();
    const first = setup({ backend });
    await learnLines(first.p, italian, 1);
    const second = setup({ backend });
    expect(await second.p.getActivity()).toEqual(await first.p.getActivity());
  });

  it("round-trips through export and import", async () => {
    const a = setup();
    await learnLines(a.p, italian, 2);
    const json = await a.p.exportAll();
    expect(JSON.parse(json).activity).toEqual(await a.p.getActivity());
    const b = setup();
    await b.p.importAll(json);
    expect(await b.p.getActivity()).toEqual(await a.p.getActivity());
  });

  it("migrates schema 1 data (and backups) with an empty history", async () => {
    const v1 = { schemaVersion: 1, streak: { current: 1, best: 1, lastDay: "2025-06-10" }, scores: { global: { drill: [], time: [] }, byCourse: {} } };
    expect(migrate(v1)).toMatchObject({ schemaVersion: 2, activity: {} });
    const { snapshot, dirty } = snapshotFromRecords({ meta: v1 });
    expect(dirty).toBe(true);
    expect(snapshot.activity).toEqual({});
    expect(validateSnapshot({ ...v1, courses: {} }).activity).toEqual({});
    // and a v1 store keeps working after the upgrade
    const backend = memoryBackend({ meta: v1 });
    const { p } = setup({ backend });
    await learnLines(p, italian, 1);
    expect(Object.values(await p.getActivity())).toEqual([1]);
  });

  it("rejects malformed activity in a backup", () => {
    const base = { schemaVersion: 2, streak: { current: 0, best: 0, lastDay: "" }, scores: { global: { drill: [], time: [] }, byCourse: {} }, courses: {} };
    expect(() => validateSnapshot({ ...base, activity: { nope: 1 } })).toThrow();
    expect(() => validateSnapshot({ ...base, activity: { "2025-06-10": -1 } })).toThrow();
    expect(validateSnapshot({ ...base, activity: { "2025-06-10": 3, "2025-06-11": 0 } }).activity).toEqual({ "2025-06-10": 3 });
  });

  it("bumpActivity drops days older than the keep window", () => {
    const now = noon(2025, 6, 10);
    const old = localDayKey(now - (ACTIVITY_KEEP_DAYS + 5) * DAY);
    const recent = localDayKey(now - 10 * DAY);
    const out = bumpActivity({ [old]: 4, [recent]: 2 }, now);
    expect(out).toEqual({ [recent]: 2, "2025-06-10": 1 });
  });
});
