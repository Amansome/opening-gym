// Validates data/courses.js and builds dist/courses.json (a move tree per course).
//   node scripts/validate.js
// Checks: every move is legal SAN, every note label matches a real move in its line,
// and a course never gives two different answers in the same position for the side it trains.
// Each line is also named using the Lichess chess-openings dataset (CC0) in data/*.tsv.
const fs = require("fs");
const path = require("path");
const { Chess } = require("chess.js");

const root = path.join(__dirname, "..");
const courses = require(path.join(root, "data", "courses.js"));

const epd = (chess) => chess.fen().split(" ").slice(0, 4).join(" ");
const tokens = (moves) => moves.replace(/\d+\.(\.\.)?/g, " ").trim().split(/\s+/);

// Opening names keyed by position, so transpositions are recognised.
const names = new Map();
for (const f of "abcde") {
  const rows = fs.readFileSync(path.join(root, "data", `${f}.tsv`), "utf8").trim().split("\n").slice(1);
  for (const row of rows) {
    const [eco, name, pgn] = row.split("\t");
    const c = new Chess();
    c.loadPgn(pgn);
    const key = epd(c);
    const prev = names.get(key);
    if (!prev || prev.ply > c.history().length) names.set(key, { eco, name, ply: c.history().length });
  }
}

let errors = 0;
const fail = (msg) => { errors++; console.error("ERROR " + msg); };
const out = [];

for (const course of courses) {
  const answers = new Map(); // position -> { move, line }
  const tree = { san: null, children: [] };
  const lines = [];
  const lineIds = new Set();

  for (const line of course.lines) {
    const c = new Chess();
    const labels = [];
    let node = tree, deepest = null;
    for (const san of tokens(line.moves)) {
      const before = epd(c);
      const moveNo = c.moveNumber();
      const turn = c.turn();
      let mv;
      try { mv = c.move(san, { strict: true }); } catch (e) { mv = null; }
      if (!mv) { fail(`${course.id} / "${line.name}": illegal or non-canonical move "${san}" at ${moveNo}${turn === "w" ? "." : "..."}`); break; }
      if (mv.san !== san) fail(`${course.id} / "${line.name}": "${san}" should be written "${mv.san}"`);
      const label = `${moveNo}${turn === "w" ? "." : "..."}${mv.san}`;
      labels.push(label);

      const trained = course.side === "both" || course.side[0] === turn;
      if (trained && course.side !== "both" && (line.kind || "main") === "main") {
        const seen = answers.get(before);
        if (seen && seen.move !== mv.san)
          fail(`${course.id}: two answers in the same position (${label} in "${line.name}" vs ${seen.move} in "${seen.line}")`);
        else if (!seen) answers.set(before, { move: mv.san, line: line.name });
      }

      let child = node.children.find((n) => n.san === mv.san);
      if (!child) {
        child = { id: (node.id ? node.id + " " : "") + mv.san, ply: c.history().length, san: mv.san, uci: mv.from + mv.to + (mv.promotion || ""), fen: c.fen(), trained, children: [] };
        const n = names.get(epd(c));
        if (n) child.opening = `${n.eco} ${n.name}`;
        node.children.push(child);
      }
      const note = line.notes && line.notes[label];
      if (note) child.note = note;
      node = child;
      const n = names.get(epd(c));
      if (n) deepest = n;
    }
    for (const key of Object.keys(line.notes || {}))
      if (!labels.includes(key)) fail(`${course.id} / "${line.name}": note "${key}" doesn't match any move in the line`);
    let id = line.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (lineIds.has(id)) fail(`${course.id}: duplicate line id "${id}"`);
    lineIds.add(id);
    lines.push({ id, sans: labels.map((l) => l.replace(/^\d+\.(\.\.)?/, "")), name: line.name, kind: line.kind || "main", pgn: labels.join(" "), plies: labels.length, opening: deepest && `${deepest.eco} ${deepest.name}`, mate: c.isCheckmate() });
  }

  out.push({ ...course, lines, tree: tree.children });
  console.log(`\n${course.title} [${course.side}, ${course.lines.length} lines]`);
  for (const l of lines) console.log(`  ${l.mate ? "#" : " "} ${String(l.plies).padStart(2)} plies  ${(l.name + (l.kind === "main" ? "" : ` [${l.kind}]`)).padEnd(52)} → ${l.opening || "(unnamed)"}`);
}

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist", "courses.json"), JSON.stringify(out, null, 1));
const webData = path.join(root, "web", "src", "data");
if (fs.existsSync(path.join(root, "web"))) {
  fs.mkdirSync(webData, { recursive: true });
  fs.writeFileSync(path.join(webData, "courses.json"), JSON.stringify(out));
}
const total = out.reduce((s, c) => s + c.lines.length, 0);
console.log(`\n${out.length} courses, ${total} lines, ${errors} error(s). Wrote dist/courses.json`);
process.exit(errors ? 1 : 0);
