import { describe, expect, it } from "vitest";
import { formatPv, pvToMoves } from "./san";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("pvToMoves", () => {
  it("converts UCI to SAN and tracks fens", () => {
    const m = pvToMoves(START, ["d2d4", "d7d5", "c1f4"]);
    expect(m.map((x) => x.san)).toEqual(["d4", "d5", "Bf4"]);
    expect(m[2].from).toBe("c1");
    expect(m[2].to).toBe("f4");
    expect(m[2].fen.split(" ")[1]).toBe("b");
  });

  it("stops at an illegal move and honours the limit", () => {
    expect(pvToMoves(START, ["e2e4", "e2e4", "d7d5"]).map((x) => x.san)).toEqual(["e4"]);
    expect(pvToMoves(START, ["e2e4", "e7e5", "g1f3"], 2)).toHaveLength(2);
  });

  it("handles castling and promotion", () => {
    const castle = pvToMoves("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", ["e1g1", "e8c8"]);
    expect(castle.map((x) => x.san)).toEqual(["O-O", "O-O-O"]);
    const promo = pvToMoves("8/P6k/8/8/8/8/8/K7 w - - 0 1", ["a7a8q"]);
    expect(promo[0].san).toBe("a8=Q");
  });

  it("returns [] for a bad fen", () => {
    expect(pvToMoves("nonsense", ["e2e4"])).toEqual([]);
  });
});

describe("formatPv", () => {
  it("numbers moves from White", () => {
    const m = pvToMoves(START, ["d2d4", "d7d5", "c1f4", "g8f6"]);
    expect(formatPv(START, m)).toBe("1.d4 d5 2.Bf4 Nf6");
  });
  it("starts with an ellipsis when Black is to move", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1";
    const m = pvToMoves(fen, ["d7d5", "c1f4", "g8f6"]);
    expect(formatPv(fen, m)).toBe("1...d5 2.Bf4 Nf6");
  });
});
