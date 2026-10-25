import { describe, expect, it } from "vitest";
import { favours, formatScore, formatScoreShort, parseBestMove, parseInfo, splitUci, whiteShare } from "./uci";

const LINE =
  "info depth 18 seldepth 25 multipv 2 score cp 34 nodes 123456 nps 987654 hashfull 12 tbhits 0 time 125 pv d2d4 d7d5 c1f4 g8f6";

describe("parseInfo", () => {
  it("parses cp, depth, multipv, pv and stats (White to move)", () => {
    const l = parseInfo(LINE, "w")!;
    expect(l.depth).toBe(18);
    expect(l.seldepth).toBe(25);
    expect(l.multipv).toBe(2);
    expect(l.score).toEqual({ cp: 34, mate: null });
    expect(l.pv).toEqual(["d2d4", "d7d5", "c1f4", "g8f6"]);
    expect(l.nodes).toBe(123456);
    expect(l.nps).toBe(987654);
    expect(l.time).toBe(125);
    expect(l.bound).toBeUndefined();
  });

  it("normalises to White's point of view when Black is to move", () => {
    const l = parseInfo("info depth 10 multipv 1 score cp 50 pv e7e5", "b")!;
    expect(l.score.cp).toBe(-50);
    const m = parseInfo("info depth 10 multipv 1 score mate 3 pv d8h4", "b")!;
    expect(m.score).toEqual({ cp: null, mate: -3 });
  });

  it("parses mate scores for both signs", () => {
    expect(parseInfo("info depth 5 multipv 1 score mate 2 pv h5f7", "w")!.score.mate).toBe(2);
    expect(parseInfo("info depth 5 multipv 1 score mate -2 pv a1a2", "w")!.score.mate).toBe(-2);
    expect(parseInfo("info depth 5 multipv 1 score mate -2 pv a1a2", "b")!.score.mate).toBe(2);
  });

  it("parses bounds and flips them with the side to move", () => {
    expect(parseInfo("info depth 12 multipv 1 score cp 80 lowerbound nodes 5 pv e2e4", "w")!.bound).toBe("lower");
    expect(parseInfo("info depth 12 multipv 1 score cp 80 upperbound nodes 5 pv e2e4", "w")!.bound).toBe("upper");
    const b = parseInfo("info depth 12 multipv 1 score cp 80 lowerbound nodes 5 pv e7e5", "b")!;
    expect(b.bound).toBe("upper");
    expect(b.score.cp).toBe(-80);
  });

  it("defaults multipv to 1 and tolerates a missing pv", () => {
    const l = parseInfo("info depth 1 score cp 0", "w")!;
    expect(l.multipv).toBe(1);
    expect(l.pv).toEqual([]);
  });

  it("keeps promotions and castling in the pv", () => {
    const l = parseInfo("info depth 9 multipv 1 score cp -15 pv e1g1 a7a8q", "w")!;
    expect(l.pv).toEqual(["e1g1", "a7a8q"]);
  });

  it("ignores lines without a score", () => {
    expect(parseInfo("info string NNUE evaluation using nn-xxxx.nnue", "w")).toBeNull();
    expect(parseInfo("info depth 3 currmove e2e4 currmovenumber 1", "w")).toBeNull();
    expect(parseInfo("bestmove e2e4 ponder e7e5", "w")).toBeNull();
    expect(parseInfo("", "w")).toBeNull();
  });
});

describe("parseBestMove", () => {
  it("reads best move, none and non-bestmove lines", () => {
    expect(parseBestMove("bestmove e2e4 ponder e7e5")).toBe("e2e4");
    expect(parseBestMove("bestmove e7e8q")).toBe("e7e8q");
    expect(parseBestMove("bestmove (none)")).toBeNull();
    expect(parseBestMove("readyok")).toBeUndefined();
  });
});

describe("splitUci", () => {
  it("splits squares and promotion", () => {
    expect(splitUci("e2e4")).toEqual({ from: "e2", to: "e4" });
    expect(splitUci("a7a8q")).toEqual({ from: "a7", to: "a8", promotion: "q" });
  });
});

describe("score formatting", () => {
  it("formats centipawns and mates", () => {
    expect(formatScore({ cp: 35, mate: null })).toBe("+0.35");
    expect(formatScore({ cp: -120, mate: null })).toBe("-1.20");
    expect(formatScore({ cp: 0, mate: null })).toBe("0.00");
    expect(formatScore({ cp: null, mate: 3 })).toBe("M3");
    expect(formatScore({ cp: null, mate: -5 })).toBe("-M5");
  });

  it("formats compact labels", () => {
    expect(formatScoreShort({ cp: 35, mate: null })).toBe("+0.3");
    expect(formatScoreShort({ cp: -128, mate: null })).toBe("-1.3");
    expect(formatScoreShort({ cp: 1250, mate: null })).toBe("+13");
    expect(formatScoreShort({ cp: 2, mate: null })).toBe("0.0");
    expect(formatScoreShort({ cp: null, mate: -4 })).toBe("-M4");
  });

  it("maps scores to an eval-bar share", () => {
    expect(whiteShare({ cp: 0, mate: null })).toBeCloseTo(50, 5);
    expect(whiteShare({ cp: 300, mate: null })).toBeGreaterThan(60);
    expect(whiteShare({ cp: -300, mate: null })).toBeLessThan(40);
    expect(whiteShare({ cp: null, mate: 2 })).toBe(100);
    expect(whiteShare({ cp: null, mate: -2 })).toBe(0);
    expect(whiteShare({ cp: 100000, mate: null })).toBeLessThan(100);
  });

  it("says who is better", () => {
    expect(favours({ cp: 10, mate: null })).toBe("even");
    expect(favours({ cp: 90, mate: null })).toBe("white");
    expect(favours({ cp: -90, mate: null })).toBe("black");
    expect(favours({ cp: null, mate: -1 })).toBe("black");
  });
});
