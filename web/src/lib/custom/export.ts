// Course -> PGN. The default is one game holding the whole move tree (variations in parentheses, notes as
// comments); `mode: "lines"` writes one game per line instead, keeping line names and kinds in headers.
import type { Course, MoveNode } from "../types";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const comment = (s: string) => `{ ${s.replace(/\s+/g, " ").replace(/[{}]/g, (c) => (c === "{" ? "(" : ")")).trim()} }`;

function pgnDate(ts?: number): string {
  if (!ts) return "????.??.??";
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}`;
}

function headers(pairs: [string, string][]): string {
  return pairs.map(([k, v]) => `[${k} "${esc(v)}"]`).join("\n");
}

/** Greedy word wrap at 80 columns (comments may wrap too: PGN allows newlines inside them). */
function wrap(tokens: string[]): string {
  const lines: string[] = [];
  let cur = "";
  for (const t of tokens.join(" ").split(/ +/)) {
    if (cur && cur.length + 1 + t.length > 80) {
      lines.push(cur);
      cur = t;
    } else cur = cur ? `${cur} ${t}` : t;
  }
  if (cur) lines.push(cur);
  return lines.join("\n");
}

function moveToken(n: MoveNode, forceNumber: boolean): string {
  const num = Math.ceil(n.ply / 2);
  if (n.ply % 2 === 1) return `${num}.${n.san}`;
  return forceNumber ? `${num}...${n.san}` : n.san;
}

/** Tokens for a sibling group: the first node is the main continuation, the others become variations. */
function sequence(siblings: MoveNode[], forceNumber: boolean): string[] {
  const [main, ...alts] = siblings;
  if (!main) return [];
  const out: string[] = [moveToken(main, forceNumber)];
  if (main.note) out.push(comment(main.note));
  for (const alt of alts) {
    const inner = sequence([alt], true);
    out.push(`(${inner[0]}`, ...inner.slice(1));
    out[out.length - 1] += ")";
  }
  out.push(...sequence(main.children, Boolean(main.note) || alts.length > 0));
  return out;
}

export interface ExportOptions {
  mode?: "tree" | "lines";
}

export function courseToPgn(course: Course, opts: ExportOptions = {}): string {
  const date = pgnDate(course.createdAt);
  const orientation = course.side === "black" ? "Black" : "White";
  if (opts.mode === "lines") {
    const byPath = new Map<string, MoveNode>();
    const index = (nodes: MoveNode[]) => nodes.forEach((n) => (byPath.set(n.id, n), index(n.children)));
    index(course.tree);
    return (
      course.lines
        .map((line) => {
          const toks: string[] = [];
          let id = "";
          let force = false;
          line.sans.forEach((san, i) => {
            id = id ? `${id} ${san}` : san;
            const node = byPath.get(id);
            const ply = i + 1;
            toks.push(ply % 2 === 1 ? `${Math.ceil(ply / 2)}.${san}` : force ? `${Math.ceil(ply / 2)}...${san}` : san);
            force = false;
            if (node?.note) {
              toks.push(comment(node.note));
              force = true;
            }
          });
          toks.push("*");
          const h: [string, string][] = [
            ["Event", line.name],
            ["Site", "Opening Gym"],
            ["Date", date],
            ["Round", "-"],
            ["White", "?"],
            ["Black", "?"],
            ["Result", "*"],
            ["ChapterName", line.name],
            ["Orientation", orientation],
            ["LineKind", line.kind],
          ];
          if (line.opening) h.push(["Opening", line.opening.replace(/^[A-E]\d\d\s+/, "")]);
          return `${headers(h)}\n\n${wrap(toks)}\n`;
        })
        .join("\n") || ""
    );
  }
  const toks = sequence(course.tree, false);
  toks.push("*");
  const h: [string, string][] = [
    ["Event", course.title],
    ["Site", "Opening Gym"],
    ["Date", date],
    ["Round", "-"],
    ["White", "?"],
    ["Black", "?"],
    ["Result", "*"],
    ["ChapterName", course.title],
    ["Orientation", orientation],
  ];
  return `${headers(h)}\n\n${wrap(toks)}\n`;
}

/** A safe file name such as "my-italian.pgn". */
export function pgnFileName(course: Course): string {
  const base = course.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "course"}.pgn`;
}
