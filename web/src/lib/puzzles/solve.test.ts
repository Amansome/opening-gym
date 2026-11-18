import { describe, expect, it } from "vitest";
import { hintSquare, isSolutionMove, playMove, prompt, solutionText, solverMoves, solverMovesLeft, startState } from "./solve";
import { blackPuzzle, longPuzzle, matePuzzle } from "./fixtures";

describe("solution checking", () => {
  it("accepts the exact solution move", () => {
    const r = playMove(longPuzzle, startState(longPuzzle), { from: "e2", to: "e4" });
    expect(r.kind).toBe("correct");
  });

  it("rejects any other move and leaves the state alone", () => {
    const s = startState(longPuzzle);
    const r = playMove(longPuzzle, s, { from: "d2", to: "d4" });
    expect(r.kind).toBe("wrong");
    expect(r.state).toBe(s);
  });

  it("rejects an illegal move without throwing", () => {
    expect(playMove(longPuzzle, startState(longPuzzle), { from: "e2", to: "e5" }).kind).toBe("wrong");
  });

  it("in a mate puzzle accepts an alternative move that also mates", () => {
    const s = startState(matePuzzle);
    expect(isSolutionMove(matePuzzle, s, { from: "e1", to: "e8" })).toBe(true);
    expect(playMove(matePuzzle, s, { from: "e1", to: "e8" }).kind).toBe("solved");
    expect(playMove(matePuzzle, s, { from: "d1", to: "d8" }).kind).toBe("solved");
  });

  it("in a mate puzzle still rejects a move that does not mate", () => {
    expect(playMove(matePuzzle, startState(matePuzzle), { from: "d1", to: "d7" }).kind).toBe("wrong");
  });

  it("does not accept an alternative that mates in a material puzzle", () => {
    // same position, but a material puzzle: only the listed move counts
    const p = { ...matePuzzle, kind: "material" as const };
    expect(playMove(p, startState(p), { from: "e1", to: "e8" }).kind).toBe("wrong");
  });

  it("accepts a queen promotion given without the suffix", () => {
    const p = { ...matePuzzle, fen: "7k/4P3/8/8/8/8/8/K7 w - - 0 1", moves: ["e7e8q"], kind: "material" as const };
    expect(isSolutionMove(p, startState(p), { from: "e7", to: "e8" })).toBe(true);
    expect(isSolutionMove(p, startState(p), { from: "e7", to: "e8", promotion: "n" })).toBe(false);
  });
});

describe("opponent auto-reply sequencing", () => {
  it("plays the opponent's reply after a correct non-final move, then finishes on the last solver move", () => {
    const s0 = startState(longPuzzle);
    const r1 = playMove(longPuzzle, s0, { from: "e2", to: "e4" });
    if (r1.kind !== "correct") throw new Error("expected correct");
    expect(r1.reply).toEqual({ from: "e7", to: "e5", promotion: undefined });
    expect(r1.afterUser.step).toBe(1);
    expect(r1.afterUser.fen.split(" ")[1]).toBe("b"); // the board shows the user's move, then the reply
    expect(r1.state.step).toBe(2);
    expect(r1.state.fen.split(" ")[1]).toBe("w");
    expect(r1.state.last).toEqual({ from: "e7", to: "e5" });
    expect(solverMovesLeft(longPuzzle, r1.state)).toBe(1);

    // the opponent's move is not something the user can "play"
    expect(playMove(longPuzzle, r1.state, { from: "e7", to: "e5" }).kind).toBe("wrong");

    const r2 = playMove(longPuzzle, r1.state, { from: "g1", to: "f3" });
    expect(r2.kind).toBe("solved");
    expect(r2.state.solved).toBe(true);
    // nothing more can be played once solved
    expect(playMove(longPuzzle, r2.state, { from: "b1", to: "c3" }).kind).toBe("wrong");
  });

  it("a wrong move at step two does not advance", () => {
    const r1 = playMove(longPuzzle, startState(longPuzzle), { from: "e2", to: "e4" });
    if (r1.kind !== "correct") throw new Error("expected correct");
    const bad = playMove(longPuzzle, r1.state, { from: "d2", to: "d4" });
    expect(bad.kind).toBe("wrong");
    expect(bad.state.step).toBe(2);
  });
});

describe("helpers", () => {
  it("hint is the from-square of the next solver move", () => {
    expect(hintSquare(longPuzzle, startState(longPuzzle))).toBe("e2");
  });
  it("counts solver moves", () => {
    expect(solverMoves(longPuzzle)).toBe(2);
    expect(solverMoves(matePuzzle)).toBe(1);
  });
  it("prompts name the side and the goal", () => {
    expect(prompt(longPuzzle)).toBe("White to play and win a piece");
    expect(prompt(matePuzzle)).toBe("White to play and mate in 1");
    expect(prompt({ ...blackPuzzle, label: "Win the queen" })).toBe("Black to play and win the queen");
    expect(prompt({ ...blackPuzzle, label: "Win material" })).toBe("Black to play and win material");
  });
  it("writes the solution with move numbers", () => {
    expect(solutionText(longPuzzle)).toBe("1. e4 e5 2. Nf3");
    expect(solutionText({ ...blackPuzzle, fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2" })).toBe("2... Nf6");
  });
});
