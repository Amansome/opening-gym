import { describe, expect, it, vi } from "vitest";
import { lineNodes } from "../courses";
import type { Course } from "../types";
import { createProgress } from "./service";
import { course, DAY, HOUR, learnLines, noon, resultFor, setup, trainable } from "./test-utils";

const italian = course("italian-game");
const ruy = course("ruy-lopez"); // main/alternative lines + a trailing warning line
const qg = course("queens-gambit");
const london = course("london-system");
const traps = course("opening-traps"); // side: "both"
const small: Course = { ...course("italian-two-knights-ng5"), lines: course("italian-two-knights-ng5").lines.slice(0, 2) };

describe("learn flow and grading", () => {
  it("starts empty with only Learn (and nothing else) unlocked", async () => {
    const { p } = setup();
    const cp = await p.getCourseProgress(italian);
    expect(cp.learnedCount).toBe(0);
    expect(cp.totalLines).toBe(trainable(italian).length);
    expect(cp.dueCount).toBe(0);
    expect(cp.unlocked).toEqual({ learn: true, practice: false, drill: false, time: false, dojo: false });
    expect(cp.lines.every((l) => !l.learned && l.due === Infinity && l.strength === 0 && l.lapses === 0)).toBe(true);
    expect(cp.bestDrillStreak).toBe(0);
    expect(await p.getStreak()).toEqual({ current: 0, best: 0, todayDone: false });
    expect(await p.startedCourses()).toEqual([]);
  });

  it("completing a Learn run creates one card per trained move and marks the line learned", async () => {
    const { p, clock } = setup();
    const id = italian.lines[0].id;
    await p.recordLine(italian, resultFor(italian, id));
    const cp = await p.getCourseProgress(italian);
    const line = cp.lines.find((l) => l.lineId === id)!;
    expect(cp.learnedCount).toBe(1);
    expect(line.learned).toBe(true);
    expect(line.strength).toBeCloseTo(1, 3);
    expect(line.due).toBeGreaterThan(clock.now());
    expect(line.lapses).toBe(0);
    expect(cp.dueCount).toBe(0);
    expect(cp.unlocked.practice).toBe(true);
    const exported = JSON.parse(await p.exportAll());
    const trained = lineNodes(italian, italian.lines[0]).filter((n) => n.trained).map((n) => n.id);
    expect(Object.keys(exported.courses[italian.id].cards).sort()).toEqual(trained.slice().sort());
  });

  it("ignores an abandoned Learn run, but not an abandoned Drill run", async () => {
    const { p } = setup();
    const id = italian.lines[0].id;
    await p.recordLine(italian, resultFor(italian, id, "learn", "good", false));
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(0);
    expect(await p.getStreak()).toMatchObject({ current: 0 });

    await learnLines(p, italian, 1);
    const moves = resultFor(italian, id, "drill", "good", false);
    moves.moves[1].grade = "again";
    moves.mistakes = 1;
    await p.recordLine(italian, moves);
    const line = (await p.getCourseProgress(italian)).lines.find((l) => l.lineId === id)!;
    expect(line.lapses).toBe(1);
  });

  it("grading controls scheduling: a failed move comes back before a good one", async () => {
    const { p } = setup();
    const a = italian.lines[0].id;
    const b = london.lines[0].id; // different course: no shared cards
    await p.recordLine(italian, resultFor(italian, a, "learn", "good"));
    await p.recordLine(london, resultFor(london, b, "learn", (i) => (i === 2 ? "again" : "good")));
    const la = (await p.getCourseProgress(italian)).lines.find((l) => l.lineId === a)!;
    const lb = (await p.getCourseProgress(london)).lines.find((l) => l.lineId === b)!;
    expect(lb.due).toBeLessThan(la.due); // line due = earliest card due
    expect(lb.lapses).toBe(1);
    expect(la.lapses).toBe(0);
  });

  it("an easy run pushes a line further out than a hard one", async () => {
    const { p } = setup();
    const a = italian.lines[0].id;
    const b = london.lines[0].id;
    await p.recordLine(italian, resultFor(italian, a, "learn", "easy"));
    await p.recordLine(london, resultFor(london, b, "learn", "hard"));
    const la = (await p.getCourseProgress(italian)).lines.find((l) => l.lineId === a)!;
    const lb = (await p.getCourseProgress(london)).lines.find((l) => l.lineId === b)!;
    expect(la.due).toBeGreaterThan(lb.due);
  });

  it("lines fall due and weaken as time passes; practising resets them", async () => {
    const { p, clock } = setup();
    const id = italian.lines[0].id;
    await p.recordLine(italian, resultFor(italian, id));
    clock.advance(30 * DAY);
    let cp = await p.getCourseProgress(italian);
    expect(cp.dueCount).toBe(1);
    expect(cp.lines[0].strength).toBeLessThan(0.9);
    await p.recordLine(italian, resultFor(italian, id, "practice"));
    cp = await p.getCourseProgress(italian);
    expect(cp.dueCount).toBe(0);
    expect(cp.lines[0].strength).toBeGreaterThan(0.99);
  });

  it("shared trunk moves are one card: learning a second line reuses existing cards", async () => {
    const { p } = setup();
    await learnLines(p, italian, 2);
    const exported = JSON.parse(await p.exportAll());
    const cards = Object.keys(exported.courses[italian.id].cards);
    const total = [0, 1].flatMap((i) => lineNodes(italian, italian.lines[i]).filter((n) => n.trained).map((n) => n.id));
    expect(cards.length).toBe(new Set(total).size);
    expect(cards.length).toBeLessThan(total.length); // 1.e4 e5 2.Nf3 ... is shared
  });

  it("only counts the line's own trained moves and merges duplicates", async () => {
    const { p } = setup();
    const r = resultFor(italian, italian.lines[0].id);
    r.moves.push({ nodeId: "not a node", grade: "good", ms: 1, usedHint: false });
    r.moves.push({ ...r.moves[0], grade: "again" });
    await p.recordLine(italian, r);
    const exported = JSON.parse(await p.exportAll());
    expect(exported.courses[italian.id].cards["not a node"]).toBeUndefined();
    expect(exported.courses[italian.id].cards[r.moves[0].nodeId].reps).toBe(1);
    expect(exported.courses[italian.id].cards[r.moves[0].nodeId].lapses).toBe(0); // new card: a failure is not a lapse yet
  });

  it("ignores unknown lines", async () => {
    const { p } = setup();
    await p.recordLine(italian, { courseId: italian.id, lineId: "nope", mode: "learn", moves: [], completed: true, mistakes: 0 });
    expect(await p.startedCourses()).toEqual([]);
    expect(await p.getStreak()).toMatchObject({ current: 0 });
  });

  it("works for side:both courses", async () => {
    const { p } = setup();
    await learnLines(p, traps, 2);
    expect((await p.getCourseProgress(traps)).learnedCount).toBe(2);
  });
});

describe("nextLearnLine", () => {
  it("walks the trainable lines in course order, then the warning lines, then undefined", async () => {
    const { p } = setup();
    const order = [...trainable(ruy).map((l) => l.id), ...ruy.lines.filter((l) => l.kind === "warning").map((l) => l.id)];
    expect(ruy.lines.at(-1)!.kind).toBe("warning");
    const seen: string[] = [];
    for (;;) {
      const id = await p.nextLearnLine(ruy);
      if (!id) break;
      seen.push(id);
      await p.recordLine(ruy, resultFor(ruy, id));
    }
    expect(seen).toEqual(order);
    expect(await p.nextLearnLine(ruy)).toBeUndefined();
  });

  it("serves a warning line only after every trainable line, even if it comes earlier in the data", async () => {
    const { p } = setup();
    const reordered: Course = { ...qg, lines: [qg.lines.find((l) => l.kind === "warning")!, ...trainable(qg)] };
    expect(await p.nextLearnLine(reordered)).toBe(trainable(qg)[0].id);
    await learnLines(p, reordered, trainable(qg).length);
    expect(await p.nextLearnLine(reordered)).toBe(reordered.lines[0].id);
  });

  it("a warning line counts for the streak and learn state but is never trained or listed", async () => {
    const { p } = setup();
    await learnLines(p, qg, trainable(qg).length);
    const warning = qg.lines.find((l) => l.kind === "warning")!;
    await p.recordLine(qg, resultFor(qg, warning.id));
    const cp = await p.getCourseProgress(qg);
    expect(cp.totalLines).toBe(trainable(qg).length);
    expect(cp.lines.some((l) => l.lineId === warning.id)).toBe(false);
    expect(await p.pickLines(qg, "practice", 99)).not.toContain(warning.id);
    expect(await p.nextLearnLine(qg)).toBeUndefined();
  });

  it("is independent per course", async () => {
    const { p } = setup();
    await learnLines(p, italian, 2);
    expect(await p.nextLearnLine(london)).toBe(london.lines[0].id);
  });
});

describe("unlocks and hints", () => {
  it("opens Practice after 1 line and Drill/Time after 3", async () => {
    const { p } = setup();
    let cp = await p.getCourseProgress(italian);
    expect(cp.nextUnlockHint).toBe("Learn 1 more line to unlock Practice");
    await learnLines(p, italian, 1);
    cp = await p.getCourseProgress(italian);
    expect(cp.unlocked).toMatchObject({ practice: true, drill: false, time: false, dojo: true });
    expect(cp.nextUnlockHint).toBe("Learn 2 more lines to unlock Drill and Time");
    expect(cp.nextUnlockHint).toMatch(/^Learn 2 more lines to unlock Drill/);
    await learnLines(p, italian, 1);
    expect((await p.getCourseProgress(italian)).nextUnlockHint).toBe("Learn 1 more line to unlock Drill and Time");
    await learnLines(p, italian, 1);
    cp = await p.getCourseProgress(italian);
    expect(cp.unlocked).toEqual({ learn: true, practice: true, drill: true, time: true, dojo: true });
    expect(cp.nextUnlockHint).toBeUndefined();
  });

  it("for a course with fewer than 3 lines, Drill/Time need all of them", async () => {
    const { p } = setup();
    expect(small.lines).toHaveLength(2);
    await learnLines(p, small, 1);
    let cp = await p.getCourseProgress(small);
    expect(cp.unlocked.drill).toBe(false);
    expect(cp.nextUnlockHint).toBe("Learn 1 more line to unlock Drill and Time");
    await learnLines(p, small, 1);
    cp = await p.getCourseProgress(small);
    expect(cp.unlocked).toMatchObject({ drill: true, time: true });
  });

  it("Dojo unlocks after one learned line in ANY course", async () => {
    const { p } = setup();
    await learnLines(p, italian, 1);
    const cp = await p.getCourseProgress(london);
    expect(cp.unlocked).toMatchObject({ practice: false, dojo: true });
    expect(cp.nextUnlockHint).toBe("Learn 1 more line to unlock Practice");
  });

  it("warning lines do not count towards unlocks", async () => {
    const { p } = setup();
    const warning = qg.lines.find((l) => l.kind === "warning")!;
    await p.recordLine(qg, resultFor(qg, warning.id));
    expect((await p.getCourseProgress(qg)).unlocked.practice).toBe(false);
  });
});

describe("pickLines", () => {
  it("returns nothing when no line is learned, and only learned trainable lines otherwise", async () => {
    const { p } = setup();
    expect(await p.pickLines(italian, "practice", 5)).toEqual([]);
    const ids = await learnLines(p, italian, 3);
    const picked = await p.pickLines(italian, "practice", 10);
    expect(picked.sort()).toEqual(ids.slice().sort());
    expect(await p.pickLines(italian, "practice", 0)).toEqual([]);
  });

  it("puts overdue lines first, most overdue first", async () => {
    const { p, clock } = setup();
    const [a, b, c] = italian.lines.slice(0, 3).map((l) => l.id);
    await p.recordLine(italian, resultFor(italian, a)); // learned first -> oldest
    clock.advance(DAY);
    await p.recordLine(italian, resultFor(italian, b));
    clock.advance(DAY);
    await p.recordLine(italian, resultFor(italian, c, "learn", "easy")); // far from due
    clock.advance(20 * DAY); // a and b overdue (a more so); c (easy) is probably not
    const cp = await p.getCourseProgress(italian);
    const overdue = cp.lines.filter((l) => l.due <= clock.now()).map((l) => l.lineId);
    expect(overdue).toContain(a);
    expect(overdue).toContain(b);
    const picked = await p.pickLines(italian, "practice", 3);
    expect(picked.slice(0, 2)).toEqual([a, b]);
  });

  it("after the overdue ones: lowest strength first", async () => {
    const { p, clock } = setup();
    const [a, b, c] = italian.lines.slice(0, 3).map((l) => l.id);
    // The easy line has the highest stability, so after a day it is the strongest; good lines still are not due (2-day interval).
    for (const [id, g] of [[a, "easy"], [b, "good"], [c, "good"]] as const) await p.recordLine(italian, resultFor(italian, id, "learn", g));
    clock.advance(DAY); // FSRS counts whole elapsed days, so strengths only separate after a day
    const cp = await p.getCourseProgress(italian);
    expect(cp.dueCount).toBe(0);
    const byStrength = cp.lines.filter((l) => l.learned).sort((x, y) => x.strength - y.strength);
    expect(new Set(byStrength.map((l) => l.strength.toFixed(6))).size).toBeGreaterThan(1);
    expect(await p.pickLines(italian, "practice", 3)).toEqual(byStrength.map((l) => l.lineId));
  });

  it("breaks strength ties by lapse count", async () => {
    const { p } = setup();
    const [a, b] = italian.lines.slice(0, 2).map((l) => l.id);
    await p.recordLine(italian, resultFor(italian, a));
    await p.recordLine(italian, resultFor(italian, b));
    // identical grades -> same strength; b gets an extra recorded mistake via an incomplete drill with a lapse count only
    const r = resultFor(italian, b, "drill", "good", false);
    r.mistakes = 2;
    await p.recordLine(italian, r);
    // re-review a to keep strengths comparable
    const cp = await p.getCourseProgress(italian);
    const [sa, sb] = [a, b].map((id) => cp.lines.find((l) => l.lineId === id)!);
    expect(sb.lapses).toBe(2);
    expect(Math.abs(sa.strength - sb.strength)).toBeLessThan(1e-6);
    expect((await p.pickLines(italian, "practice", 1))[0]).toBe(b);
  });

  it("never returns the same line twice in a row across consecutive calls", async () => {
    const { p } = setup();
    await learnLines(p, italian, 3);
    let prev: string | undefined;
    for (let i = 0; i < 12; i++) {
      const [id] = await p.pickLines(italian, "practice", 1);
      expect(id).not.toBe(prev);
      prev = id;
    }
    // also across list calls: the first of the next list differs from the last of the previous list
    let last: string | undefined;
    for (let i = 0; i < 12; i++) {
      const list = await p.pickLines(italian, "practice", 2);
      expect(list[0]).not.toBe(last);
      expect(new Set(list).size).toBe(list.length);
      last = list.at(-1);
    }
  });

  it("a single learned line is returned even if it repeats (nothing else to offer)", async () => {
    const { p } = setup();
    await learnLines(p, italian, 1);
    const a = await p.pickLines(italian, "practice", 1);
    const b = await p.pickLines(italian, "practice", 1);
    expect(a).toEqual(b);
    expect(a).toHaveLength(1);
  });

  it("Drill/Time return a shuffled mix of learned lines, weighted toward weak ones, with no repeats in a call", async () => {
    let seed = 42;
    const random = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
    const { p, clock } = setup({ random });
    const ids = await learnLines(p, italian, 4);
    // make line 0 clearly weak: fail it repeatedly, leave the others strong
    for (let i = 0; i < 3; i++) await p.recordLine(italian, resultFor(italian, ids[0], "practice", "again"));
    for (const id of ids.slice(1)) await p.recordLine(italian, resultFor(italian, id, "practice", "easy"));
    clock.advance(0);
    const firsts: Record<string, number> = {};
    const orders = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const list = await p.pickLines(italian, i % 2 ? "drill" : "time", 4);
      expect(list.slice().sort()).toEqual(ids.slice().sort());
      orders.add(list.join());
      firsts[list[0]] = (firsts[list[0]] ?? 0) + 1;
    }
    expect(orders.size).toBeGreaterThan(4); // genuinely shuffled
    expect(firsts[ids[0]]).toBeGreaterThan(300 / 4 + 20); // weak line leads more often than a fair share
    expect(Object.keys(firsts).length).toBe(4); // but the strong ones still appear
  });

  it("drill picks never repeat the previous call's last line", async () => {
    const { p } = setup({ random: Math.random });
    await learnLines(p, italian, 3);
    let last: string | undefined;
    for (let i = 0; i < 60; i++) {
      const list = await p.pickLines(italian, "drill", 1 + (i % 3));
      expect(list[0]).not.toBe(last);
      last = list.at(-1);
    }
  });

  it("dojo behaves like practice (due first)", async () => {
    const { p, clock } = setup();
    const [a, b] = await learnLines(p, italian, 2);
    clock.advance(40 * DAY);
    await p.recordLine(italian, resultFor(italian, b, "practice", "easy"));
    expect((await p.pickLines(italian, "dojo", 2))[0]).toBe(a);
  });
});

describe("scores", () => {
  it("keeps the top 20 per mode+course, sorted descending, and a separate global list", async () => {
    const { p, clock } = setup();
    for (let i = 1; i <= 30; i++) {
      clock.advance(1000);
      await p.recordScore({ mode: "drill", courseId: italian.id, value: i });
    }
    await p.recordScore({ mode: "drill", courseId: london.id, value: 999 });
    await p.recordScore({ mode: "time", courseId: italian.id, value: 7 });
    const top = await p.topScores("drill", italian.id, 50);
    expect(top).toHaveLength(20);
    expect(top.map((s) => s.value)).toEqual(Array.from({ length: 20 }, (_, i) => 30 - i));
    expect(top[0]).toMatchObject({ mode: "drill", courseId: italian.id, value: 30 });
    expect(top[0].at).toBeGreaterThan(0);
    expect((await p.topScores("drill", italian.id, 3)).map((s) => s.value)).toEqual([30, 29, 28]);
    const global = await p.topScores("drill");
    expect(global[0]).toMatchObject({ courseId: london.id, value: 999 });
    expect(global.map((s) => s.value)).toEqual(global.map((s) => s.value).sort((a, b) => b - a));
    expect(global).toHaveLength(20); // default limit
    expect((await p.topScores("time", italian.id)).map((s) => s.value)).toEqual([7]);
    expect(await p.topScores("time", london.id)).toEqual([]);
  });

  it("updates bestDrillStreak / bestTime and never lowers them", async () => {
    const { p } = setup();
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 5 });
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 3 });
    await p.recordScore({ mode: "time", courseId: italian.id, value: 11 });
    const cp = await p.getCourseProgress(italian);
    expect(cp.bestDrillStreak).toBe(5);
    expect(cp.bestTime).toBe(11);
    expect(await p.startedCourses()).toEqual([]); // scoring alone does not "start" a course
  });

  it("ties keep the earlier score first, and junk values are ignored", async () => {
    const { p, clock } = setup();
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 4 });
    clock.advance(5000);
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 4 });
    await p.recordScore({ mode: "drill", courseId: italian.id, value: NaN });
    await p.recordScore({ mode: "drill", courseId: italian.id, value: -1 });
    const top = await p.topScores("drill", italian.id);
    expect(top).toHaveLength(2);
    expect(top[0].at).toBeLessThan(top[1].at);
  });
});

describe("startedCourses", () => {
  it("lists courses with a learned line, most recently practised first", async () => {
    const { p, clock } = setup();
    await learnLines(p, italian, 1);
    clock.advance(HOUR);
    await learnLines(p, london, 1);
    clock.advance(HOUR);
    await learnLines(p, ruy, 1);
    expect(await p.startedCourses()).toEqual([ruy.id, london.id, italian.id]);
    clock.advance(HOUR);
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id, "practice"));
    expect(await p.startedCourses()).toEqual([italian.id, ruy.id, london.id]);
  });
});

describe("export / import / reset", () => {
  async function populated() {
    const s = setup();
    await learnLines(s.p, italian, 3);
    await learnLines(s.p, london, 1, "hard");
    await s.p.recordLine(italian, resultFor(italian, italian.lines[0].id, "practice", (i) => (i === 1 ? "again" : "good")));
    await s.p.recordScore({ mode: "drill", courseId: italian.id, value: 6 });
    await s.p.recordScore({ mode: "time", courseId: london.id, value: 9 });
    return s;
  }

  it("round-trips everything through export -> import into a fresh instance", async () => {
    const a = await populated();
    const json = await a.p.exportAll();
    expect(JSON.parse(json)).toMatchObject({ app: "opening-gym", schemaVersion: 1 });
    const b = setup({ start: a.clock.now() });
    await b.p.importAll(json);
    expect(await b.p.getCourseProgress(italian)).toEqual(await a.p.getCourseProgress(italian));
    expect(await b.p.getCourseProgress(london)).toEqual(await a.p.getCourseProgress(london));
    expect(await b.p.getStreak()).toEqual(await a.p.getStreak());
    expect(await b.p.topScores("drill")).toEqual(await a.p.topScores("drill"));
    expect(await b.p.startedCourses()).toEqual(await a.p.startedCourses());
    expect(await b.p.nextLearnLine(italian)).toBe(await a.p.nextLearnLine(italian));
    // and the re-export is identical apart from the timestamp
    const strip = (j: string) => ({ ...JSON.parse(j), exportedAt: 0 });
    expect(strip(await b.p.exportAll())).toEqual(strip(json));
  });

  it("import REPLACES existing data", async () => {
    const a = await populated();
    const json = await a.p.exportAll();
    const b = setup({ start: a.clock.now() });
    await learnLines(b.p, ruy, 2);
    await b.p.recordScore({ mode: "drill", courseId: ruy.id, value: 50 });
    await b.p.importAll(json);
    expect((await b.p.getCourseProgress(ruy)).learnedCount).toBe(0);
    expect(await b.p.topScores("drill", ruy.id)).toEqual([]);
    expect((await b.p.startedCourses()).sort()).toEqual([italian.id, london.id].sort());
  });

  it("rejects malformed input without touching existing data", async () => {
    const { p } = await populated();
    const before = await p.exportAll();
    const good = JSON.parse(before);
    const bad: unknown[] = [
      "not json {",
      "[]",
      "null",
      "{}",
      JSON.stringify({ ...good, schemaVersion: 99 }),
      JSON.stringify({ ...good, schemaVersion: "1" }),
      JSON.stringify({ ...good, app: "something-else" }),
      JSON.stringify({ ...good, courses: [] }),
      JSON.stringify({ ...good, streak: { current: -1, best: 0, lastDay: "" } }),
      JSON.stringify({ ...good, streak: { current: 1, best: 1, lastDay: "yesterday" } }),
      JSON.stringify({ ...good, scores: {} }),
      JSON.stringify({ ...good, courses: { x: { courseId: "y", learned: {}, cards: {}, lapses: {} } } }),
      JSON.stringify({ ...good, courses: { x: { courseId: "x", learned: { l: "now" }, cards: {}, lapses: {} } } }),
      JSON.stringify({ ...good, courses: { x: { courseId: "x", learned: {}, cards: { n: { due: "soon" } }, lapses: {} } } }),
    ];
    for (const json of bad) {
      await expect(p.importAll(json as string)).rejects.toThrow();
    }
    expect(await p.exportAll()).toBe(before.replace(/"exportedAt":\d+/, (m) => m)); // unchanged (same clock => same exportedAt)
  });

  it("resetCourse wipes one course (progress, scores) and leaves the rest and the streak", async () => {
    const { p } = await populated();
    const streak = await p.getStreak();
    await p.resetCourse(italian.id);
    const cp = await p.getCourseProgress(italian);
    expect(cp.learnedCount).toBe(0);
    expect(cp.bestDrillStreak).toBe(0);
    expect(await p.nextLearnLine(italian)).toBe(italian.lines[0].id);
    expect(await p.topScores("drill")).toEqual([]);
    expect((await p.getCourseProgress(london)).learnedCount).toBe(1);
    expect(await p.topScores("time")).toHaveLength(1);
    expect(await p.startedCourses()).toEqual([london.id]);
    expect(await p.getStreak()).toEqual(streak);
    await p.resetCourse("never-existed"); // harmless
  });
});

describe("subscribe", () => {
  it("fires after every write, not after reads, and stops after unsubscribe", async () => {
    const { p } = setup();
    const fn = vi.fn();
    const off = p.subscribe(fn);
    await p.getCourseProgress(italian);
    await p.pickLines(italian, "practice", 1);
    await p.getStreak();
    expect(fn).not.toHaveBeenCalled();
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id));
    expect(fn).toHaveBeenCalledTimes(1);
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 1 });
    expect(fn).toHaveBeenCalledTimes(2);
    await p.resetCourse(italian.id);
    expect(fn).toHaveBeenCalledTimes(3);
    await p.importAll(await p.exportAll());
    expect(fn).toHaveBeenCalledTimes(4);
    off();
    await p.recordScore({ mode: "drill", courseId: italian.id, value: 2 });
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("listeners can read fresh state, and a throwing listener does not break others", async () => {
    const { p } = setup();
    let seen = -1;
    vi.spyOn(console, "error").mockImplementation(() => {});
    p.subscribe(() => {
      throw new Error("boom");
    });
    p.subscribe(() => void p.getCourseProgress(italian).then((c) => (seen = c.learnedCount)));
    await p.recordLine(italian, resultFor(italian, italian.lines[0].id));
    await p.getStreak(); // let the queued read finish
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toBe(1);
    vi.restoreAllMocks();
  });
});

describe("concurrency", () => {
  it("serialises overlapping writes", async () => {
    const { p } = setup();
    await Promise.all(italian.lines.slice(0, 4).map((l) => p.recordLine(italian, resultFor(italian, l.id))));
    expect((await p.getCourseProgress(italian)).learnedCount).toBe(4);
    expect(await p.getStreak()).toMatchObject({ current: 1 });
  });

  it("two instances over one backend do not share memory (a fresh instance reloads from the backend)", async () => {
    const s = setup();
    await learnLines(s.p, italian, 2);
    const again = createProgress({ backend: s.backend, now: s.clock.now, fuzz: false });
    expect((await again.getCourseProgress(italian)).learnedCount).toBe(2);
  });
});

describe("misc", () => {
  it("clock-driven noon helper sanity", () => {
    expect(new Date(noon(2025, 6, 10)).getHours()).toBe(12);
  });
});

describe("both-side courses", () => {
  it("only schedules the colour the user plays, so a just-learned trap line is not due", async () => {
    const { getCourse } = await import("../courses");
    const { createProgress, memoryBackend } = await import("./index");
    const course = getCourse("opening-traps")!;
    const line = course.lines[0];
    const now = Date.UTC(2026, 0, 10, 12);
    const api = createProgress({ backend: memoryBackend(), now: () => now });
    const { lineNodes, userColor } = await import("../courses");
    const parity = userColor(course, line) === "white" ? 1 : 0;
    const moves = lineNodes(course, line).filter((n) => n.ply % 2 === parity).map((n) => ({ nodeId: n.id, grade: "good" as const, ms: 1000, usedHint: false }));
    await api.recordLine(course, { courseId: course.id, lineId: line.id, mode: "learn", moves, completed: true, mistakes: 0 });
    const p = await api.getCourseProgress(course);
    expect(p.learnedCount).toBe(1);
    expect(p.dueCount).toBe(0);
  });
});
