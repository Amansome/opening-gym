import { Chess } from "chess.js";
import type { Move } from "chess.js";

export interface PvMove {
  san: string;
  uci: string;
  from: string;
  to: string;
  /** FEN after this move */
  fen: string;
}

/** Play a UCI move list from `fen` and return SAN + squares. Stops quietly at the first illegal move. */
export function pvToMoves(fen: string, pv: string[], limit = pv.length): PvMove[] {
  const out: PvMove[] = [];
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return out;
  }
  for (const uci of pv.slice(0, limit)) {
    let move: Move;
    try {
      move = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
    out.push({ san: move.san, uci, from: move.from, to: move.to, fen: chess.fen() });
  }
  return out;
}

/** "1.d4 d5 2.Bf4" or, when the line starts with Black, "1...d5 2.Bf4". */
export function formatPv(fen: string, moves: { san: string }[]): string {
  const parts = fen.split(" ");
  let black = parts[1] === "b";
  let n = Number(parts[5]) || 1;
  const out: string[] = [];
  moves.forEach((m, i) => {
    if (!black) out.push(`${n}.${m.san}`);
    else {
      out.push(i === 0 ? `${n}...${m.san}` : m.san);
      n += 1;
    }
    black = !black;
  });
  return out.join(" ");
}
