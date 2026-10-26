import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { courses, getCourse, lineNodes } from "../../lib/courses";
import type { Course, Line, MoveNode } from "../../lib/types";
import { Icon } from "./Icon";
import { MiniBoard } from "./MiniBoard";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const STEP_MS = 2600;
const HOLD_MS = 4200;

interface Demo { course: Course; line: Line; nodes: MoveNode[] }

/** A real line from the catalogue, cut to the first moves that carry the coach's reasons. */
export function pickDemo(): Demo | undefined {
  const course = getCourse("italian-game") ?? courses[0];
  if (!course) return undefined;
  const candidates = course.lines.filter((l) => l.kind === "main");
  let best: Demo | undefined;
  let bestNotes = -1;
  for (const line of candidates.length ? candidates : course.lines) {
    try {
      const all = lineNodes(course, line).slice(0, 12);
      const lastNote = all.reduce((acc, n, i) => (n.note ? i : acc), -1);
      const nodes = all.slice(0, Math.max(lastNote + 1, Math.min(all.length, 6)));
      const notes = nodes.filter((n) => n.note).length;
      if (notes > bestNotes) {
        best = { course, line, nodes };
        bestNotes = notes;
      }
    } catch {
      /* a line that leaves the tree is skipped */
    }
  }
  return best;
}

function moveLabel(n: MoveNode): string {
  return n.ply % 2 === 1 ? `${(n.ply + 1) / 2}. ${n.san}` : `${n.ply / 2}… ${n.san}`;
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Home page proof: plays a real course line move by move, with the coach's note under the board. */
export function LineDemo() {
  const demo = useMemo(pickDemo, []);
  const total = demo?.nodes.length ?? 0;
  const [shown, setShown] = useState(0); // plies on the board
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    if (!playing || total === 0) return;
    const t = window.setTimeout(() => setShown((s) => (s >= total ? 0 : s + 1)), shown === 0 ? 900 : shown >= total ? HOLD_MS : STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, shown, total]);

  const jump = useCallback((n: number) => {
    setPlaying(false);
    setShown(n);
  }, []);

  if (!demo) return null;
  const { course, line, nodes } = demo;
  const node = shown > 0 ? nodes[shown - 1] : undefined;
  const orientation = course.side === "black" ? "black" : "white";
  const sideName = node ? (node.ply % 2 === 1 ? "White" : "Black") : "";
  const caption = node
    ? node.note ?? (node.trained ? `You play ${node.san}.` : `${sideName} replies ${node.san}.`)
    : "Press play, or step through the moves one at a time.";

  return (
    <section className="demo" aria-label={`Live example: ${course.title}, ${line.name}`}>
      <div className="demo-head">
        <h2 className="demo-title">
          <Link to={`/opening/${course.id}`}>{course.title}</Link>
        </h2>
        <p className="demo-count" aria-live="off">
          <span className="demo-count-num">{shown}</span>
          <span className="demo-count-of"> of {total} moves</span>
        </p>
      </div>
      <MiniBoard
        fen={node?.fen ?? START_FEN}
        orientation={orientation}
        lastMove={node?.uci}
        coords
        className="demo-board"
        label={node ? `Position after ${moveLabel(node)}` : "Starting position"}
      />
      <div key={shown} className="demo-note" data-who={node ? (node.trained ? "you" : "them") : "start"}>
        <p className="demo-move">
          {node ? (
            <>
              <strong>{moveLabel(node)}</strong>
              <span className="demo-who">{node.trained ? "Your move" : "Reply"}</span>
            </>
          ) : (
            <strong>{line.name}</strong>
          )}
        </p>
        <p className="demo-text">{caption}</p>
      </div>
      <div className="demo-controls">
        <button type="button" className="demo-btn" onClick={() => jump(Math.max(0, shown - 1))} disabled={shown === 0} aria-label="Previous move">
          <Icon name="back" size={18} />
        </button>
        <button
          type="button"
          className="demo-btn demo-play"
          onClick={() => {
            if (!playing && shown >= total) setShown(0);
            setPlaying(!playing);
          }}
          aria-label={playing ? "Pause" : shown >= total ? "Replay" : "Play"}
          aria-pressed={playing}
        >
          <Icon name={playing ? "pause" : shown >= total ? "restart" : "play"} size={18} />
          <span>{playing ? "Pause" : shown >= total ? "Replay" : "Play"}</span>
        </button>
        <button type="button" className="demo-btn" onClick={() => jump(Math.min(total, shown + 1))} disabled={shown >= total} aria-label="Next move">
          <Icon name="chevron" size={18} />
        </button>
        <ol className="demo-moves" aria-label="Moves of this line">
          {nodes.map((n, i) => (
            <li key={n.id}>
              <button
                type="button"
                className="demo-chip"
                data-state={i + 1 === shown ? "now" : i < shown ? "done" : "next"}
                aria-current={i + 1 === shown ? "step" : undefined}
                onClick={() => jump(i + 1)}
              >
                {n.ply % 2 === 1 ? <span className="demo-no">{(n.ply + 1) / 2}.</span> : null}
                {n.san}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
