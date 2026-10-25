import { describe, expect, it } from "vitest";
import { buildReport } from "./aggregate";
import { checkGame, checkGames, epd, moveLabel, prepareGame, userColorIn } from "./matcher";
import type { FetchedGame } from "./types";
import { caro, italian } from "./__fixtures__/test-courses";

function game(moves: string, white = "me", black = "opp", id = "g"): FetchedGame {
  return { id, site: "lichess", url: `https://lichess.org/${id}`, white, black, moves: moves.split(" "), result: "1-0" };
}
const check = (moves: string, color: "white" | "black", courses = [italian, caro]) =>
  checkGame(prepareGame(game(moves)), color, courses);

describe("helpers", () => {
  it("labels moves", () => {
    expect(moveLabel(7, "Nc3")).toBe("4.Nc3");
    expect(moveLabel(8, "Nc6")).toBe("4...Nc6");
  });
  it("finds the user's colour case-insensitively", () => {
    expect(userColorIn(game("e4", "Me"), "ME")).toBe("white");
    expect(userColorIn(game("e4", "x", "Me"), "me")).toBe("black");
    expect(userColorIn(game("e4", "x", "y"), "me")).toBeNull();
  });
  it("epd ignores clocks and en passant", () => {
    expect(epd("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq");
  });
});

describe("(a) the user deviated", () => {
  it("reports expected vs played, ply, lines and note", () => {
    const c = check("e4 e5 Nf3 Nc6 Bb5 a6", "white");
    expect(c.kind).toBe("user-deviation");
    expect(c.courseId).toBe("italian");
    expect(c.ply).toBe(5);
    expect(c.depth).toBe(4);
    expect(c.moveLabel).toBe("3.Bb5");
    expect(c.played).toBe("Bb5");
    expect(c.expected).toEqual(["Bc4"]);
    expect(c.expectedLabel).toBe("3.Bc4");
    expect(c.expectedLines).toEqual(expect.arrayContaining(["Giuoco Piano", "Two Knights"]));
    expect(c.note).toBe("The bishop eyes f7.");
    expect(c.fen).toContain("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w");
  });
  it("flags a move that only appears in a trap-to-avoid line", () => {
    const c = check("e4 e5 Nf3 Nc6 Bc4 Bc5 Nxe5", "white");
    expect(c.kind).toBe("user-deviation");
    expect(c.knownMistake).toBe(true);
    expect(c.expectedLabel).toBe("4.c3");
  });
  it("marks engine-approved alternatives", () => {
    const c = check("e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Be7 Ng5", "white");
    // 4.d3? no: ply 7 is d3 and ply 9 is O-O; Ng5 at ply 9 is not listed fine (fine sits on ply 7)
    expect(c.kind).toBe("user-deviation");
    const d = check("e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5", "white");
    expect(d.kind).toBe("user-deviation");
    expect(d.ply).toBe(7);
    expect(d.engineFine).toBe(true);
    expect(c.engineFine).toBe(false);
  });
});

describe("(b) the opponent left the book", () => {
  it("reports the surprise and the replies the course expects", () => {
    const c = check("e4 e5 Nf3 d6 d4", "white");
    expect(c.kind).toBe("opponent-left");
    expect(c.ply).toBe(4);
    expect(c.moveLabel).toBe("2...d6");
    expect(c.played).toBe("d6");
    expect(c.expected).toEqual(["Nc6"]);
    expect(c.depth).toBe(3);
  });
});

describe("(c) followed the course", () => {
  it("counts plies used when the course ends", () => {
    const c = check("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4 exd4 cxd4 Bb4+", "white");
    expect(c.kind).toBe("followed");
    expect(c.depth).toBe(9);
  });
  it("counts a game that ends inside the course", () => {
    const c = check("e4 e5 Nf3 Nc6 Bc4", "white");
    expect(c.kind).toBe("followed");
    expect(c.depth).toBe(5);
  });
});

describe("transpositions", () => {
  it("matches by position when the SAN path differs", () => {
    // Course 'Move order' line starts 1.Nf3; the game reaches the Giuoco Piano position through
    // 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 (SAN path) - and via 1.Nf3 Nc6 2.e4 e5 (position match with e4 path).
    const c = check("Nf3 Nc6 e4 e5 Bc4 Bc5 c3 Nf6 d4", "white");
    expect(c.kind).toBe("followed");
    expect(c.depth).toBe(9);
  });
  it("continues in the transposed branch and then reports deviations there", () => {
    const c = check("Nf3 Nc6 e4 e5 Bc4 Bc5 b4", "white", [italian]);
    expect(c.kind).toBe("user-deviation");
    expect(c.expected).toEqual(["c3"]);
    expect(c.moveLabel).toBe("4.b4");
  });
  it("is not fooled by a different move order that reaches a different position", () => {
    const c = check("e4 e5 Bc4 Nc6 Nf3", "white", [italian]);
    // 2.Bc4 is not in the course; position after 2.Bc4 does not occur in it either
    expect(c.kind).toBe("user-deviation");
    expect(c.ply).toBe(3);
  });
});

describe("black-side games", () => {
  it("detects a user deviation as black", () => {
    const c = check("e4 c6 d4 d5 e5 c5", "black");
    expect(c.kind).toBe("user-deviation");
    expect(c.courseId).toBe("caro");
    expect(c.moveLabel).toBe("3...c5");
    expect(c.expectedLabel).toBe("3...Bf5");
    expect(c.depth).toBe(5);
  });
  it("detects the opponent leaving the book as black", () => {
    const c = check("e4 c6 d4 d5 f3 dxe4", "black");
    expect(c.kind).toBe("opponent-left");
    expect(c.moveLabel).toBe("3.f3");
    expect(c.expected).toEqual(expect.arrayContaining(["e5", "Nc3"]));
  });
  it("never compares a black game with white courses", () => {
    const c = checkGame(prepareGame(game("e4 e5")), "black", [italian]);
    expect(c.kind).toBe("no-course");
  });
  it("treats an unprepared first decision as outside the repertoire", () => {
    expect(check("d4 d5 c4", "black").kind).toBe("uncovered"); // opponent's 1st move
    expect(check("e4 e5 Nf3", "black").kind).toBe("uncovered"); // user's 1st move
    expect(check("c4 e5", "white").kind).toBe("uncovered");
  });
});

describe("course choice and report", () => {
  it("picks the deepest-matching course and prefers started courses on ties", () => {
    const other = { ...italian, id: "italian-copy", title: "copy" };
    const prefer = new Set(["italian-copy"]);
    const c = checkGame(prepareGame(game("e4 e5 Nf3 Nc6 Bb5")), "white", [italian, other], { preferIds: prefer });
    expect(c.courseId).toBe("italian-copy");
    const d = checkGame(prepareGame(game("e4 e5 Nf3 Nc6 Bb5")), "white", [italian, other]);
    expect(d.courseId).toBe("italian");
  });

  it("aggregates repeated deviations and summarises", () => {
    const games = [
      game("e4 e5 Nf3 Nc6 Bb5 a6", "me", "o", "a"),
      game("e4 e5 Nf3 Nc6 Bb5 Nf6", "me", "o", "b"),
      game("e4 e5 Nf3 Nc6 d4 exd4", "me", "o", "c"),
      game("e4 e5 Nf3 d6 d4", "me", "o", "d"),
      game("e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4", "me", "o", "e"),
      game("e4 c6 d4 d5 e5 Bf5", "o", "Me", "f"),
      game("e4 e5", "x", "y", "z"),
    ];
    const { checks, skipped } = checkGames(games, "me", [italian, caro]);
    expect(skipped).toBe(1);
    const r = buildReport(checks, skipped);
    expect(r.summary.checked).toBe(6);
    expect(r.summary.userDeviations).toBe(3);
    expect(r.mistakes[0].count).toBe(2);
    expect(r.mistakes[0].playedLabel).toBe("3.Bb5");
    expect(r.mistakes[0].expectedLabel).toBe("3.Bc4");
    expect(r.mistakes[0].games.map((g) => g.id)).toEqual(["a", "b"]);
    expect(r.summary.mostMissed?.key).toBe(r.mistakes[0].key);
    expect(r.surprises).toHaveLength(1);
    expect(r.followed.map((f) => f.game.id)).toEqual(["e", "f"]);
    expect(r.summary.avgBookPlies).toBeGreaterThan(3);
  });
});
