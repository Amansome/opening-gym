// Engine audit: analyses every unique position of every course with Stockfish and writes
//   data/evals.json     cache keyed by EPD (re-runs only analyse new positions)
//   ENGINE-AUDIT.md     report of "suspect" trained moves
//
//   node scripts/engine-audit.js [--depth 14] [--multipv 5] [--fine-cp 50] [--suspect-cp 80]
//                                [--limit N] [--no-report] [--report-only] [--force]
//
// Run `node scripts/validate.js` first (it writes dist/courses.json), and again afterwards: validate.js merges
// data/evals.json into the course tree (node.eval, and node.fine on trained moves).
//
// evals.json shape:  { version, positions: { "<EPD>": { d: depth, e: evalWhiteCp, m: [[san, uci, whiteCp], ...] } } }
//   e  eval of that position, centipawns from White's view; mate scores are +-(100000 - plies to mate).
//   m  the engine's MultiPV lines (best first); whiteCp is White's view. Only positions before a trained move
//      get 5 lines; the others get 1.
const fs = require("fs");
const path = require("path");
const { Chess } = require("chess.js");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const flag = (name, def) => { const i = args.indexOf("--" + name); return i < 0 ? def : (typeof def === "boolean" ? true : Number(args[i + 1])); };
const DEPTH = flag("depth", 14);
const MULTIPV = flag("multipv", 5);
const FINE_CP = flag("fine-cp", 50);
const SUSPECT_CP = flag("suspect-cp", 80);
const LIMIT = flag("limit", Infinity);
const FORCE = flag("force", false);
const REPORT_ONLY = flag("report-only", false);
const NO_REPORT = flag("no-report", false);

const evalsPath = path.join(root, "data", "evals.json");
const epd = (fen) => fen.split(" ").slice(0, 4).join(" ");
const START_FEN = new Chess().fen();
const MATE = 100000;

const courses = JSON.parse(fs.readFileSync(path.join(root, "dist", "courses.json"), "utf8"));

// ---- collect positions and the trained moves ----------------------------------------------------------------
const positions = new Map(); // epd -> { fen, needMpv }
const trainedMoves = [];     // { course, node, beforeFen, beforeKey }
function addPos(fen, mpv) {
  const k = epd(fen);
  const p = positions.get(k);
  if (!p) positions.set(k, { fen, needMpv: mpv });
  else p.needMpv = Math.max(p.needMpv, mpv);
}
addPos(START_FEN, 1);
for (const course of courses) {
  const walk = (nodes, parentFen) => {
    for (const n of nodes) {
      if (n.trained) { addPos(parentFen, MULTIPV); trainedMoves.push({ course, node: n, beforeFen: parentFen }); }
      addPos(n.fen, 1);
      walk(n.children, n.fen);
    }
  };
  walk(course.tree, START_FEN);
}

let cache = { version: 1, positions: {} };
try { cache = JSON.parse(fs.readFileSync(evalsPath, "utf8")); } catch (e) { /* none yet */ }
if (!cache.positions) cache.positions = {};
const save = () => {
  const tmp = evalsPath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(cache));
  fs.renameSync(tmp, evalsPath);
};

// ---- engine --------------------------------------------------------------------------------------------------
function startEngine() {
  let pending = null;
  const engine = require("stockfish")("lite-single", (line) => { if (pending) pending(String(line)); });
  const send = (c) => engine.processCommand(c);
  const wait = (test) => new Promise((resolve) => { pending = (l) => { if (test(l)) { pending = null; resolve(); } }; });
  const analyse = (fen, multipv, depth) => new Promise((resolve) => {
    const best = {}; // multipv index -> { depth, score, move }
    pending = (l) => {
      if (l.startsWith("bestmove")) { pending = null; resolve(best); return; }
      if (!l.startsWith("info") || / (lowerbound|upperbound) /.test(l)) return;
      const mp = /\bmultipv (\d+)/.exec(l), sc = /\bscore (cp|mate) (-?\d+)/.exec(l), d = /\bdepth (\d+)/.exec(l), pv = /\bpv (\S+)/.exec(l);
      if (!sc || !d || !pv) return;
      const k = mp ? Number(mp[1]) : 1;
      best[k] = { depth: Number(d[1]), kind: sc[1], val: Number(sc[2]), move: pv[1] };
    };
    send(`setoption name MultiPV value ${multipv}`);
    send(`position fen ${fen}`);
    send(`go depth ${depth}`);
  });
  return (async () => {
    const ready = wait((l) => l === "uciok"); send("uci"); await ready;
    send("setoption name Hash value 64");
    const r = wait((l) => l === "readyok"); send("isready"); await r;
    return { analyse, quit: () => engine.terminate && engine.terminate() };
  })();
}

// score from side-to-move's view -> white-view centipawns
function whiteCp(kind, val, turn) {
  const stm = kind === "cp" ? val : (val > 0 ? MATE - (2 * val - 1) : -(MATE - 2 * -val));
  return turn === "w" ? stm : -stm;
}

function terminalEval(chess) {
  if (chess.isCheckmate()) return chess.turn() === "w" ? -MATE : MATE; // side to move is mated
  if (chess.isGameOver()) return 0;
  return null;
}

async function analyseAll() {
  const todo = [];
  for (const [key, p] of positions) {
    const c = cache.positions[key];
    const ok = c && c.d >= DEPTH && c.mp >= p.needMpv;
    if (FORCE || !ok) todo.push([key, p]);
  }
  console.log(`${courses.length} courses, ${positions.size} unique positions, ${trainedMoves.length} trained nodes; ${todo.length} to analyse at depth ${DEPTH}`);
  if (!todo.length) return;
  const eng = await startEngine();
  const t0 = Date.now();
  let done = 0;
  for (const [key, p] of todo) {
    if (done >= LIMIT) break;
    const chess = new Chess(p.fen);
    const term = terminalEval(chess);
    if (term !== null) cache.positions[key] = { d: DEPTH, mp: p.needMpv, e: term, m: [] };
    else {
      const res = await eng.analyse(p.fen, p.needMpv, DEPTH);
      const lines = Object.keys(res).map(Number).sort((a, b) => a - b).map((k) => {
        const r = res[k];
        let san;
        try { san = chess.move({ from: r.move.slice(0, 2), to: r.move.slice(2, 4), promotion: r.move[4] }).san; chess.undo(); } catch (e) { san = r.move; }
        return [san, r.move, whiteCp(r.kind, r.val, chess.turn())];
      });
      cache.positions[key] = { d: DEPTH, mp: p.needMpv, e: lines[0][2], m: lines };
    }
    done++;
    if (done % 100 === 0) {
      save();
      const el = (Date.now() - t0) / 1000;
      console.log(`  ${done}/${todo.length}  ${el.toFixed(0)}s elapsed, ~${((todo.length - done) * el / done).toFixed(0)}s left (saved)`);
    }
  }
  save();
  eng.quit();
  console.log(`analysed ${done} positions in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// ---- report --------------------------------------------------------------------------------------------------
const pawns = (cp) => (Math.abs(cp) >= MATE - 1000 ? `${cp > 0 ? "" : "-"}M${Math.ceil((MATE - Math.abs(cp)) / 2)}` : (cp >= 0 ? "+" : "") + (cp / 100).toFixed(2));
const label = (n) => `${Math.ceil(n.ply / 2)}${n.ply % 2 ? "." : "..."}${n.san}`;

// The lines (of this course) that pass through `node` and in which the user is the one playing it.
// Warning lines are deliberate mistakes ("trap to avoid"), so they never count. In "both" courses (trap collections)
// the user plays the side that makes the final move of each line.
function userLinesThrough(course, node) {
  const nodeWhite = node.ply % 2 === 1;
  return course.lines.filter((l) => {
    if (l.kind === "warning" || l.sans.length < node.ply) return false;
    if (l.sans.slice(0, node.ply).join(" ") !== node.id) return false;
    const userWhite = course.side === "both" ? l.plies % 2 === 1 : course.side === "white";
    return userWhite === nodeWhite;
  });
}

let skippedIntentional = 0;
function suspects() {
  const out = [];
  skippedIntentional = 0;
  const seen = new Set();
  for (const t of trainedMoves) {
    const key = t.course.id + "|" + t.node.id;
    if (seen.has(key)) continue;
    seen.add(key);
    const before = cache.positions[epd(t.beforeFen)], after = cache.positions[epd(t.node.fen)];
    if (!before || !after || !before.m.length) continue;
    const sign = t.node.ply % 2 ? 1 : -1; // +1 when White made the move
    const bestSan = before.m[0][0], bestScore = before.m[0][2] * sign;
    const inList = before.m.find((m) => m[0] === t.node.san);
    const courseScore = (inList ? inList[2] : after.e) * sign;
    const loss = bestScore - courseScore;
    if (!(loss > SUSPECT_CP && t.node.san !== bestSan)) continue;
    const lines = userLinesThrough(t.course, t.node);
    if (!lines.length) { skippedIntentional++; continue; }
    out.push({ ...t, bestSan, bestScore: bestScore * sign, courseScore: courseScore * sign, loss, sign, lines });
  }
  return out;
}

// Hand-written review notes (key "courseId|move id") and data fixes, kept here so re-running the audit keeps them.
const REVIEW_NOTES = {
  "london-system|d4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4 Qc2 Bf5 Qc1":
    "Reviewed at depth 20: 7.Qc1 is about -0.3 (safe, near equal), so the note's \"equal\" holds. 7.Qxf5! Qxb2 8.Qxd5 is stronger (about +1.5) but sharp. Left as is: a playable teaching choice.",
};
const FIXES = [];

// "Expected" when the course's own text already says the opening is dubious / risky (gambits, traps, counterattacks).
function acknowledged(course) {
  const a = course.article || {};
  const text = [course.summary, a.againstIt, ...(a.cons || [])].join(" ");
  return /unsound|dubious|objectively|keeps an edge|keep the pawn|stands a little better|risky|wild gambit|pawn down/i.test(text);
}

function writeReport() {
  const sus = suspects();
  // one row per (course, node); find the lines & notes of each
  const rows = sus;
  const byCourse = new Map();
  for (const r of rows) { if (!byCourse.has(r.course.id)) byCourse.set(r.course.id, []); byCourse.get(r.course.id).push(r); }
  const nPos = positions.size;
  const md = [];
  md.push("# Engine audit", "");
  md.push(`Generated by \`node scripts/engine-audit.js\` (Stockfish 19 lite, depth ${DEPTH}, MultiPV ${MULTIPV}).`, "");
  md.push(`- ${courses.length} courses, ${nPos} unique positions analysed, ${trainedMoves.length} trained moves checked.`);
  md.push(`- A trained move is **suspect** when it scores more than ${SUSPECT_CP} cp worse than the engine's best move (mover's view). Only the trained side's moves are audited.`);
  md.push(`- \`fine\` moves: other moves within ${FINE_CP} cp of the best move are stored in data/evals.json and marked \`fine\` in the app (not counted as mistakes).`);
  md.push(`- Depth ${DEPTH} with the lite network can misjudge sharp lines (gambits, mating attacks): treat entries as leads to review, not verdicts.`);
  md.push(`- Moves that occur only in \`warning\` lines (deliberate mistakes, "trap to avoid") are not audited: ${skippedIntentional} such trained move(s) would otherwise have been flagged. In trap collections only the side that wins each line is audited.`);
  md.push(`- **${rows.length} suspect move(s)** in ${byCourse.size} course(s).`, "");
  const fixes = FIXES;
  if (!rows.length) md.push("No suspect moves.", "");
  for (const [id, list] of byCourse) {
    const c = list[0].course;
    const expected = acknowledged(c);
    md.push(`## ${c.title} (\`${id}\`, ${c.style || "no style"})`, "");
    if (expected) md.push(`_${c.style} course whose own summary / article says it is dubious or risky: flagged moves are **expected for a gambit**._`, "");
    md.push("| Move | Course eval | Best move | Loss | Verdict | Lines | Coach note |", "|---|---|---|---|---|---|---|");
    for (const r of list) {
      const note = (r.node.note || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
      md.push(`| ${label(r.node)} | ${pawns(r.courseScore)} | ${r.bestSan} (${pawns(r.bestScore)}) | ${(r.loss / 100).toFixed(2)} | ${REVIEW_NOTES[r.course.id + "|" + r.node.id] || (expected || r.lines.every((l) => /gambit|trap/i.test(l.name)) ? "Expected for a gambit (the line is a gambit / trap)" : "Review")} | ${r.lines.map((l) => l.name).join("; ") || "-"} | ${note || "-"} |`);
    }
    md.push("");
  }
  if (fixes.length) {
    md.push("## Fixes applied to data/courses.js", "");
    for (const f of fixes) md.push(`- ${f}`);
    md.push("");
  }
  fs.writeFileSync(path.join(root, "ENGINE-AUDIT.md"), md.join("\n"));
  console.log(`${rows.length} suspect move(s) in ${byCourse.size} course(s) -> ENGINE-AUDIT.md`);
  return rows;
}

(async () => {
  if (!REPORT_ONLY) await analyseAll();
  if (!NO_REPORT) writeReport();
  process.exit(0);
})();
