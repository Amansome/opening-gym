import { useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import { Board } from "../../components/board";
import type { BoardMove } from "../../components/board";
import { Button } from "../../components/ui/Button";
import { addMove, deleteNode, fenAt, getNode, setNote } from "../../lib/custom";
import type { DraftNode, DraftTree, Path } from "../../lib/custom";
import { ToolIcon } from "../tool-icons";

interface Props {
  tree: DraftTree;
  path: Path;
  side: "white" | "black";
  onPath: (p: Path) => void;
  onTree: (t: DraftTree) => void;
}

const samePath = (a: Path, b: Path) => a.length === b.length && a.every((s, i) => s === b[i]);

function moveText(ply: number, san: string, withNumber: boolean): string {
  const n = Math.ceil(ply / 2);
  if (ply % 2 === 1) return `${n}.${san}`;
  return withNumber ? `${n}...${san}` : san;
}

interface ListCtx {
  path: Path;
  onPath: (p: Path) => void;
}

function Chain({ siblings, prefix, ply, forceNumber, lead = false, ctx }: { siblings: DraftNode[]; prefix: Path; ply: number; forceNumber: boolean; lead?: boolean; ctx: ListCtx }) {
  const [main, ...alts] = siblings;
  if (!main) return null;
  const here = [...prefix, main.san];
  const isLeaf = main.children.length === 0;
  const selected = samePath(ctx.path, here);
  return (
    <>
      {lead ? " " : null}
      <button
        type="button"
        className="cc-mv"
        data-selected={selected || undefined}
        data-kind={isLeaf ? (main.kind ?? "main") : undefined}
        data-note={main.note ? "yes" : undefined}
        aria-current={selected ? "true" : undefined}
        title={main.note ? `Note: ${main.note}` : undefined}
        onClick={() => ctx.onPath(here)}
      >
        {moveText(ply, main.san, forceNumber)}
        {main.note ? <span className="cc-mv-dot" aria-label="has a note" /> : null}
      </button>
      {alts.map((a) => (
        <span className="cc-mv-var" key={a.san}>
          (<Chain siblings={[a]} prefix={prefix} ply={ply} forceNumber ctx={ctx} />)
        </span>
      ))}
      <Chain siblings={main.children} prefix={here} ply={ply + 1} forceNumber={alts.length > 0} lead ctx={ctx} />
    </>
  );
}

export function MoveEditor({ tree, path, side, onPath, onTree }: Props) {
  const fen = useMemo(() => fenAt(path) ?? fenAt([])!, [path]);
  const chess = useMemo(() => new Chess(fen), [fen]);
  const turn = chess.turn() === "w" ? "white" : "black";
  const node = getNode(tree, path);
  const lastMove = useMemo(() => {
    if (!path.length) return null;
    const c = new Chess();
    let last: { from: string; to: string } | null = null;
    for (const san of path) {
      const m = c.move(san);
      last = { from: m.from, to: m.to };
    }
    return last;
  }, [path]);
  const gameOver = chess.isGameOver();

  function onMove(m: BoardMove) {
    let san: string;
    try {
      san = new Chess(fen).move({ from: m.from, to: m.to, promotion: m.promotion }).san;
    } catch {
      return;
    }
    onTree(addMove(tree, path, san));
    onPath([...path, san]);
  }

  const back = () => path.length && onPath(path.slice(0, -1));
  const forward = () => {
    const kids = path.length ? node?.children : tree;
    if (kids?.length) onPath([...path, kids[0].san]);
  };
  const toEnd = () => {
    let p = path;
    let kids = path.length ? node?.children : tree;
    while (kids && kids.length) {
      p = [...p, kids[0].san];
      kids = getNode(tree, p)?.children;
    }
    onPath(p);
  };

  // arrow keys step through the moves (unless the user is typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        back();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        forward();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ply = path.length;
  const status = gameOver
    ? "The game is over here. Go back to add another move."
    : ply === 0
      ? "Start position. Play the first move."
      : `${moveText(ply, path[ply - 1], true)} played. ${turn === "white" ? "White" : "Black"} to move.`;
  const trained = ply > 0 && (side === "white" ? ply % 2 === 1 : ply % 2 === 0);

  return (
    <div className="cc-editor">
      <div className="cc-board">
        <Board
          fen={fen}
          orientation={side}
          movable={gameOver ? null : turn}
          lastMove={lastMove}
          onMove={onMove}
          ariaLabel="Course board: play moves for both sides"
        />
      </div>
      <div className="cc-side">
        <p className="cc-status" role="status">{status}</p>
        <div className="cc-nav" role="group" aria-label="Move navigation">
          <Button size="sm" onClick={() => onPath([])} disabled={!ply} aria-label="Go to the start"><ToolIcon name="first" /></Button>
          <Button size="sm" onClick={back} disabled={!ply} aria-label="Previous move"><ToolIcon name="prev" /></Button>
          <Button size="sm" onClick={forward} disabled={!(path.length ? node?.children.length : tree.length)} aria-label="Next move"><ToolIcon name="next" /></Button>
          <Button size="sm" onClick={toEnd} aria-label="Go to the end of this line"><ToolIcon name="last" /></Button>
        </div>

        <div className="cc-moves" aria-label="Moves of the course">
          {tree.length === 0 ? (
            <p className="muted">No moves yet. Play a move on the board, or import a PGN.</p>
          ) : (
            <div className="cc-moves-text">
              <Chain siblings={tree} prefix={[]} ply={1} forceNumber={false} ctx={{ path, onPath }} />
            </div>
          )}
        </div>
        <p className="cc-hint muted">
          To add a variation, step back and play a different move. Dotted moves have notes.
        </p>

        <div className="cc-note">
          <label htmlFor="cc-note-input" className="cc-label">
            {ply > 0 ? `Note for ${moveText(ply, path[ply - 1], true)}` : "Note for the current move"}
            {ply > 0 ? <span className="muted">{trained ? " (your move)" : " (opponent's move)"}</span> : null}
          </label>
          <textarea
            id="cc-note-input"
            className="cc-input"
            rows={3}
            disabled={!node}
            value={node?.note ?? ""}
            placeholder={node ? "Why is this move played? What does it threaten or prevent?" : "Play or select a move to add a note."}
            onChange={(e) => onTree(setNote(tree, path, e.target.value))}
          />
        </div>

        <div className="cc-actions">
          <Button
            size="sm"
            variant="danger"
            disabled={!node}
            onClick={() => {
              onTree(deleteNode(tree, path));
              onPath(path.slice(0, -1));
            }}
          >
            Delete this move and what follows
          </Button>
        </div>
      </div>
    </div>
  );
}
