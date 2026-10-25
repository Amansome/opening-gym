import { describe, expect, it } from "vitest";
import { fenAt, gameOverText, loadText, looksLikeFen, newGame, playMove, playUci, toPgn, START_FEN } from "./game";

describe("playMove", () => {
  it("appends, steps along the mainline, and truncates on a new move", () => {
    let g = newGame();
    let ply = 0;
    for (const uci of ["e2e4", "e7e5", "g1f3"]) {
      const r = playUci(g, ply, uci)!;
      g = r.game;
      ply = r.ply;
    }
    expect(g.moves.map((m) => m.san)).toEqual(["e4", "e5", "Nf3"]);
    // replaying the same move from ply 1 only steps
    const same = playUci(g, 1, "e7e5")!;
    expect(same.game).toBe(g);
    expect(same.ply).toBe(2);
    // a different move truncates
    const diff = playUci(g, 1, "c7c5")!;
    expect(diff.game.moves.map((m) => m.san)).toEqual(["e4", "c5"]);
    expect(diff.ply).toBe(2);
  });

  it("rejects illegal moves", () => {
    expect(playMove(newGame(), 0, { from: "e2", to: "e5" })).toBeNull();
    expect(playUci(newGame(), 0, "e7e5")).toBeNull();
  });

  it("handles promotion", () => {
    const g = newGame("8/P6k/8/8/8/8/8/K7 w - - 0 1");
    const r = playMove(g, 0, { from: "a7", to: "a8", promotion: "n" })!;
    expect(r.game.moves[0].san).toBe("a8=N");
    expect(r.game.moves[0].uci).toBe("a7a8n");
  });
});

describe("loadText", () => {
  it("loads a FEN (with or without counters)", () => {
    const r = loadText("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1");
    expect(r.ok && r.kind).toBe("fen");
    const r2 = loadText("  rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 ");
    expect(r2.ok).toBe(true);
  });

  it("rejects an illegal FEN with a message", () => {
    const r = loadText("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/8 w KQkq - 0 1");
    expect(r.ok).toBe(false);
    const r2 = loadText("8/8/8/8/8/8/8/8 w - - 0 1");
    expect(r2.ok).toBe(false);
  });

  it("loads movetext and tagged PGN", () => {
    const r = loadText("1. d4 d5 2. Bf4 Nf6 3. e3");
    expect(r.ok && r.game.moves.length).toBe(5);
    const tagged = loadText('[Event "Test"]\n[White "Alice"]\n[Black "Bob"]\n[Result "1-0"]\n\n1. e4 e5 {a comment} 2. Nf3 (2. f4) Nc6 1-0');
    expect(tagged.ok).toBe(true);
    if (tagged.ok) {
      expect(tagged.game.moves.map((m) => m.san)).toEqual(["e4", "e5", "Nf3", "Nc6"]);
      expect(tagged.game.headers.White).toBe("Alice");
    }
  });

  it("takes the first game of a multi-game file", () => {
    const r = loadText('[Event "A"]\n\n1. e4 e5 *\n\n[Event "B"]\n\n1. d4 d5 *\n');
    expect(r.ok && r.game.moves[0].san).toBe("e4");
    expect(r.ok && r.extraGames).toBe(true);
  });

  it("honours a FEN header", () => {
    const r = loadText('[SetUp "1"]\n[FEN "8/P6k/8/8/8/8/8/K7 w - - 0 1"]\n\n1. a8=Q *');
    expect(r.ok && r.game.startFen).toBe("8/P6k/8/8/8/8/8/K7 w - - 0 1");
    expect(r.ok && r.game.moves.length).toBe(1);
  });

  it("errors on junk and empty input", () => {
    expect(loadText("").ok).toBe(false);
    expect(loadText("hello world").ok).toBe(false);
    expect(loadText("1. e4 e5 2. Ke5").ok).toBe(false);
  });
});

describe("toPgn / helpers", () => {
  it("round-trips", () => {
    const loaded = loadText("1. d4 d5 2. Bf4 Nf6");
    if (!loaded.ok) throw new Error("load");
    const pgn = toPgn(loaded.game);
    expect(pgn).toContain("1. d4 d5 2. Bf4 Nf6");
    const again = loadText(pgn);
    expect(again.ok && again.game.moves.length).toBe(4);
  });

  it("writes SetUp/FEN tags for custom starts", () => {
    const g = newGame("8/P6k/8/8/8/8/8/K7 w - - 0 1");
    expect(toPgn(g)).toContain('[FEN "8/P6k/8/8/8/8/8/K7 w - - 0 1"]');
  });

  it("fenAt and looksLikeFen", () => {
    const g = newGame();
    expect(fenAt(g, 0)).toBe(START_FEN);
    expect(looksLikeFen(START_FEN)).toBe(true);
    expect(looksLikeFen("1. e4 e5")).toBe(false);
  });

  it("detects game over", () => {
    expect(gameOverText("rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3")).toMatch(/Checkmate/);
    expect(gameOverText(START_FEN)).toBeNull();
  });
});
