import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { dayIndex, localDayKey } from "./dates";
import { bumpStreak, streakInfo } from "./streak";
import { course, resultFor, setup } from "./test-utils";

const italian = course("italian-game");
const at = (y: number, mo: number, d: number, h = 12, mi = 0) => new Date(y, mo - 1, d, h, mi, 0).getTime();

async function finishLine(p: ReturnType<typeof setup>["p"], n = 0) {
  await p.recordLine(italian, resultFor(italian, italian.lines[n % italian.lines.length].id, "learn"));
}

describe("streak (service, default zone)", () => {
  it("counts consecutive days", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10) });
    await finishLine(p);
    expect(await p.getStreak()).toEqual({ current: 1, best: 1, todayDone: true });
    clock.set(at(2025, 6, 11));
    expect(await p.getStreak()).toEqual({ current: 1, best: 1, todayDone: false }); // still alive, not yet done today
    await finishLine(p, 1);
    expect(await p.getStreak()).toEqual({ current: 2, best: 2, todayDone: true });
    clock.set(at(2025, 6, 12));
    await finishLine(p, 2);
    expect(await p.getStreak()).toEqual({ current: 3, best: 3, todayDone: true });
  });

  it("completing twice on the same day counts once", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10, 8) });
    await finishLine(p);
    clock.set(at(2025, 6, 10, 23, 59));
    await finishLine(p, 1);
    expect(await p.getStreak()).toEqual({ current: 1, best: 1, todayDone: true });
  });

  it("a missed day resets current but keeps best", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10) });
    await finishLine(p);
    clock.set(at(2025, 6, 11));
    await finishLine(p, 1);
    clock.set(at(2025, 6, 12));
    await finishLine(p, 2);
    clock.set(at(2025, 6, 14)); // skipped the 13th
    expect(await p.getStreak()).toEqual({ current: 0, best: 3, todayDone: false });
    await finishLine(p, 3);
    expect(await p.getStreak()).toEqual({ current: 1, best: 3, todayDone: true });
    clock.set(at(2025, 6, 15));
    await finishLine(p, 4);
    expect(await p.getStreak()).toEqual({ current: 2, best: 3, todayDone: true });
  });

  it("a streak runs across a month boundary", async () => {
    const { p, clock } = setup({ start: at(2025, 1, 30) });
    for (const [mo, d] of [[1, 30], [1, 31], [2, 1], [2, 2], [2, 3]] as const) {
      clock.set(at(2025, mo, d));
      await finishLine(p, d);
    }
    expect(await p.getStreak()).toEqual({ current: 5, best: 5, todayDone: true });
  });

  it("only completed lines count: an abandoned Drill run does not start a streak", async () => {
    const { p } = setup({ start: at(2025, 6, 10) });
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id, "drill", "again", false));
    expect(await p.getStreak()).toEqual({ current: 0, best: 0, todayDone: false });
  });

  it("any mode counts", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10) });
    await finishLine(p);
    clock.set(at(2025, 6, 11));
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id, "practice"));
    expect((await p.getStreak()).current).toBe(2);
  });

  it("survives a clock that moves backwards", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10) });
    await finishLine(p);
    clock.set(at(2025, 6, 11));
    await finishLine(p, 1);
    clock.set(at(2025, 6, 9));
    await finishLine(p, 2);
    expect((await p.getStreak()).current).toBe(2);
  });

  it("is persisted: a new instance on the same backend sees the streak", async () => {
    const s = setup({ start: at(2025, 6, 10) });
    await finishLine(s.p);
    const { createProgress } = await import("./service");
    const again = createProgress({ backend: s.backend, now: s.clock.now });
    expect(await again.getStreak()).toEqual({ current: 1, best: 1, todayDone: true });
  });
});

describe("streak math (pure)", () => {
  it("localDayKey / dayIndex", () => {
    expect(localDayKey(at(2025, 3, 9, 0, 0))).toBe("2025-03-09");
    expect(localDayKey(at(2025, 3, 9, 23, 59))).toBe("2025-03-09");
    expect(dayIndex("2025-03-10") - dayIndex("2025-03-09")).toBe(1);
    expect(dayIndex("2025-03-01") - dayIndex("2025-02-28")).toBe(1);
    expect(dayIndex("2024-03-01") - dayIndex("2024-02-28")).toBe(2); // leap year
    expect(dayIndex("2026-01-01") - dayIndex("2025-12-31")).toBe(1);
  });

  it("bump/info edge cases", () => {
    const s0 = { current: 0, best: 0, lastDay: "" };
    const s1 = bumpStreak(s0, at(2025, 6, 10));
    expect(s1).toEqual({ current: 1, best: 1, lastDay: "2025-06-10" });
    expect(bumpStreak(s1, at(2025, 6, 10, 22))).toBe(s1);
    expect(bumpStreak(s1, at(2025, 6, 11))).toEqual({ current: 2, best: 2, lastDay: "2025-06-11" });
    expect(bumpStreak(s1, at(2025, 6, 13))).toEqual({ current: 1, best: 1, lastDay: "2025-06-13" });
    expect(streakInfo(s1, at(2025, 6, 12))).toEqual({ current: 0, best: 1, todayDone: false });
    expect(streakInfo(s1, at(2025, 6, 11, 23, 59))).toEqual({ current: 1, best: 1, todayDone: false });
  });
});

// The user's LOCAL date is what counts. Run the tricky cases in fixed zones.
const env = (globalThis as unknown as { process: { env: Record<string, string | undefined> } }).process.env;
function withZone(tz: string, body: () => void) {
  describe(`streak in ${tz}`, () => {
    const old = env.TZ;
    beforeAll(() => {
      env.TZ = tz;
    });
    afterAll(() => {
      if (old === undefined) delete env.TZ;
      else env.TZ = old;
    });
    body();
  });
}

withZone("America/New_York", () => {
  it("the zone switch took effect (sanity)", () => {
    expect(new Date(2025, 0, 15, 12).getTimezoneOffset()).toBe(300);
    expect(new Date(2025, 6, 15, 12).getTimezoneOffset()).toBe(240);
  });

  it("local midnight, not UTC midnight, ends the day", async () => {
    // 21:00 New York in June is 01:00 UTC the NEXT day. It must still count as the same local day.
    const { p, clock } = setup({ start: at(2025, 6, 10, 21, 0) });
    expect(new Date(clock.now()).getUTCDate()).toBe(11);
    await finishLine(p);
    clock.set(at(2025, 6, 10, 23, 30)); // 03:30 UTC on the 11th: same local day
    await finishLine(p, 1);
    expect(await p.getStreak()).toEqual({ current: 1, best: 1, todayDone: true });
    clock.set(at(2025, 6, 11, 0, 5)); // 5 minutes after local midnight
    expect(await p.getStreak()).toEqual({ current: 1, best: 1, todayDone: false });
    await finishLine(p, 2);
    expect(await p.getStreak()).toEqual({ current: 2, best: 2, todayDone: true });
  });

  it("one minute either side of local midnight", async () => {
    const { p, clock } = setup({ start: at(2025, 6, 10, 23, 59) });
    await finishLine(p);
    clock.set(at(2025, 6, 11, 0, 0));
    expect((await p.getStreak()).todayDone).toBe(false);
    clock.set(at(2025, 6, 11, 0, 1));
    await finishLine(p, 1);
    expect(await p.getStreak()).toMatchObject({ current: 2, todayDone: true });
    clock.set(at(2025, 6, 12, 23, 59)); // missed nothing yet? 12th not played -> alive until midnight
    expect(await p.getStreak()).toMatchObject({ current: 2, todayDone: false });
    clock.set(at(2025, 6, 13, 0, 1)); // the 12th was skipped
    expect(await p.getStreak()).toMatchObject({ current: 0, best: 2 });
  });

  it("spring-forward day (23 hours) does not break or double count the streak", async () => {
    // 2025-03-09: clocks jump 02:00 -> 03:00
    const { p, clock } = setup({ start: at(2025, 3, 8, 23, 50) });
    await finishLine(p);
    clock.set(at(2025, 3, 9, 0, 10));
    await finishLine(p, 1);
    expect((await p.getStreak()).current).toBe(2);
    clock.set(at(2025, 3, 9, 23, 55)); // still the 9th, only 23 h after midnight
    await finishLine(p, 2);
    expect(await p.getStreak()).toEqual({ current: 2, best: 2, todayDone: true });
    clock.set(at(2025, 3, 10, 0, 5));
    await finishLine(p, 3);
    expect(await p.getStreak()).toEqual({ current: 3, best: 3, todayDone: true });
  });

  it("fall-back day (25 hours) does not break or double count the streak", async () => {
    // 2025-11-02: clocks go 02:00 -> 01:00
    const { p, clock } = setup({ start: at(2025, 11, 1, 23, 50) });
    await finishLine(p);
    clock.set(at(2025, 11, 2, 0, 10));
    await finishLine(p, 1);
    clock.set(at(2025, 11, 2, 23, 55));
    await finishLine(p, 2);
    expect(await p.getStreak()).toEqual({ current: 2, best: 2, todayDone: true });
    // 24 real hours after the first completion of the 2nd, we are still on the 2nd's night / 3rd morning:
    clock.set(at(2025, 11, 3, 0, 5));
    expect(await p.getStreak()).toEqual({ current: 2, best: 2, todayDone: false });
    await finishLine(p, 3);
    expect(await p.getStreak()).toEqual({ current: 3, best: 3, todayDone: true });
  });

  it("a full 25h fall-back day: 23:30 on day N to 00:30 on day N+2 is a miss", async () => {
    const { p, clock } = setup({ start: at(2025, 11, 1, 23, 30) });
    await finishLine(p);
    clock.set(at(2025, 11, 3, 0, 30));
    expect(await p.getStreak()).toMatchObject({ current: 0, best: 1 });
  });
});

withZone("Pacific/Auckland", () => {
  it("works east of UTC (local day is ahead of UTC) incl. NZ DST", async () => {
    // NZ DST starts 2025-09-28 (clocks +1h at 02:00)
    const { p, clock } = setup({ start: at(2025, 9, 27, 0, 30) }); // 12:30 UTC on the 26th
    await finishLine(p);
    clock.set(at(2025, 9, 28, 0, 30));
    await finishLine(p, 1);
    clock.set(at(2025, 9, 29, 0, 30));
    await finishLine(p, 2);
    expect(await p.getStreak()).toEqual({ current: 3, best: 3, todayDone: true });
  });
});
