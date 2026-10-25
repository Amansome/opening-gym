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
}

/** Static SVG board from a FEN, drawn with cm-chessboard's piece sprite. */
export function MiniBoard({ fen, orientation = "white", label, className }: Props) {
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
  return (
    <svg
      viewBox={`0 0 ${FILES * TILE} ${FILES * TILE}`}
      className={className}
      role="img"
      aria-label={label ?? "Chess position"}
      shapeRendering="geometricPrecision"
    >
      <rect width={FILES * TILE} height={FILES * TILE} fill="var(--board-light)" />
      <path d={dark.join("")} fill="var(--board-dark)" />
      {pieces.map((p) => (
        <use key={p.key} href={`${spriteUrl}#${p.id}`} transform={`translate(${p.x} ${p.y})`} />
      ))}
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
