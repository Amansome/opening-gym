import spriteUrl from "cm-chessboard/assets/pieces/standard.svg?url";
import { lineNodes } from "../../lib/courses";
import type { Course } from "../../lib/types";

const FILES = 8;
const TILE = 40; // sprite tile size

interface Props {
  fen: string;
  orientation?: "white" | "black";
  label?: string;
  className?: string;
  /** UCI of the move just played ("e2e4"): both squares get a highlighter wash. */
  lastMove?: string;
  /** Print file letters and rank numbers in the margin. */
  coords?: boolean;
}

const MARGIN = 14; // margin for coordinates, in sprite units
const EDGE = 3;

function squareXY(sq: string, flip: boolean): { x: number; y: number } | undefined {
  const f = sq.charCodeAt(0) - 97;
  const r = Number(sq[1]);
  if (!(f >= 0 && f < 8 && r >= 1 && r <= 8)) return undefined;
  return { x: (flip ? 7 - f : f) * TILE, y: (flip ? r - 1 : 8 - r) * TILE };
}

/** Static SVG board from a FEN, drawn with cm-chessboard's piece sprite. */
export function MiniBoard({ fen, orientation = "white", label, className, lastMove, coords }: Props) {
  const rows = fen.split(" ")[0].split("/");
  const flip = orientation === "black";
  const dark: string[] = [];
  const pieces: { key: string; x: number; y: number; id: string }[] = [];
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (const ch of rows[r] ?? "") {
      if (/\d/.test(ch)) {
        f += Number(ch);
        continue;
      }
      const color = ch === ch.toUpperCase() ? "w" : "b";
      const col = flip ? 7 - f : f;
      const row = flip ? 7 - r : r;
      pieces.push({ key: `${r}${f}`, x: col * TILE, y: row * TILE, id: `${color}${ch.toLowerCase()}` });
      f++;
    }
  }
  for (let r = 0; r < FILES; r++) {
    for (let c = 0; c < FILES; c++) {
      if ((r + c) % 2 === 1) dark.push(`M${c * TILE} ${r * TILE}h${TILE}v${TILE}h${-TILE}z`);
    }
  }
  const washes = lastMove && lastMove.length >= 4 ? [lastMove.slice(0, 2), lastMove.slice(2, 4)].map((sq) => squareXY(sq, flip)) : [];
  const size = FILES * TILE;
  const viewBox = coords ? `${-MARGIN} ${-EDGE} ${size + MARGIN + EDGE} ${size + MARGIN + EDGE}` : `0 0 ${size} ${size}`;
  const files = flip ? "hgfedcba" : "abcdefgh";
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={label ?? "Chess position"} shapeRendering="geometricPrecision">
      <rect width={size} height={size} fill="var(--board-light)" />
      <path d={dark.join("")} fill="var(--board-dark)" />
      {washes.map((w, i) =>
        w ? <rect key={`w${i}`} x={w.x} y={w.y} width={TILE} height={TILE} fill="var(--court-yellow)" fillOpacity={0.62} /> : null,
      )}
      {pieces.map((p) => (
        <use key={p.key} href={`${spriteUrl}#${p.id}`} transform={`translate(${p.x} ${p.y})`} />
      ))}
      {coords ? (
        <g fill="var(--board-coord)" fontSize="10" fontWeight="600" style={{ fontFamily: "var(--font-display)" }} aria-hidden="true">
          {[...files].map((ch, i) => (
            <text key={ch} x={i * TILE + TILE / 2} y={size + 10.5} textAnchor="middle">{ch}</text>
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <text key={i} x={-7} y={i * TILE + TILE / 2 + 3.5} textAnchor="middle">{flip ? i + 1 : 8 - i}</text>
          ))}
        </g>
      ) : null}
    </svg>
  );
}

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The position that characterises a course: a few plies into its first main line. */
export function thumbnailFen(course: Course): string {
  const line = course.lines.find((l) => l.kind === "main") ?? course.lines[0];
  if (!line) return START_FEN;
  try {
    const nodes = lineNodes(course, line);
    const plies = Math.min(nodes.length, course.side === "black" ? 6 : 5);
    return nodes[plies - 1]?.fen ?? START_FEN;
  } catch {
    return START_FEN;
  }
}

export function CourseBoard({ course, className }: { course: Course; className?: string }) {
  return (
    <MiniBoard
      fen={thumbnailFen(course)}
      orientation={course.side === "black" ? "black" : "white"}
      label={`${course.title}: characteristic position`}
      className={className}
    />
  );
}
