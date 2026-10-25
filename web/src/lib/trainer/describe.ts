// Plain-English descriptions of moves ("Play bishop to f4.", "Knight takes on d5.").
import { Chess } from "chess.js";
import type { Move, PieceSymbol } from "chess.js";

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: "pawn",
  n: "knight",
  b: "bishop",
  r: "rook",
  q: "queen",
  k: "king",
};

export function pieceName(type: PieceSymbol): string {
  return PIECE_NAMES[type];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface MoveDescription {
  /** e.g. "bishop to f4", "knight takes on d5", "castle kingside" */
  phrase: string;
  /** e.g. "Play bishop to f4." / "Knight takes on d5." / "Castle kingside." */
  instruction: string;
}

/** Whether the SAN carries a from-file/rank disambiguator (Nbd2, R1e2, Qh4xe1). */
function isDisambiguated(san: string): boolean {
  return /^[NBRQK][a-h1-8]x?[a-h][1-8]/.test(san) || /^[NBRQK][a-h][1-8]x?[a-h][1-8]/.test(san);
}

function phraseFor(move: Move, san: string): { phrase: string; quiet: boolean } {
  if (move.isKingsideCastle()) return { phrase: "castle kingside", quiet: false };
  if (move.isQueensideCastle()) return { phrase: "castle queenside", quiet: false };

  const isCapture = move.isCapture() || move.isEnPassant();
  const promo = move.promotion ? `, promoting to a ${pieceName(move.promotion)}` : "";
  let who: string;
  if (move.piece === "p") {
    who = isCapture ? `${move.from[0]}-pawn` : "pawn";
  } else {
    who = isDisambiguated(san) ? `${pieceName(move.piece)} on ${move.from}` : pieceName(move.piece);
  }
  const check = san.endsWith("#") ? ", delivering checkmate" : san.endsWith("+") ? ", giving check" : "";
  if (isCapture) {
    const ep = move.isEnPassant() ? " (en passant)" : "";
    return { phrase: `${who} takes on ${move.to}${ep}${promo}${check}`, quiet: false };
  }
  return { phrase: `${who} to ${move.to}${promo}${check}`, quiet: true };
}

/** Describe `san` as played from `fenBefore`. Falls back to the raw SAN if it cannot be parsed. */
export function describeMove(fenBefore: string, san: string): MoveDescription {
  try {
    const chess = new Chess(fenBefore);
    const move = chess.move(san);
    const { phrase, quiet } = phraseFor(move, san);
    return { phrase, instruction: quiet ? `Play ${phrase}.` : `${capitalize(phrase)}.` };
  } catch {
    return { phrase: san, instruction: `Play ${san}.` };
  }
}
