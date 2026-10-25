import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { courses } from "../courses";
import { coursesAt, epd, indexCourses, openingName } from "./positions";

function fenAfter(sans: string[]): string {
  const c = new Chess();
  for (const s of sans) c.move(s);
  return c.fen();
}

describe("positions index", () => {
  it("epd drops the move counters", () => {
    expect(epd("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -");
    expect(epd("8/8/8/8/8/8/8/K6k b - - 12 40")).toBe("8/8/8/8/8/8/8/K6k b - -");
  });

  it("finds a named, trained position in the built-in courses", () => {
    const london = courses.find((c) => /london/i.test(c.title));
    expect(london).toBeDefined();
    const line = london!.lines.find((l) => l.kind === "main")!;
    const fen = fenAfter(line.sans.slice(0, 3));
    const hits = coursesAt(fen);
    expect(hits.some((h) => h.courseId === london!.id)).toBe(true);
  });

  it("matches transpositions through the EPD", () => {
    const idx = indexCourses(courses);
    const course = courses[0];
    const node = course.tree[0];
    const hits = idx.coursesAt(node.fen.replace(/ \d+ \d+$/, " 0 99"));
    expect(hits.some((h) => h.courseId === course.id)).toBe(true);
  });

  it("the start position lists every course", () => {
    const start = new Chess().fen();
    expect(coursesAt(start).length).toBe(courses.length);
  });

  it("returns undefined / empty for unknown positions", () => {
    const fen = "8/8/8/4k3/8/8/4K3/8 w - - 0 1";
    expect(openingName(fen)).toBeUndefined();
    expect(coursesAt(fen)).toEqual([]);
  });
});
