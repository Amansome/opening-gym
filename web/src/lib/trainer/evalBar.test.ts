import { describe, expect, it } from "vitest";
import { START_EVAL_CP, describeEval, evalShare, formatEval, isMateEval, mateMoves } from "./evalBar";

describe("eval bar helpers", () => {
  it("formats centipawns as pawns with a sign", () => {
    expect(formatEval(40)).toBe("+0.4");
    expect(formatEval(-130)).toBe("-1.3");
    expect(formatEval(0)).toBe("0.0");
    expect(formatEval(2)).toBe("0.0");
    expect(formatEval(START_EVAL_CP)).toBe("+0.2");
  });

  it("formats mate scores", () => {
    expect(formatEval(100000 - 5)).toBe("M3");
    expect(formatEval(-(100000 - 4))).toBe("-M2");
    expect(isMateEval(99995)).toBe(true);
    expect(isMateEval(900)).toBe(false);
    expect(mateMoves(100000 - 1)).toBe(1);
  });

  it("maps evals to a White share between 0 and 1, symmetric around 0.5", () => {
    expect(evalShare(0)).toBeCloseTo(0.5, 5);
    expect(evalShare(300) + evalShare(-300)).toBeCloseTo(1, 5);
    expect(evalShare(100)).toBeGreaterThan(0.5);
    expect(evalShare(1000)).toBeGreaterThan(evalShare(300));
    expect(evalShare(99995)).toBe(1);
    expect(evalShare(-99995)).toBe(0);
  });

  it("describes the position in words", () => {
    expect(describeEval(10)).toBe("Equal position");
    expect(describeEval(60)).toBe("White is slightly better");
    expect(describeEval(-150)).toBe("Black is better");
    expect(describeEval(-500)).toBe("Black is winning");
    expect(describeEval(99997)).toBe("White is winning, mate in 2");
  });
});
