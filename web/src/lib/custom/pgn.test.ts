import { describe, expect, it } from "vitest";
import { cleanComment, mainlineLength, parsePgn } from "./pgn";
import type { PgnNode } from "./pgn";
import { STUDY_PGN } from "./fixtures/study";

const sansOf = (nodes: PgnNode[]): string[] => {
  const out: string[] = [];
  let level = nodes;
  while (level.length) {
    out.push(level[0].san);
    level = level[0].children;
  }
  return out;
};

describe("parsePgn basics", () => {
  it("reads a plain game with headers and result", () => {
    const r = parsePgn(`[Event "Test"]\n[White "A"]\n\n1. e4 e5 2. Nf3 Nc6 1-0`);
    expect(r.errors).toEqual([]);
    expect(r.games).toHaveLength(1);
    expect(r.games[0].headers.White).toBe("A");
    expect(r.games[0].name).toBe("Test");
    expect(sansOf(r.games[0].children)).toEqual(["e4", "e5", "Nf3", "Nc6"]);
    expect(mainlineLength(r.games[0])).toBe(4);
  });

  it("accepts movetext without headers and any move-number spacing", () => {
    const r = parsePgn("1.e4 e5 2. Nf3 2...Nc6 3 . Bb5");
    // "3 ." is not standard PGN but the stray "." must not break the game
    expect(r.errors).toEqual([]);
    expect(sansOf(r.games[0].children)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
  });

  it("handles Windows line endings, a BOM and % escape lines", () => {
    const r = parsePgn("﻿%escaped line\r\n[Event \"x\"]\r\n\r\n1. d4 d5\r\n");
    expect(r.errors).toEqual([]);
    expect(sansOf(r.games[0].children)).toEqual(["d4", "d5"]);
  });

  it("normalises castling written with zeros and strips check marks it does not need", () => {
    const r = parsePgn("1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. 0-0 Nf6 5. d3 O-O");
    expect(r.errors).toEqual([]);
    expect(sansOf(r.games[0].children).slice(6)).toEqual(["O-O", "Nf6", "d3", "O-O"]);
  });

  it("returns no games for empty input", () => {
    expect(parsePgn("").games).toEqual([]);
    expect(parsePgn("   \n  ").games).toEqual([]);
  });
});

describe("variations, comments and annotations", () => {
  it("builds variations as siblings of the move they replace", () => {
    const r = parsePgn("1. e4 e5 (1... c5 2. Nf3 (2. c3) 2... d6) 2. Nf3 Nc6");
    expect(r.errors).toEqual([]);
    const e4 = r.games[0].children[0];
    expect(e4.children.map((c) => c.san)).toEqual(["e5", "c5"]);
    const c5 = e4.children[1];
    expect(c5.children.map((c) => c.san)).toEqual(["Nf3", "c3"]);
    expect(c5.children[0].children.map((c) => c.san)).toEqual(["d6"]);
    // the main line continues after the variation
    expect(e4.children[0].children[0].san).toBe("Nf3");
  });

  it("attaches comments to the move before them and strips [%cal]/[%clk] commands", () => {
    const r = parsePgn("1. e4 { King pawn. [%cal Ge2e4] [%clk 0:00:09] } e5 { Symmetry. }");
    const [e4] = r.games[0].children;
    expect(e4.comment).toBe("King pawn.");
    expect(e4.children[0].comment).toBe("Symmetry.");
    expect(cleanComment("[%eval 0.2]  hello   world ")).toBe("hello world");
  });

  it("keeps a comment before the first move as the game comment and one inside a variation start for its first move", () => {
    const r = parsePgn("{ About this game. } 1. e4 e5 ( { Sicilian. } 1... c5 )");
    expect(r.games[0].comment).toBe("About this game.");
    expect(r.games[0].children[0].children[1].comment).toBe("Sicilian.");
  });

  it("supports ; comments to end of line", () => {
    const r = parsePgn("1. e4 ; the best by test\n e5 2. Nf3");
    expect(r.games[0].children[0].comment).toBe("the best by test");
    expect(sansOf(r.games[0].children)).toEqual(["e4", "e5", "Nf3"]);
  });

  it("reads !, ?, !! and NAG glyphs without confusing them with the move", () => {
    const r = parsePgn("1. e4! e5? 2. Nf3!? $2 Nc6 $6 3. Bb5 $1");
    expect(r.errors).toEqual([]);
    const seq: PgnNode[] = [];
    let level = r.games[0].children;
    while (level.length) {
      seq.push(level[0]);
      level = level[0].children;
    }
    expect(seq.map((n) => n.san)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
    expect(seq.map((n) => n.annotation)).toEqual(["!", "?", "!?", "?!", "!"]);
  });

  it("allows brackets inside comments without starting a new game", () => {
    const r = parsePgn('1. e4 { see [Event "x"] here } e5 *');
    expect(r.games).toHaveLength(1);
    expect(r.games[0].children[0].comment).toContain('[Event "x"]');
  });
});

describe("multiple games", () => {
  it("splits on results and on new header blocks", () => {
    const r = parsePgn(`[Event "One"]\n\n1. e4 e5 1-0\n\n[Event "Two"]\n\n1. d4 d5\n\n[Event "Three"]\n\n1. c4 *`);
    expect(r.errors).toEqual([]);
    expect(r.games.map((g) => g.name)).toEqual(["One", "Two", "Three"]);
    expect(r.games.map((g) => g.index)).toEqual([1, 2, 3]);
  });

  it("prefers ChapterName over Event and ignores placeholders", () => {
    const r = parsePgn(`[Event "?"]\n[ChapterName "Najdorf"]\n\n1. e4 c5 *\n\n[Event "?"]\n\n1. d4 *`);
    expect(r.games[0].name).toBe("Najdorf");
    expect(r.games[1].name).toBeUndefined();
  });

  it("reads a Lichess-study-shaped file: variations, comments, empty chapter", () => {
    const r = parsePgn(STUDY_PGN);
    expect(r.errors).toEqual([]);
    expect(r.games.map((g) => g.name)).toEqual(["Giuoco Piano", "Evans Gambit"]);
    expect(r.warnings.map((w) => w.message)).toEqual(["Has no moves, skipped."]);
    const g1 = r.games[0];
    expect(g1.comment).toMatch(/fights for the centre/);
    expect(g1.headers.Orientation).toBe("white");
    // 3... Bc5 vs the variation 3... Nf6
    const bc4 = g1.children[0].children[0].children[0].children[0].children[0];
    expect(bc4.san).toBe("Bc4");
    expect(bc4.children.map((c) => c.san)).toEqual(["Bc5", "Nf6"]);
    const nf3 = g1.children[0].children[0].children[0];
    expect(nf3.comment).toBe("Develops with tempo, attacking e5.");
    expect(bc4.children[1].comment).toBe("The Two Knights.");
    expect(bc4.children[1].annotation).toBe("!?");
    expect(g1.children[0].children[0].children[0].children[0].children[0].children[0].children[0].comment).toBe("Prepares d4.");
  });
});

describe("rejections and errors", () => {
  it("rejects games from a custom FEN with a clear message", () => {
    const r = parsePgn(`[SetUp "1"]\n[FEN "8/8/8/8/8/8/4K3/4k3 w - - 0 1"]\n\n1. Kd2 *`);
    expect(r.games).toEqual([]);
    expect(r.errors[0].message).toMatch(/custom position \(FEN\)/);
  });

  it("accepts a FEN header equal to the standard start position", () => {
    const r = parsePgn(`[SetUp "1"]\n[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]\n\n1. e4 *`);
    expect(r.errors).toEqual([]);
    expect(r.games).toHaveLength(1);
  });

  it("rejects variants", () => {
    const r = parsePgn(`[Variant "Chess960"]\n\n1. e4 *`);
    expect(r.errors[0].message).toMatch(/standard chess/);
  });

  it("reports an illegal move with its move number and keeps the other games", () => {
    const r = parsePgn(`[Event "Bad"]\n\n1. e4 e5 2. Nf6 Nc6 *\n\n[Event "Good"]\n\n1. d4 d5 *`);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0]).toMatchObject({ game: 1, name: "Bad" });
    expect(r.errors[0].message).toMatch(/Illegal or unreadable move "Nf6" at move 2\./);
    expect(r.games.map((g) => g.name)).toEqual(["Good"]);
  });

  it("reports an illegal move inside a variation", () => {
    const r = parsePgn("1. e4 e5 (1... Ke7) 2. Nf3");
    expect(r.errors[0].message).toMatch(/"Ke7" at move 1\.\.\./);
  });

  it("reports unbalanced variations and unclosed comments", () => {
    expect(parsePgn("1. e4 e5 (1... c5 2. Nf3").errors[0].message).toMatch(/never closed/);
    expect(parsePgn("1. e4 e5 ) 2. Nf3").errors[0].message).toMatch(/no matching/);
    expect(parsePgn("1. e4 { oops e5").errors[0].message).toMatch(/never closed/);
  });

  it("rejects null moves", () => {
    expect(parsePgn("1. e4 -- 2. Nf3").errors[0].message).toMatch(/Null moves/);
  });

  it("does not hang on garbage", () => {
    const r = parsePgn("[[[ ]]] }}} $$$ ((( ;;; 1.. ... !!!");
    expect(Array.isArray(r.games)).toBe(true);
  });
});
