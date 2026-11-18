// Puzzle miner: finds tactics inside our own courses with Stockfish and writes
//   data/puzzles.json        the puzzle set (also copied to web/src/data/puzzles.json, lazy-imported by the app)
//   data/puzzle-cache.json   engine cache keyed by EPD (re-runs are incremental)
//
//   node scripts/make-puzzles.js [--depth 16] [--limit N] [--branch-limit N] [--no-branches] [--no-engine]
//
// Run `node scripts/validate.js` first (it writes dist/courses.json).
//
// A position is a puzzle when the side to move has a clearly winning, forcing best move:
//   best >= +2.00 (or a short mate) for the mover AND >= 1.5 pawns better than the second-best move (MultiPV 2).
// The solution is extended while each further user move stays unique by the same margin (max 4 user moves);
// the opponent's replies are the engine's best.
//
// puzzles.json shape: { version, depth, generated, puzzles: [Puzzle] }, Puzzle:
//   id        "p-" + first 8 hex of the EPD hash (stable)
//   fen       start position (side to move is the solver)
//   turn      "white" | "black"
//   moves     UCI, alternating solver, opponent, solver ... ending on a solver move
//   san       the same moves in SAN (for display after solving)
//   kind      "mate" | "material"
//   mateIn    number (mate puzzles)
//   label     "Mate in 2" | "Win the queen" | "Win a piece" | "Win material"
//   level     1..3
//   gain      pawns won (material puzzles)
//   side      course side ("white" | "black" | "both") of the first course it appears in
//   via       (branch puzzles) the opponent's mistake that leads here, e.g. "3...Qh4"
//   mine      true when the solver is the side the course trains
//   sources   [{ courseId, lineId, lineName }]
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Chess } = require("chess.js");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const flag = (name, def) => { const i = args.indexOf("--" + name); return i < 0 ? def : (typeof def === "boolean" ? true : Number(args[i + 1])); };
const DEPTH = flag("depth", 16);
const WORKERS = 1; // the stockfish wasm module is a per-process singleton
const LIMIT = flag("limit", Infinity);
const BRANCHES = !flag("no-branches", false);
const BRANCH_LIMIT = flag("branch-limit", Infinity);
const BRANCH_N = flag("branch-n", 10);
const BRANCH_DEPTH = flag("branch-depth", 12);
const NO_ENGINE = flag("no-engine", false);

const MIN_WIN = 200;        // centipawns, best move for the mover
const MARGIN = 150;         // best vs second best
const MATE_ALT_MAX = 600;   // in a mate puzzle, a non-mating alternative may not be better than this
const CAP = 1000;           // cap used when comparing a mate to a cp score
const MAX_USER_MOVES = 4;
const MAX_MATE = 4;
const PV_KEEP = 10;

const cachePath = path.join(root, "data", "puzzle-cache.json");
const outPath = path.join(root, "data", "puzzles.json");
const webPath = path.join(root, "web", "src", "data", "puzzles.json");
const epd = (fen) => fen.split(" ").slice(0, 4).join(" ");
const courses = JSON.parse(fs.readFileSync(path.join(root, "dist", "courses.json"), "utf8"));

// ---- candidates: every position in every course tree ---------------------------------------------------------
const cand = new Map(); // epd -> { fen, sources: Map(key -> source), mine, side }
const oppTurn = new Map(); // epd -> { fen, course, sans, ply } positions where the OPPONENT of the course side is to move
function addCand(fen, course, node, nodeSans) {
  const k = epd(fen);
  let c = cand.get(k);
  if (!c) { c = { fen, sources: new Map(), courses: [] }; cand.set(k, c); }
  if (course.side !== "both" && (course.side === "white") === (node.ply % 2 === 1) && !oppTurn.has(k)) oppTurn.set(k, { fen, course, sans: nodeSans, ply: node.ply });
  // lines passing through this node
  for (const line of course.lines) {
    if (line.sans.length < nodeSans.length) continue;
    let ok = true;
    for (let i = 0; i < nodeSans.length; i++) if (line.sans[i] !== nodeSans[i]) { ok = false; break; }
    if (ok) c.sources.set(course.id + "/" + line.id, { courseId: course.id, lineId: line.id, lineName: line.name });
  }
  if (!c.courses.includes(course)) c.courses.push(course);
}
for (const course of courses) {
  const walk = (nodes, sans) => {
    for (const n of nodes) {
      const s = [...sans, n.san];
      addCand(n.fen, course, n, s);
      walk(n.children, s);
    }
  };
  walk(course.tree, []);
}

// ---- cache ---------------------------------------------------------------------------------------------------
let cache = { version: 1, positions: {} };
try { cache = JSON.parse(fs.readFileSync(cachePath, "utf8")); } catch (e) { /* none yet */ }
if (!cache.positions) cache.positions = {};
const save = () => { const tmp = cachePath + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(cache)); fs.renameSync(tmp, cachePath); };

// ---- engine --------------------------------------------------------------------------------------------------
function startEngine() {
  let pending = null;
  const engine = require("stockfish")("lite-single", (line) => { if (pending) pending(String(line)); });
  const send = (c) => engine.processCommand(c);
  const wait = (test) => new Promise((resolve) => { pending = (l) => { if (test(l)) { pending = null; resolve(); } }; });
  // returns lines (best first): { cp?, mate?, uci, pv: [uci...] } from the side to move's view
  const analyse = (fen, multipv, depth) => new Promise((resolve) => {
    const best = {};
    pending = (l) => {
      if (l.startsWith("bestmove")) { pending = null; resolve(best); return; }
      if (!l.startsWith("info") || / (lowerbound|upperbound) /.test(l)) return;
      const mp = /\bmultipv (\d+)/.exec(l), sc = /\bscore (cp|mate) (-?\d+)/.exec(l), d = /\bdepth (\d+)/.exec(l), pv = /\bpv (.+)$/.exec(l);
      if (!sc || !d || !pv) return;
      const k = mp ? Number(mp[1]) : 1;
      const moves = pv[1].trim().split(/\s+/);
      best[k] = { depth: Number(d[1]), [sc[1]]: Number(sc[2]), uci: moves[0], pv: moves.slice(0, PV_KEEP) };
    };
    send(`setoption name MultiPV value ${multipv}`);
    send(`position fen ${fen}`);
    send(`go depth ${depth}`);
  });
  return (async () => {
    const ready = wait((l) => l === "uciok"); send("uci"); await ready;
    send("setoption name Hash value 32");
    const r = wait((l) => l === "readyok"); send("isready"); await r;
    return { analyse, quit: () => engine.terminate && engine.terminate() };
  })();
}

let analysed = 0;
async function getLines(eng, fen) {
  const k = epd(fen);
  const c = cache.positions[k];
  if (c && c.d >= DEPTH) return c.l;
  if (NO_ENGINE) return null;
  const chess = new Chess(fen);
  let l;
  if (chess.isGameOver()) l = [];
  else {
    const res = await eng.analyse(fen, 2, DEPTH);
    l = Object.keys(res).map(Number).sort((a, b) => a - b).map((i) => { const { depth, ...r } = res[i]; return r; });
  }
  cache.positions[k] = { d: DEPTH, l };
  analysed++;
  return l;
}

// Opponent-to-move positions: the engine's top N replies, to find natural mistakes (replies that hand the solver a win).
async function getMulti(eng, fen, n, depth) {
  const k = epd(fen);
  cache.multi = cache.multi || {};
  const c = cache.multi[k];
  if (c && c.d >= depth && c.n >= n) return c.l;
  if (NO_ENGINE) return null;
  const res = await eng.analyse(fen, n, depth);
  const l = Object.keys(res).map(Number).sort((a, b) => a - b).map((i) => { const { depth: _d, ...r } = res[i]; return r; });
  cache.multi[k] = { d: depth, n, l };
  analysed++;
  return l;
}

const val = (r) => (r.mate !== undefined ? (r.mate > 0 ? CAP : -CAP) : Math.max(-CAP, Math.min(CAP, r.cp)));

// A move is "the" move when it wins clearly and nothing else comes close.
function unique(lines, stepIsLastMate) {
  if (!lines || !lines.length) return null;
  const a = lines[0], b = lines[1];
  const aMate = a.mate !== undefined && a.mate > 0;
  if (aMate) {
    if (a.mate > MAX_MATE) return null;
    if (!b) return { mate: a.mate };
    if (b.mate !== undefined && b.mate > 0) return a.mate === 1 ? { mate: 1 } : null; // any mate-in-1 is accepted at run time
    if (b.mate === undefined && b.cp > MATE_ALT_MAX) return null;
    return { mate: a.mate };
  }
  if (a.mate !== undefined) return null; // we are being mated
  if (a.cp < MIN_WIN) return null;
  if (b && val(a) - val(b) < MARGIN) return null;
  return { cp: a.cp };
}

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
function material(chess, color) {
  let s = 0;
  for (const row of chess.board()) for (const sq of row) if (sq) s += (sq.color === color ? 1 : -1) * VALUE[sq.type];
  return s;
}

function sanFor(fen, ucis) {
  const chess = new Chess(fen);
  const out = [];
  for (const u of ucis) { const m = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); out.push(m.san); }
  return out;
}

async function mine(eng, key, c, extra) {
  const fen = c.fen;
  const chess0 = new Chess(fen);
  if (chess0.isGameOver()) return null;
  const turn = chess0.turn();
  const lines0 = await getLines(eng, fen);
  if (!lines0) return null;
  const u0 = unique(lines0, false);
  if (!u0) return null;

  // build the solution
  const moves = [lines0[0].uci];
  let userMoves = 1;
  let mateIn = u0.mate;
  const chess = new Chess(fen);
  const play = (u) => chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  play(moves[0]);
  while (userMoves < MAX_USER_MOVES) {
    if (chess.isGameOver()) break;
    // the opponent replies with the engine's best
    const oppLines = await getLines(eng, chess.fen());
    if (!oppLines || !oppLines.length) break;
    const reply = oppLines[0].uci;
    const keep = chess.fen();
    play(reply);
    if (chess.isGameOver()) { chess.undo(); break; } // opponent cannot end the game in a solver puzzle; stay before it
    const nextLines = await getLines(eng, chess.fen());
    const un = unique(nextLines, false);
    if (!un) {
      if (mateIn !== undefined && !chess.isGameOver()) { return null; } // a mate puzzle must run to the mate
      chess.undo();
      break;
    }
    if (mateIn !== undefined && un.mate === undefined) return null;
    moves.push(reply, nextLines[0].uci);
    play(nextLines[0].uci);
    userMoves++;
  }
  const finalChess = chess;
  if (mateIn !== undefined) {
    if (!finalChess.isCheckmate()) return null; // solution truncated before the mate
    mateIn = userMoves;
    if (lines0[0].mate !== userMoves) return null; // mate distance must agree with the engine's
  }

  // label
  let kind, label, gain;
  if (mateIn !== undefined) { kind = "mate"; label = `Mate in ${mateIn}`; }
  else {
    // material at the end of the engine's line from the root (conservative: min over the last two plies)
    const pv = lines0[0].pv;
    const g = new Chess(fen);
    const base = material(g, turn);
    const diffs = [];
    for (const u of pv) { try { g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch (e) { break; } diffs.push(material(g, turn) - base); }
    const tail = diffs.slice(-2);
    gain = Math.min(...(tail.length ? tail : [0]));
    if (gain < 1) return null; // no concrete material gain to name
    kind = "material";
    label = gain >= 8 ? "Win the queen" : gain >= 3 ? "Win a piece" : "Win material";
  }

  // difficulty 1..3
  const g1 = new Chess(fen);
  const m1 = g1.move({ from: moves[0].slice(0, 2), to: moves[0].slice(2, 4), promotion: moves[0][4] });
  const obvious = !!m1.captured || m1.san.includes("+") || m1.san.includes("#");
  const level = Math.max(1, Math.min(3, 1 + (userMoves - 1) + (obvious ? 0 : 1)));

  const turnName = turn === "w" ? "white" : "black";
  const mineCourse = c.courses.find((co) => co.side === turnName || co.side === "both");
  const source = [...c.sources.values()];
  const first = c.courses[0];
  const puzzle = {
    id: "p-" + crypto.createHash("sha1").update(key).digest("hex").slice(0, 8),
    fen,
    turn: turnName,
    moves,
    san: sanFor(fen, moves),
    kind,
    ...(mateIn !== undefined ? { mateIn } : { gain }),
    label,
    level,
    side: (mineCourse || first).side,
    mine: !!mineCourse,
    sources: source,
    ...(extra || {}),
  };
  return puzzle;
}

(async () => {
  const keys = [...cand.keys()];
  console.log(`${courses.length} courses, ${keys.length} unique positions, depth ${DEPTH}, ${WORKERS} workers`);
  const t0 = Date.now();
  let idx = 0, done = 0;
  const results = new Map();
  const engines = NO_ENGINE ? [null] : await Promise.all(Array.from({ length: WORKERS }, () => startEngine()));
  let lastSave = Date.now();
  const worker = async (eng) => {
    while (idx < keys.length && idx < LIMIT) {
      const k = keys[idx++];
      let p = null;
      try { p = await mine(eng, k, cand.get(k)); } catch (e) { console.error("error at", k, e.message); }
      if (p) results.set(k, p);
      done++;
      if (done % 100 === 0 || Date.now() - lastSave > 60000) {
        save(); lastSave = Date.now();
        const el = (Date.now() - t0) / 1000;
        console.log(`  ${done}/${keys.length}  ${results.size} puzzles  ${el.toFixed(0)}s elapsed, ~${((keys.length - done) * el / Math.max(1, done)).toFixed(0)}s left`);
      }
    }
  };
  await Promise.all(engines.map(worker));
  save();

  // ---- phase 2: natural mistakes. At each position where the opponent is to move, the engine's top replies are
  // listed (MultiPV); a reply that hands the solver a win is a mistake worth punishing. The resulting position
  // (not in any course tree) becomes a candidate, mined exactly like the others and credited to the line it leaves.
  if (BRANCHES) {
    // Round-robin across courses so a branch limit spreads coverage instead of exhausting the first courses.
    const byCourse = new Map();
    for (const k of oppTurn.keys()) {
      const id = oppTurn.get(k).course.id;
      if (!byCourse.has(id)) byCourse.set(id, []);
      byCourse.get(id).push(k);
    }
    const queues = [...byCourse.values()];
    const bkeys = [];
    for (let i = 0; bkeys.length < oppTurn.size; i++) for (const q of queues) if (i < q.length) bkeys.push(q[i]);
    console.log(`phase 2: ${bkeys.length} opponent-to-move positions, top ${BRANCH_N} replies at depth ${BRANCH_DEPTH}`);
    let bi = 0, found = 0;
    const eng = engines[0];
    for (const k of bkeys) {
      if (bi++ >= BRANCH_LIMIT) break;
      const o = oppTurn.get(k);
      const lines = await getMulti(eng, o.fen, BRANCH_N, BRANCH_DEPTH);
      if (!lines) continue;
      const parent = new Chess(o.fen);
      for (const r of lines) {
        const bad = r.mate !== undefined ? r.mate < 0 : r.cp <= -MIN_WIN; // from the mover's (opponent's) view
        if (!bad) continue;
        const g = new Chess(o.fen);
        let mv;
        try { mv = g.move({ from: r.uci.slice(0, 2), to: r.uci.slice(2, 4), promotion: r.uci[4] }); } catch (e) { continue; }
        const ck = epd(g.fen());
        if (cand.has(ck) || results.has(ck)) continue;
        const srcs = new Map();
        for (const line of o.course.lines) {
          if (line.sans.length < o.sans.length) continue;
          if (o.sans.every((x, i) => line.sans[i] === x)) srcs.set(o.course.id + "/" + line.id, { courseId: o.course.id, lineId: line.id, lineName: line.name });
        }
        const no = Math.ceil((o.ply + 1) / 2);
        const via = `${no}${(o.ply + 1) % 2 ? "." : "..."}${mv.san}`;
        let p = null;
        try { p = await mine(eng, ck, { fen: g.fen(), sources: srcs, courses: [o.course] }, { via }); } catch (e) { console.error("error at", ck, e.message); }
        if (p) { results.set(ck, p); found++; }
      }
      if (bi % 100 === 0) { save(); console.log(`  phase 2: ${bi}/${bkeys.length}, ${found} branch puzzles, ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
    }
    save();
  }
  engines.forEach((e) => e && e.quit());

  const puzzles = [...results.values()].sort((a, b) => a.id.localeCompare(b.id));
  const out = { version: 1, depth: DEPTH, generated: new Date().toISOString().slice(0, 10), puzzles };
  fs.writeFileSync(outPath, JSON.stringify(out));
  fs.mkdirSync(path.dirname(webPath), { recursive: true });
  fs.writeFileSync(webPath, JSON.stringify(out));

  // tiny per-course count map for the course page link (the puzzle set itself is a lazy chunk)
  const counts = {};
  for (const p of puzzles) for (const id of new Set(p.sources.map((x) => x.courseId))) counts[id] = (counts[id] || 0) + 1;
  fs.writeFileSync(path.join(root, "web", "src", "data", "puzzle-counts.json"), JSON.stringify(counts));

  const count = (f) => { const m = {}; for (const p of puzzles) { const k = f(p); m[k] = (m[k] || 0) + 1; } return m; };
  console.log(`\nanalysed ${analysed} new positions in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  console.log(`${puzzles.length} puzzles`);
  console.log("by kind:", count((p) => p.kind));
  console.log("by label:", count((p) => p.label.replace(/\d+/, "N")));
  console.log("by level:", count((p) => p.level));
  console.log("by turn:", count((p) => p.turn));
  console.log("mine (solver is the course side):", count((p) => p.mine));
  console.log("by course (top):", Object.entries(count((p) => p.sources[0] ? p.sources[0].courseId : "none")).sort((a, b) => b[1] - a[1]).slice(0, 12));
})();
