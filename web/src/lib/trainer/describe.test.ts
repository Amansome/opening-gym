import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { describeMove } from "./describe";
import { START_FEN } from "./session";

function after(...sans: string[]) {
  const c = new Chess();
  sans.forEach((s) => c.move(s));
  return c.fen();
}

describe("describeMove", () => {
  it("quiet moves", () => {
    expect(describeMove(START_FEN, "d4").instruction).toBe("Play pawn to d4.");
    expect(describeMove(after("d4", "d5"), "Bf4").instruction).toBe("Play bishop to f4.");
    expect(describeMove(START_FEN, "Nf3").phrase).toBe("knight to f3");
  });
  it("captures", () => {
    const fen = after("e4", "d5");
    expect(describeMove(fen, "exd5").instruction).toBe("E-pawn takes on d5.");
    const f2 = after("e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5", "d5", "exd5", "Nxd5");
    expect(describeMove(f2, "Nxf7").instruction).toBe("Knight takes on f7.");
  });
  it("castling", () => {
    const fen = after("e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5");
    expect(describeMove(fen, "O-O").instruction).toBe("Castle kingside.");
    const fen2 = after("d4", "d5", "Nc3", "Nf6", "Bf4", "e6", "Qd2", "Be7");
    expect(describeMove(fen2, "O-O-O").instruction).toBe("Castle queenside.");
  });
  it("disambiguation, check and mate suffixes", () => {
    expect(describeMove(after("d4", "d5", "Nf3", "Nf6"), "Nbd2").instruction).toBe("Play knight on b1 to d2.");
    expect(describeMove(after("e4", "e5", "Bc4", "Nc6", "Qh5", "Nf6"), "Qxf7#").instruction).toBe(
      "Queen takes on f7, delivering checkmate.",
    );
    expect(describeMove(after("e4", "e5", "Nf3", "Nc6"), "Bb5").phrase).toBe("bishop to b5");
    expect(describeMove(after("e4", "d5"), "Bb5+").instruction).toBe("Play bishop to b5, giving check.");
  });
  it("promotion", () => {
    const fen = "8/P7/8/8/8/8/k6K/8 w - - 0 1";
    expect(describeMove(fen, "a8=Q").instruction).toBe("Play pawn to a8, promoting to a queen.");
  });
  it("falls back for unparsable input", () => {
    expect(describeMove(START_FEN, "Zz9").instruction).toBe("Play Zz9.");
  });
});
