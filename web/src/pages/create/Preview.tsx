import { Button } from "../../components/ui/Button";
import { leaves } from "../../lib/custom";
import type { BuildResult, DraftTree, Path } from "../../lib/custom";
import type { LineKind } from "../../lib/types";

interface Props {
  tree: DraftTree;
  result: BuildResult;
  onName: (path: Path, name: string) => void;
  onKind: (path: Path, kind: LineKind) => void;
  onView: (path: Path) => void;
  onDelete: (path: Path) => void;
  onResolveConflicts: () => void;
}

const KIND_LABEL: Record<LineKind, string> = { main: "Main line", alternative: "Alternative", warning: "Trap to avoid" };

export function Preview({ tree, result, onName, onKind, onView, onDelete, onResolveConflicts }: Props) {
  const rows = leaves(tree);
  const info = new Map((result.course?.lines ?? []).map((l) => [l.sans.join(" "), l]));
  const conflicts = result.warnings.filter((w) => w.code === "conflict");
  const others = result.warnings.filter((w) => w.code !== "conflict");
  const moves = result.course ? countNodes(result.course.tree) : 0;

  if (rows.length === 0) {
    return <p className="muted">Nothing to preview yet. Play moves on the board or import a PGN above.</p>;
  }
  return (
    <div className="cc-preview">
      <p className="muted">
        {rows.length} {rows.length === 1 ? "line" : "lines"}
        {result.course ? ` · ${moves} different moves` : ""}. Main lines and alternatives are trained; traps to avoid are shown in Learn mode only.
      </p>

      {result.errors.length > 0 ? (
        <ul className="cc-issues" data-tone="error" role="alert">
          {result.errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      ) : null}

      {conflicts.length > 0 ? (
        <div className="cc-issues" data-tone="warn">
          <p>
            <strong>{conflicts.length === 1 ? "One line disagrees" : `${conflicts.length} lines disagree`} with an earlier main line.</strong> The trainer
            expects one answer per position.
          </p>
          <ul>
            {conflicts.map((w, i) => <li key={i}>{w.message}</li>)}
          </ul>
          <Button size="sm" onClick={onResolveConflicts}>Mark the later {conflicts.length === 1 ? "line" : "lines"} as {conflicts.length === 1 ? "an alternative" : "alternatives"}</Button>
        </div>
      ) : null}

      {others.length > 0 ? (
        <ul className="cc-issues" data-tone="warn">
          {others.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      ) : null}

      <ol className="cc-lines">
        {rows.map(({ path, node }, i) => {
          const key = path.join(" ");
          const line = info.get(key);
          const conflict = conflicts.find((w) => w.sans.join(" ") === key);
          const skipped = result.course && !line;
          return (
            <li key={key} className="cc-line" data-conflict={conflict ? "yes" : undefined} data-skipped={skipped ? "yes" : undefined}>
              <div className="cc-line-main">
                <label className="sr-only" htmlFor={`cc-ln-${i}`}>Name of line {i + 1}</label>
                <input
                  id={`cc-ln-${i}`}
                  className="cc-input"
                  value={node.name ?? ""}
                  placeholder={line?.name ?? `Line ${i + 1}`}
                  onChange={(e) => onName(path, e.target.value)}
                />
                <label className="select-wrap">
                  <span className="sr-only">Kind of line {i + 1}</span>
                  <select value={node.kind ?? "main"} onChange={(e) => onKind(path, e.target.value as LineKind)}>
                    {(Object.keys(KIND_LABEL) as LineKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
                  </select>
                </label>
              </div>
              <p className="cc-line-meta">
                <code>{shortPgn(path)}</code>
                <span>{path.length} plies</span>
                {line?.opening ? <span>{line.opening}</span> : null}
                {skipped ? <span className="cc-tag" data-tone="warn">Skipped: no move to practise</span> : null}
                {conflict ? <span className="cc-tag" data-tone="warn">Disagrees with an earlier line</span> : null}
              </p>
              <div className="cc-line-actions">
                <Button size="sm" variant="ghost" onClick={() => onView(path)}>Show on board</Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(path)} aria-label={`Delete line ${i + 1}`}>Delete</Button>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function countNodes(nodes: { children: unknown[] }[]): number {
  return nodes.reduce((n, c) => n + 1 + countNodes(c.children as { children: unknown[] }[]), 0);
}

function shortPgn(path: Path): string {
  const parts = path.map((san, i) => (i % 2 === 0 ? `${i / 2 + 1}.${san}` : san));
  const text = parts.join(" ");
  return text.length > 90 ? `${text.slice(0, 88)}…` : text;
}
