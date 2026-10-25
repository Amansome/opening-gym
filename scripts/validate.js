// Validates data/courses.js and builds dist/courses.json (a move tree per course).
//   node scripts/validate.js
// Checks: every move is legal SAN, every note label matches a real move in its line,
// and a course never gives two different answers in the same position for the side it trains.
// Each course must also have a `style` (one of STYLES) and an `article` (see CourseArticle in
// web/src/lib/types.ts): field types and non-empty text are errors; every article.variations[].pgn
// must be strict, canonically written SAN that chess.js can replay ("1.e4 e5 2.Nf3 Nc6"). Counts that are
// outside the recommended ranges (pros 4-5, cons 3-4, variations 3-5, FAQ 3-5, whatIs/history 2-4
// sentences) are reported as warnings only.
// Each line is also named using the Lichess chess-openings dataset (CC0) in data/*.tsv.
const fs = require("fs");
const path = require("path");
const { Chess } = require("chess.js");

const root = path.join(__dirname, "..");
const courses = require(path.join(root, "data", "courses.js"));

const epd = (chess) => chess.fen().split(" ").slice(0, 4).join(" ");
const tokens = (moves) => moves.replace(/\d+\.(\.\.)?/g, " ").trim().split(/\s+/);

const STYLES = ["Classical", "Gambit", "Attack", "Trap-heavy", "Solid", "System", "Counterattack"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const SIDES = ["white", "black", "both"];
const nonEmpty = (v) => typeof v === "string" && v.trim().length > 0;
const sentences = (t) => (t.match(/[.!?]["')]*(?=\s+[A-Z0-9]|$)/g) || []).length;
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;

// Replays a "1.e4 e5 2.Nf3 Nc6" string with strict SAN. Returns an error message, or null if it is fine.
function checkPgn(pgn) {
  if (!nonEmpty(pgn)) return "is empty";
  const c = new Chess();
  const sans = [];
  for (const san of tokens(pgn)) {
    let mv;
    try { mv = c.move(san, { strict: true }); } catch (e) { mv = null; }
    if (!mv) return `illegal or non-canonical move "${san}" after "${sans.join(" ")}"`;
    if (mv.san !== san) return `"${san}" should be written "${mv.san}"`;
    sans.push(san);
  }
  // numbering must be canonical too: "1.e4 e5 2.Nf3"
  const canonical = sans.map((san, i) => (i % 2 === 0 ? `${i / 2 + 1}.${san}` : san)).join(" ");
  if (pgn.trim().replace(/\s+/g, " ") !== canonical) return `move numbers should read "${canonical}"`;
  return null;
}

// Checks one course's style and article. Returns a short summary string for the report.
function checkArticle(course) {
  const id = course.id;
  const bad = (msg) => fail(`${id} / article: ${msg}`);
  const warn = (msg) => { warnings++; console.warn(`WARN  ${id} / article: ${msg}`); };
  for (const [field, allowed] of [["side", SIDES], ["level", LEVELS]])
    if (!allowed.includes(course[field])) fail(`${id}: ${field} "${course[field]}" must be one of ${allowed.join(", ")}`);
  for (const field of ["id", "title", "eco", "summary"]) if (!nonEmpty(course[field])) fail(`${id}: ${field} must be non-empty text`);
  if (!Array.isArray(course.ideas) || !course.ideas.length || !course.ideas.every(nonEmpty)) fail(`${id}: ideas must be a non-empty list of text`);
  if (!STYLES.includes(course.style)) { fail(`${id}: style "${course.style}" must be one of ${STYLES.join(", ")}`); }
  const a = course.article;
  if (!a || typeof a !== "object" || Array.isArray(a)) { bad("missing (every course needs an article object)"); return { style: course.style, text: "no article" }; }

  const text = (key, optional) => {
    if (a[key] === undefined && optional) return;
    if (!nonEmpty(a[key])) bad(`${key} must be non-empty text`);
  };
  text("whatIs"); text("howToReach", true); text("againstIt", true); text("history", true);
  if (nonEmpty(a.whatIs) && (sentences(a.whatIs) < 2 || sentences(a.whatIs) > 4)) warn(`whatIs has ${sentences(a.whatIs)} sentences (aim for 2-4)`);
  if (nonEmpty(a.history) && (sentences(a.history) < 2 || sentences(a.history) > 4)) warn(`history has ${sentences(a.history)} sentences (aim for 2-4)`);

  const list = (key, lo, hi) => {
    if (!Array.isArray(a[key]) || !a[key].length || !a[key].every(nonEmpty)) { bad(`${key} must be a non-empty list of non-empty text`); return 0; }
    if (a[key].length < lo || a[key].length > hi) warn(`${key} has ${a[key].length} entries (aim for ${lo}-${hi})`);
    return a[key].length;
  };
  const nPros = list("pros", 4, 5), nCons = list("cons", 3, 4);

  if (!a.plans || !nonEmpty(a.plans.white) || !nonEmpty(a.plans.black)) bad("plans.white and plans.black must both be non-empty text");

  let nVar = 0;
  if (a.variations !== undefined) {
    if (!Array.isArray(a.variations) || !a.variations.length) bad("variations must be a non-empty list when present");
    else {
      nVar = a.variations.length;
      if (nVar < 3 || nVar > 5) warn(`variations has ${nVar} entries (aim for 3-5)`);
      a.variations.forEach((v, i) => {
        const where = `variations[${i}]${v && v.name ? ` ("${v.name}")` : ""}`;
        if (!v || !nonEmpty(v.name) || !nonEmpty(v.text)) bad(`${where} needs a non-empty name and text`);
        const err = v && checkPgn(v.pgn);
        if (err) bad(`${where}.pgn ${err}`);
      });
    }
  } else warn("no variations (aim for 3-5)");

  let nFaq = 0;
  if (!Array.isArray(a.faq) || !a.faq.length) bad("faq must be a non-empty list of { q, a }");
  else {
    nFaq = a.faq.length;
    if (nFaq < 3 || nFaq > 5) warn(`faq has ${nFaq} entries (aim for 3-5)`);
    a.faq.forEach((f, i) => {
      if (!f || !nonEmpty(f.q) || !nonEmpty(f.a)) bad(`faq[${i}] needs non-empty q and a`);
      else if (!f.q.trim().endsWith("?")) warn(`faq[${i}].q should be phrased as a question`);
    });
  }

  const all = [a.whatIs, a.howToReach, a.againstIt, a.history, a.plans && a.plans.white, a.plans && a.plans.black, ...(a.pros || []), ...(a.cons || []),
    ...(a.variations || []).flatMap((v) => (v ? [v.name, v.text] : [])), ...(a.faq || []).flatMap((f) => (f ? [f.q, f.a] : []))].filter(nonEmpty);
  const nWords = all.reduce((n, t) => n + words(t), 0);
  return { style: course.style, text: `article: ${nPros} pros, ${nCons} cons, ${nVar} variations (pgn ok), ${nFaq} FAQ, ~${nWords} words` };
}

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

// Engine evals (data/evals.json, written by scripts/engine-audit.js) keyed by EPD. Optional.
// node.eval = eval after the move (centipawns, White's view); node.fine = other moves within FINE_CP of the best
// move in the position before a trained move (the engine likes them too, the course just plays something else).
const FINE_CP = 50;
let evals = {};
try { evals = JSON.parse(fs.readFileSync(path.join(root, "data", "evals.json"), "utf8")).positions || {}; } catch (e) { /* no evals yet */ }
let evalNodes = 0, fineNodes = 0;
function attachEval(node, beforeKey, afterKey) {
  const after = evals[afterKey];
  if (after && typeof after.e === "number") { node.eval = after.e; evalNodes++; }
  const before = evals[beforeKey];
  if (node.trained && before && before.m && before.m.length) {
    const sign = node.ply % 2 ? 1 : -1; // +1 when White made the move
    const best = before.m[0][2] * sign;
    const fine = before.m.filter((m) => m[0] !== node.san && m[2] * sign >= best - FINE_CP).map((m) => m[0]);
    if (fine.length) { node.fine = fine; fineNodes++; }
  }
}

let errors = 0, warnings = 0;
const fail = (msg) => { errors++; console.error("ERROR " + msg); };
const out = [];

const courseIds = new Set();
for (const course of courses) {
  if (courseIds.has(course.id)) fail(`duplicate course id "${course.id}"`);
  courseIds.add(course.id);
  const summary = checkArticle(course);
  if (course.lines[0] && (course.lines[0].kind || "main") === "warning") fail(`${course.id}: the first line must be trainable (main or alternative), not a warning`);
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
        attachEval(child, before, epd(c));
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
  console.log(`\n${course.title} [${course.side}, ${course.lines.length} lines]  style: ${summary.style || "(none)"}  ${summary.text}`);
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
const varCount = out.reduce((s, c) => s + ((c.article && c.article.variations) || []).length, 0);
console.log(`\n${out.length} courses, ${total} lines, ${varCount} article variations, ${warnings} warning(s), ${errors} error(s). Wrote dist/courses.json` + (evalNodes ? ` (${evalNodes} evals, ${fineNodes} trained moves with fine alternatives)` : " (no data/evals.json)"));
process.exit(errors ? 1 : 0);
