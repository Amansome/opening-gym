import { describe, expect, it } from "vitest";
import { buildCourse, buildFromTree, findConflicts, newCourseId, resolveConflicts, slugify } from "./builder";
import { addMove, courseToDraft, deleteLine, deleteNode, draftToLines, fenAt, leaves, mergeGames, setLeafMeta, setNote } from "./draft";
import type { DraftLine, DraftTree } from "./draft";
import { courseToPgn, pgnFileName } from "./export";
import { parsePgn } from "./pgn";
import { lineNodes, trainableLines } from "../courses";
import { STUDY_PGN } from "./fixtures/study";

const none = () => undefined;
const line = (sans: string, kind: DraftLine["kind"] = "main", name?: string): DraftLine => ({
  name,
  kind,
  sans: sans.split(" "),
  notes: [],
});

describe("slugs and ids", () => {
  it("slugifies", () => {
    expect(slugify("Mi Italiana: Ñandú!")).toBe("mi-italiana-nandu");
    expect(slugify("???")).toBe("course");
  });
  it("makes custom-<slug>-<random5> ids", () => {
    const id = newCourseId("My Italian", () => 0.5);
    expect(id).toMatch(/^custom-my-italian-[a-z0-9]{5}$/);
    expect(newCourseId("My Italian")).not.toBe(newCourseId("My Italian"));
  });
});

describe("buildCourse", () => {
  it("builds the tree with ids, plies, fens, trained flags and notes", () => {
    const lines: DraftLine[] = [
      { name: "Italian", kind: "main", sans: "e4 e5 Nf3 Nc6 Bc4".split(" "), notes: ["Take the centre.", undefined, "Attack e5.", undefined, "Eye f7."] },
      { name: "Italian, 3...Nf6", kind: "alternative", sans: "e4 e5 Nf3 Nc6 Bc4 Nf6".split(" "), notes: [] },
    ];
    const r = buildCourse({ id: "custom-x-abcde", title: "My Italian", side: "white", lines, lookup: none });
    expect(r.errors).toEqual([]);
    const c = r.course!;
    expect(c.id).toBe("custom-x-abcde");
    expect(c.custom).toBe(true);
    expect(c.tree).toHaveLength(1);
    const e4 = c.tree[0];
    expect(e4).toMatchObject({ id: "e4", ply: 1, san: "e4", uci: "e2e4", trained: true, note: "Take the centre." });
    expect(e4.fen).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
    expect(e4.children[0]).toMatchObject({ id: "e4 e5", ply: 2, trained: false });
    expect(c.lines.map((l) => l.id)).toEqual(["italian", "italian-3-nf6"]);
    expect(c.lines[0].pgn).toBe("1.e4 1...e5 2.Nf3 2...Nc6 3.Bc4");
    expect(c.lines[0].plies).toBe(5);
    // the line's nodes can be walked with the real helper
    expect(lineNodes(c, c.lines[1]).map((n) => n.san)).toEqual(lines[1].sans);
    // shared prefix is one node
    expect(c.tree[0].children[0].children[0].children[0].children[0].children).toHaveLength(1);
  });

  it("marks black's moves as trained for a Black course", () => {
    const r = buildCourse({ title: "Sicilian", side: "black", lines: [line("e4 c5 Nf3 d6")], lookup: none });
    const nodes = lineNodes(r.course!, r.course!.lines[0]);
    expect(nodes.map((n) => n.trained)).toEqual([false, true, false, true]);
  });

  it("names positions from built-in courses by FEN (transpositions too) and fills ECO", () => {
    const r = buildCourse({ title: "Italian", side: "white", lines: [line("e4 e5 Nf3 Nc6 Bc4 Bc5")] });
    const c = r.course!;
    expect(c.lines[0].opening).toMatch(/Italian Game/);
    expect(c.eco).toMatch(/^C5\d$/);
    expect(c.lines[0].name).toMatch(/Italian/); // default name comes from the opening
    // transposition: same position via a different move order
    const t = buildCourse({ title: "T", side: "white", lines: [line("Nf3 Nc6 e4 e5 Bc4 Bc5")] });
    expect(t.course!.lines[0].opening).toMatch(/Italian Game/);
  });

  it("gives every line a unique name and slug id", () => {
    const r = buildCourse({ title: "Dupes", side: "white", lines: [line("e4 e5", "main", "Same"), line("d4 d5", "main", "Same"), line("c4 c5", "main", "same")], lookup: none });
    expect(r.course!.lines.map((l) => l.name)).toEqual(["Same", "Same 2", "same 3"]);
    expect(new Set(r.course!.lines.map((l) => l.id)).size).toBe(3);
  });

  it("puts warning lines last so the first line is trainable", () => {
    const r = buildCourse({ title: "W", side: "white", lines: [line("e4 e5 f4", "warning", "Trap"), line("e4 e5 Nf3")], lookup: none });
    expect(r.course!.lines.map((l) => l.kind)).toEqual(["main", "warning"]);
  });

  it("errors on no name, no lines, only warnings and illegal moves", () => {
    expect(buildCourse({ title: " ", side: "white", lines: [line("e4")], lookup: none }).errors).toContain("Give the course a name.");
    expect(buildCourse({ title: "x", side: "white", lines: [], lookup: none }).errors).toContain("Add at least one line to the course.");
    expect(buildCourse({ title: "x", side: "white", lines: [line("e4 e5", "warning")], lookup: none }).errors[0]).toMatch(/main line or an alternative/);
    const bad = buildCourse({ title: "x", side: "white", lines: [line("e4 e5 Nf6")], lookup: none });
    expect(bad.errors[0]).toMatch(/illegal move 2\.Nf6/);
    expect(bad.course).toBeUndefined();
  });

  it("skips lines with nothing to practise", () => {
    const r = buildCourse({ title: "x", side: "black", lines: [line("e4"), line("e4 e5")], lookup: none });
    expect(r.course!.lines).toHaveLength(1);
    expect(r.warnings.map((w) => w.code)).toEqual(["no-trained-move"]);
  });
});

describe("one answer per position", () => {
  const lines = [line("e4 e5 Nf3 Nc6 Bc4", "main", "Italian"), line("e4 e5 Nf3 Nc6 Bb5", "main", "Spanish"), line("e4 e5 Nf3 Nc6 d4", "main", "Scotch-ish")];

  it("reports later main lines that disagree, with the lines involved", () => {
    const r = buildCourse({ title: "x", side: "white", lines, lookup: none });
    expect(r.errors).toEqual([]);
    const conflicts = r.warnings.filter((w) => w.code === "conflict");
    expect(conflicts).toHaveLength(2);
    expect(conflicts[0]).toMatchObject({ lineIndex: 1, otherLineIndex: 0, sans: lines[1].sans });
    expect(conflicts[0].message).toMatch(/"Spanish" plays 3\.Bb5 where "Italian" plays Bc4/);
    // both later lines are compared with the FIRST answer
    expect(conflicts[1]).toMatchObject({ lineIndex: 2, otherLineIndex: 0 });
  });

  it("does not flag the opponent's different replies, alternatives, warnings or identical answers", () => {
    const ok = [line("e4 e5 Nf3 Nc6 Bc4"), line("e4 c5 Nf3 d6 d4"), line("e4 e5 Nf3 Nc6 Bb5", "alternative"), line("e4 e5 Nf3 Nc6 d4", "warning"), line("e4 e5 Nf3 Nf6 Nxe5")];
    expect(findConflicts(ok, "white")).toEqual([]);
  });

  it("detects conflicts through transpositions", () => {
    const l = [line("e4 e5 Nf3 Nc6 Bc4"), line("Nf3 Nc6 e4 e5 Bb5")];
    expect(findConflicts(l, "white")).toHaveLength(1);
  });

  it("checks only the side being trained", () => {
    const l = [line("e4 e5 Nf3 Nc6 Bc4"), line("e4 e5 Nf3 d6 Bc4")]; // black differs, white agrees
    expect(findConflicts(l, "white")).toEqual([]);
    expect(findConflicts(l, "black")).toHaveLength(1);
    expect(findConflicts([line("e4 e5"), line("d4 d5")], "both")).toEqual([]);
  });

  it("can mark the later lines as alternatives, which clears the warnings", () => {
    const fixed = resolveConflicts(lines, "white");
    expect(fixed.map((l) => l.kind)).toEqual(["main", "alternative", "alternative"]);
    expect(findConflicts(fixed, "white")).toEqual([]);
    const r = buildCourse({ title: "x", side: "white", lines, conflicts: "alternative", lookup: none });
    expect(r.warnings).toEqual([]);
    expect(r.course!.lines.map((l) => l.kind)).toEqual(["main", "alternative", "alternative"]);
    expect(trainableLines(r.course!)).toHaveLength(3);
  });
});

describe("draft tree editing", () => {
  it("adds moves, branches, notes and deletes branches", () => {
    let t: DraftTree = [];
    t = addMove(t, [], "e4");
    t = addMove(t, ["e4"], "e5");
    t = addMove(t, ["e4", "e5"], "Nf3");
    t = addMove(t, ["e4"], "c5"); // branch
    t = addMove(t, ["e4"], "c5"); // no duplicate
    expect(leaves(t).map((l) => l.path.join(" "))).toEqual(["e4 e5 Nf3", "e4 c5"]);
    t = setNote(t, ["e4", "e5"], "Open game.");
    expect(draftToLines(t)[0].notes).toEqual([undefined, "Open game.", undefined]);
    t = setNote(t, ["e4", "e5"], "  ");
    expect(draftToLines(t)[0].notes[1]).toBeUndefined();
    t = deleteNode(t, ["e4", "c5"]);
    expect(leaves(t)).toHaveLength(1);
    t = deleteNode(t, ["e4"]);
    expect(t).toEqual([]);
  });

  it("moves a leaf's line name and kind onto the move that extends it", () => {
    let t = addMove([], [], "e4");
    t = setLeafMeta(t, ["e4"], { name: "King pawn", kind: "alternative" });
    t = addMove(t, ["e4"], "e5");
    expect(draftToLines(t)[0]).toMatchObject({ name: "King pawn", kind: "alternative", sans: ["e4", "e5"] });
    t = setLeafMeta(t, ["e4", "e5"], { name: "" });
    expect(draftToLines(t)[0].name).toBeUndefined();
  });

  it("deleteLine removes a line back to its branch point only", () => {
    let t: DraftTree = [];
    for (const p of [["e4", "e5", "Nf3", "Nc6"], ["e4", "e5", "Nf3", "Nf6"], ["e4", "c5"]]) {
      for (let i = 0; i < p.length; i++) t = addMove(t, p.slice(0, i), p[i]);
    }
    t = deleteLine(t, ["e4", "e5", "Nf3", "Nf6"]);
    expect(leaves(t).map((l) => l.path.join(" "))).toEqual(["e4 e5 Nf3 Nc6", "e4 c5"]);
    t = deleteLine(t, ["e4", "e5", "Nf3", "Nc6"]);
    expect(leaves(t).map((l) => l.path.join(" "))).toEqual(["e4 c5"]);
    t = deleteLine(t, ["e4", "c5"]);
    expect(t).toEqual([]);
  });

  it("computes the FEN at a path", () => {
    expect(fenAt(["e4", "e5"])).toBe("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");
    expect(fenAt(["e4", "Ke7"])).toBeUndefined();
  });
});

describe("PGN import into a course", () => {
  it("turns the study fixture into named lines, variations included", () => {
    const { games } = parsePgn(STUDY_PGN);
    const tree = mergeGames([], games);
    const lines = draftToLines(tree);
    expect(lines.map((l) => l.name)).toEqual(["Giuoco Piano", "Evans Gambit", "Giuoco Piano (3...Nf6)"]); // depth-first through the merged tree
    expect(lines[0].sans).toEqual("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6".split(" "));
    expect(lines[2].sans).toEqual("e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5".split(" "));
    expect(lines[0].notes[2]).toBe("Develops with tempo, attacking e5.");
    expect(lines[2].notes[5]).toBe("The Two Knights.");

    const r = buildFromTree({ title: "Italian", side: "white", tree, lookup: none });
    expect(r.errors).toEqual([]);
    // Evans (4.b4) and 4.c3 are different white answers in the same position: a real conflict
    expect(r.warnings.map((w) => w.code)).toEqual(["conflict"]);
    expect(r.warnings[0].message).toMatch(/"Evans Gambit" plays 4\.b4 where "Giuoco Piano" plays c3/);
    const fixed = buildFromTree({ title: "Italian", side: "white", tree, conflicts: "alternative", lookup: none });
    expect(fixed.course!.lines.map((l) => l.kind)).toEqual(["main", "alternative", "main"]);
    expect(fixed.course!.lines[0].opening).toBeUndefined();
  });

  it("merging the same game twice does not duplicate lines or overwrite notes", () => {
    const { games } = parsePgn("[Event \"A\"]\n\n1. e4 { First. } e5 *");
    const once = mergeGames([], games);
    const twice = mergeGames(once, parsePgn("[Event \"B\"]\n\n1. e4 { Second. } e5 *").games);
    expect(draftToLines(twice)).toHaveLength(1);
    expect(draftToLines(twice)[0]).toMatchObject({ name: "A", notes: ["First.", undefined] });
  });

  it("a longer game extends a shorter one and the shorter name disappears", () => {
    const a = mergeGames([], parsePgn("[Event \"Short\"]\n\n1. e4 e5 *").games);
    const b = mergeGames(a, parsePgn("[Event \"Long\"]\n\n1. e4 e5 2. Nf3 *").games);
    expect(draftToLines(b).map((l) => l.name)).toEqual(["Long"]);
  });
});

describe("PGN export", () => {
  const { games } = parsePgn(STUDY_PGN);
  const tree = mergeGames([], games);
  const built = buildFromTree({ id: "custom-it-12345", title: "Italian \"Rep\"", side: "white", tree, conflicts: "alternative", createdAt: Date.UTC(2026, 9, 25), lookup: none }).course!;

  it("writes headers, comments and variations", () => {
    const pgn = courseToPgn(built);
    expect(pgn).toContain('[Event "Italian \\"Rep\\""]');
    expect(pgn).toContain('[Date "2026.10.25"]');
    expect(pgn).toContain('[Orientation "White"]');
    expect(pgn).toContain("{ Develops with tempo, attacking e5. }");
    expect(pgn).toMatch(/3\.\.\.Bc5 \(3\.\.\.Nf6 \{ The Two Knights\. \} 4\.Ng5/);
    expect(pgn).toMatch(/\*\n$/);
    expect(pgn.split("\n").every((l) => l.length <= 100 || l.startsWith("["))).toBe(true);
  });

  it("round-trips: re-importing the export gives the same lines and notes", () => {
    for (const mode of ["tree", "lines"] as const) {
      const text = courseToPgn(built, { mode });
      const re = parsePgn(text);
      expect(re.errors).toEqual([]);
      const again = buildFromTree({ title: "x", side: "white", tree: mergeGames([], re.games), conflicts: "alternative", lookup: none }).course!;
      expect(again.lines.map((l) => l.sans)).toEqual(built.lines.map((l) => l.sans));
      const notes = (c: typeof built) => JSON.stringify(c.tree, (k, v) => (k === "note" ? v : k === "children" || /^\d+$/.test(k) || k === "" ? v : k === "san" ? v : undefined));
      expect(notes(again)).toBe(notes(built));
    }
  });

  it("lines mode keeps names and kinds in headers", () => {
    const text = courseToPgn(built, { mode: "lines" });
    expect(text.match(/^\[Event /gm)).toHaveLength(built.lines.length);
    expect(text).toContain('[LineKind "alternative"]');
    expect(text).toContain('[ChapterName "Evans Gambit"]');
    const re = parsePgn(text);
    expect(re.games.map((g) => g.name)).toEqual(built.lines.map((l) => l.name));
  });

  it("builds a safe file name", () => {
    expect(pgnFileName(built)).toBe("italian-rep.pgn");
  });
});

describe("editing an existing course", () => {
  it("courseToDraft restores the tree, notes, names and kinds so a rebuild is identical", () => {
    const { games } = parsePgn(STUDY_PGN);
    const first = buildFromTree({ id: "custom-a-11111", title: "A", side: "white", tree: mergeGames([], games), conflicts: "alternative", createdAt: 1, lookup: none }).course!;
    const second = buildFromTree({ id: first.id, title: first.title, side: "white", tree: courseToDraft(first), createdAt: 1, lookup: none }).course!;
    expect(second).toEqual({ ...first, summary: second.summary });
  });
});
