// Note audit: extracts checkable claims from the coach notes in data/courses.js and checks them with Stockfish.
//
//   node scripts/note-audit.js [--depth 18] [--workers 3] [--no-engine] [--report-only] [--limit N]
//
// - Claims come from the raw notes of data/courses.js (course / line / move label), replayed with chess.js.
//   Types: material ("wins a knight", "a pawn up", "loses the queen"), mate ("Qxh2#", "threatens ... mate", "mate in 3"),
//   evaluation ("equal", "slightly better", "winning", "fine", "about +1"), best/only move, and tactics (fork, pin, trap).
// - Positions are analysed at depth 18 (MultiPV 3 where a "best move" claim needs it) and cached by EPD in
//   data/evals-deep.json (this script never touches data/evals.json). The depth-12 score is read from the same
//   search, and a claim whose class would change between depth 12 and 18 is reported as unclear.
// - Evaluation thresholds (mover-neutral, for the side the note talks about): |eval| < 0.5 pawns is about equal,
//   0.5-1.5 is better, > 1.5 is winning. Each rule has a small "unclear" margin around its limits.
// - Writes NOTE-AUDIT.md (totals, every contradicted claim, the unclear ones, plus the hand-written REVIEW sections below).
const fs = require("fs");
const path = require("path");
const { fork } = require("child_process");
const { Chess } = require("chess.js");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const flag = (name, def) => { const i = args.indexOf("--" + name); return i < 0 ? def : (typeof def === "boolean" ? true : Number(args[i + 1])); };
const DEPTH = flag("depth", 18);
const WORKERS = flag("workers", 3);
const LIMIT = flag("limit", Infinity);
const NO_ENGINE = flag("no-engine", false);
const REPORT_ONLY = flag("report-only", false);
const MATE = 100000;
const evalsPath = path.join(root, "data", "evals-deep.json");
const epd = (fen) => fen.split(" ").slice(0, 4).join(" ");

// ====================================================================================================================
// Engine worker (a child process; one Stockfish each)
// ====================================================================================================================
function whiteCp(kind, val, turn) {
  const stm = kind === "cp" ? val : (val > 0 ? MATE - (2 * val - 1) : -(MATE - 2 * -val));
  return turn === "w" ? stm : -stm;
}
if (args.includes("--worker")) {
  let pending = null;
  const engine = require("stockfish")("lite-single", (line) => { if (pending) pending(String(line)); });
  const send = (c) => engine.processCommand(c);
  const wait = (test) => new Promise((resolve) => { pending = (l) => { if (test(l)) { pending = null; resolve(); } }; });
  const analyse = (fen, multipv, depth) => new Promise((resolve) => {
    const best = {}, d12 = {};
    pending = (l) => {
      if (l.startsWith("bestmove")) { pending = null; resolve({ best, d12 }); return; }
      if (!l.startsWith("info") || / (lowerbound|upperbound) /.test(l)) return;
      const mp = /\bmultipv (\d+)/.exec(l), sc = /\bscore (cp|mate) (-?\d+)/.exec(l), d = /\bdepth (\d+)/.exec(l), pv = /\bpv (.+)$/.exec(l);
      if (!sc || !d || !pv) return;
      const k = mp ? Number(mp[1]) : 1;
      const rec = { depth: Number(d[1]), kind: sc[1], val: Number(sc[2]), pv: pv[1].trim().split(/\s+/) };
      best[k] = rec;
      if (rec.depth === 12) d12[k] = rec;
    };
    send(`setoption name MultiPV value ${multipv}`);
    send(`position fen ${fen}`);
    send(`go depth ${depth}`);
  });
  (async () => {
    const ready = wait((l) => l === "uciok"); send("uci"); await ready;
    send("setoption name Hash value 64");
    const r = wait((l) => l === "readyok"); send("isready"); await r;
    process.send({ ready: true });
    process.on("message", async (m) => {
      if (m.quit) process.exit(0);
      const { key, fen, mpv, depth } = m;
      const chess = new Chess(fen);
      let out;
      if (chess.isCheckmate()) out = { d: depth, mp: mpv, e: chess.turn() === "w" ? -MATE : MATE, e12: chess.turn() === "w" ? -MATE : MATE, m: [], pv: [] };
      else if (chess.isGameOver()) out = { d: depth, mp: mpv, e: 0, e12: 0, m: [], pv: [] };
      else {
        const { best, d12 } = await analyse(fen, mpv, depth);
        const lines = Object.keys(best).map(Number).sort((a, b) => a - b).map((k) => {
          const r = best[k];
          let san;
          try { san = chess.move({ from: r.pv[0].slice(0, 2), to: r.pv[0].slice(2, 4), promotion: r.pv[0][4] }).san; chess.undo(); } catch (e) { san = r.pv[0]; }
          const s12 = d12[k] ? whiteCp(d12[k].kind, d12[k].val, chess.turn()) : null;
          return [san, r.pv[0], whiteCp(r.kind, r.val, chess.turn()), s12];
        });
        out = { d: depth, mp: mpv, e: lines[0][2], e12: lines[0][3], m: lines, pv: best[1].pv.slice(0, 14) };
      }
      process.send({ key, out });
    });
  })();
  return;
}

// ====================================================================================================================
// Claim extraction
// ====================================================================================================================
const courses = require(path.join(root, "data", "courses.js"));
const VALUE = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, piece: 3, exchange: 2, material: 1 };
const PIECE_VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const NUMW = { a: 1, an: 1, one: 1, two: 2, three: 3, the: 1, another: 1, whole: 1, "a whole": 1 };
const START = new Chess().fen();

function splitSentences(text) {
  return text.split(/(?<=[.!?])["')]*\s+(?=[A-Z(])(?![KQRBNO][a-hx0-9-]{0,4}[1-8][+#]?[\s.,;!?)]|O-O)/).map((s) => s.trim()).filter(Boolean);
}
function labelPly(label) {
  const m = /^(\d+)(\.\.\.|\.)/.exec(label);
  return m ? (Number(m[1]) - 1) * 2 + (m[2] === "..." ? 1 : 0) : -1; // 0-based index into the move list
}
// side named most recently before position idx in the sentence (else the first named after it, else null)
function sideAt(sentence, idx) {
  const before = [...sentence.slice(0, idx).matchAll(/\b(White|Black)\b/g)];
  if (before.length) return before[before.length - 1][1] === "White" ? "w" : "b";
  const after = /\b(White|Black)\b/.exec(sentence.slice(idx));
  return after ? (after[1] === "White" ? "w" : "b") : null;
}
const MODAL = /\b(hop(?:e|es|ing)|aims?|aiming|to win|will win|can win|could win|would|if |threat|prepares?|wants?|trying|try to|tries|idea|so that|unless|otherwise|any other|every other|other .* loses?)\b/i;
const ALT_MOVE = /(\d+\.{1,3}[A-Za-z][A-Za-z0-9+#=x-]*[?!]+)|(\b[KQRBN]?[a-h]?x?[a-h][1-8](?:=[QRBN])?[+#]?\?)|\b(Correct is|Not |Don't |instead|was better|were better|is no better|would have)/;

function extractClaims() {
  const claims = [];
  const seen = new Set();
  for (const course of courses) {
    for (const line of course.lines) {
      const toks = line.moves.replace(/\d+\.(\.\.)?/g, " ").trim().split(/\s+/);
      const fens = [START], moves = [];
      const c = new Chess();
      for (const t of toks) { const mv = c.move(t); moves.push(mv); fens.push(c.fen()); }
      for (const [label, note] of Object.entries(line.notes || {})) {
        const idx = labelPly(label);
        if (idx < 0 || idx >= moves.length) continue;
        const mover = idx % 2 === 0 ? "w" : "b";
        const base = { course: course.id, courseTitle: course.title, line: line.name, label, san: moves[idx].san, mover, note, fenBefore: fens[idx], fenAfter: fens[idx + 1], moveUci: moves[idx].from + moves[idx].to + (moves[idx].promotion || "") };
        for (const sentence of splitSentences(note)) {
          for (const claim of claimsFromSentence(sentence, base)) {
            const key = [base.course, base.label, epd(base.fenAfter), claim.type, claim.key].join("|");
            if (seen.has(key)) continue; // same note text re-used in several lines of the same course
            seen.add(key);
            claims.push({ ...base, sentence, ...claim });
          }
        }
      }
    }
  }
  return claims;
}

// A short variation quoted in a note ("8.Bxh7+! Kxh7 9.Ng5+ Kg8 10.Qxg4 wins a piece"), replayed from the position it starts in.
function parseVariation(s, base) {
  const first = /(\d+)(\.\.\.|\.)\s?[KQRBNOa-h]/.exec(s);
  if (!first) return null;
  const startPly = (Number(first[1]) - 1) * 2 + (first[2] === "..." ? 1 : 0);
  const myPly = labelPly(base.label);
  let fen;
  if (startPly === myPly) fen = base.fenBefore; else if (startPly === myPly + 1) fen = base.fenAfter; else return null;
  const SAN = /^(?:[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h]x[a-h][1-8](?:=[QRBN])?|[a-h][1-8](?:=[QRBN])?|O-O(?:-O)?)[+#]?$/;
  const words = s.slice(first.index).split(/\s+/);
  const sans = [];
  for (const w0 of words) {
    const w = w0.replace(/^\(/, "").replace(/[?!,;:.)]+$/, "");
    const mm = /^(\d+)(?:\.\.\.|\.)(.+)$/.exec(w);
    const san = mm ? mm[2] : w;
    if (!SAN.test(san)) { if (sans.length < 2 && /^(?:here|now|then|instead|next|first)$/i.test(w)) continue; break; }
    sans.push(san);
  }
  if (sans.length < 2) return null;
  const c = new Chess(fen);
  const played = [];
  let bad = null;
  for (const san of sans) { let mv = null; try { mv = c.move(san); } catch (e) { mv = null; } if (!mv) { bad = san; break; } played.push(mv.san); }
  return { startFen: fen, endFen: c.fen(), played, bad, firstMover: startPly % 2 === 0 ? "w" : "b", lastMover: (startPly + played.length - 1) % 2 === 0 ? "w" : "b", sans };
}

function claimsFromSentence(s, base) {
  const out = [];
  const lower = s.toLowerCase();
  const hasAlt = ALT_MOVE.test(s);
  const add = (type, extra) => out.push({ type, key: extra.key || type, ...extra });

  // ---- mate
  if (/#\s*$|\bmate\b|checkmate/i.test(s)) {
    const mIn = /\bmate in (\d)\b/i.exec(s);
    if (mIn) add("mate-in", { key: "mate-in", n: Number(mIn[1]), side: sideAt(s, mIn.index) || base.mover });
    else if (/\bthreat(?:en)?s?\b[^.]*\bmate\b|\bmate\b[^.]*\bthreat/i.test(s)) {
      const t = /\bthreat(?:en)?s?\b\s+(?:\.\.\.)?\s*([KQRBNO][A-Za-z0-9+#=x-]*|[a-h][1-8]|[a-h]x[a-h][1-8][^ ]*)/.exec(s);
      add("threat-mate", { key: "threat-mate", tokenMove: t ? t[1].replace(/[.,;)]+$/, "") : null });
    } else if (/(\bsmothered mate\b|\bcheckmate\b|\bmate\b)/i.test(s) && base.san.endsWith("#") && !MODAL.test(s) && !hasAlt)
      add("mate-delivered", { key: "mate-delivered" });
  }

  // ---- a quoted variation that "wins" or "loses" material
  if (hasAlt || /\d+\.{1,3}[A-Za-z]/.test(s)) {
    const v = parseVariation(s, base);
    const w = v && /\bwins?\s+(?:a\s+|the\s+|an\s+)?(?:whole\s+)?(pawn|knight|bishop|rook|queen|piece|exchange)\b/i.exec(s);
    const l = v && !w && /\bloses?\s+(?:a\s+|the\s+|an\s+)?(?:whole\s+)?(pawn|knight|bishop|rook|queen|piece|exchange|material)\b/i.exec(s);
    if (v && (w || l)) add("variation", { key: "variation " + v.sans.join(" "), v, kind: w ? "wins" : "loses", val: VALUE[(w || l)[1].toLowerCase()] || 1, what: (w || l)[0], side: w ? v.lastMover : v.firstMover });
  }

  // ---- material: "wins X", "loses X", "N up"
  if (!hasAlt) {
    const reWin = /\b(wins?|winning|won)\s+(?:(a|an|another|the|two|three|whole|a whole|the whole)\s+)?(?:(whole|clean|extra)\s+)?(pawn|knight|bishop|rook|queen|piece|exchange)s?\b(?:\s+and\s+(?:a|the)\s+(pawn|piece))?(?:\s+for\s+(?:free|nothing|a|the|two)\s*(pawn|knight|bishop|rook|piece|queen)?s?)?/gi;
    for (const m of s.matchAll(reWin)) {
      const before = s.slice(Math.max(0, m.index - 28), m.index);
      if (/(hop(?:e|es|ing)|aims?|to|will|can|could|would|and|or|not|never|aiming|try|tries|trying|if|by|must|should|then|may|might)\s*$/i.test(before)) continue;
      if (/^\s*back\b/i.test(s.slice(m.index + m[0].length)) || /\bback\b/i.test(m[0])) continue;
      const num = NUMW[(m[2] || "a").toLowerCase()] || 1;
      let val = (VALUE[m[4].toLowerCase()] || 1) * (m[2] && /two/i.test(m[2]) ? 2 : 1);
      if (m[5]) val += VALUE[m[5].toLowerCase()];
      if (/for free|for nothing/i.test(m[0])) {/* full value */}
      else if (m[6]) val -= VALUE[m[6].toLowerCase()] * (/two/i.test(m[0]) ? 2 : 1);
      else if (/\bfor\s+(a|the|two)\b/i.test(m[0])) val -= 1;
      if (val < 1) continue;
      add("wins", { key: "wins " + m[0].trim(), val, what: m[0].trim(), side: sideAt(s, m.index) || base.mover });
    }
    const reLose = /\b(loses|lose|losing)\s+(?:(a|an|the|two|whole|a whole)\s+)?(?:(whole|clean)\s+)?(pawn|knight|bishop|rook|queen|piece|exchange|material)\b/gi;
    for (const m of s.matchAll(reLose)) {
      const before = s.slice(Math.max(0, m.index - 30), m.index);
      if (MODAL.test(before) || /\b(would|will|can|could|may|might|must)\s*$/i.test(before)) continue;
      const val = VALUE[m[4].toLowerCase()] || 1;
      let side = sideAt(s, m.index);
      // "...it loses the queen": the loser is the mover when no side is named in the clause
      if (!/\b(White|Black)\b/.test(s.slice(Math.max(0, m.index - 40), m.index))) side = base.mover; else side = side;
      add("loses", { key: "loses " + m[0].trim(), val, what: m[0].trim(), side });
    }
    const wordNum = { a: 1, an: 1, one: 1, two: 2, three: 3 };
    const reUp = /\b(?:(White|Black)\s+(?:is|are|stays|remains|keeps|has|comes out|ends up)\s+)?(?:(?:now|still|clean|clearly|just|only)\s+)*(a|an|one|two|three)\s+(?:(?:clean|whole|extra)\s+)?(pawn|knight|bishop|rook|queen|piece|exchange)s?\s+(?:up|ahead)(?:\s+for\s+(a|an|one|two|three)\s+(pawn|pawns))?/gi;
    for (const m of s.matchAll(reUp)) {
      const before = s.slice(Math.max(0, m.index - 25), m.index);
      if (MODAL.test(before)) continue;
      let val = (wordNum[m[2].toLowerCase()] || 1) * (VALUE[m[3].toLowerCase()] || 1);
      if (m[4]) val -= (wordNum[m[4].toLowerCase()] || 1);
      const side = m[1] ? (m[1] === "White" ? "w" : "b") : (sideAt(s, m.index) || base.mover);
      add("up", { key: "up " + m[0].trim(), val, what: m[0].trim(), side });
    }
  }

  // ---- evaluation
  if (!hasAlt || /engine/i.test(s)) {
    const sideOf = (idx) => sideAt(s, idx) || base.mover;
    const strongRe = /\b(?:is|are|now|clearly|completely|totally)\s+(?:clearly\s+|completely\s+|totally\s+)?(?:winning|won)\b|\bdecisive\b|\bcrushing\b/i;
    let m;
    if ((m = strongRe.exec(s)) && !MODAL.test(s.slice(Math.max(0, m.index - 20), m.index)) && !/\bwhich is winning\b/i.test(s))
      add("eval-win", { key: "eval-win", side: sideOf(m.index), what: m[0] });
    const clearRe = /\b(?:clearly|much|significantly|considerably)\s+(?:the\s+)?better\b|\b(?:clear|big|large|huge|decisive|substantial|lasting|long-term)\s+(?:edge|advantage|plus|lead)\b|\bwinning attack\b/i;
    if ((m = clearRe.exec(s)) && !/\blead in development\b|\bbig lead\b/i.test(s) && !MODAL.test(s.slice(Math.max(0, m.index - 20), m.index)) && !strongRe.test(s)) {
      if (!/\bwinning\b/i.test(m[0]) && !(/(?:development|initiative)/i.test(s.slice(m.index, m.index + m[0].length + 14)) && /lead|advantage/i.test(m[0])))
        add("eval-clear", { key: "eval-clear", side: sideOf(m.index), what: m[0] });
    }
    const slightRe = /\b(?:slightly|a bit|a little|somewhat|marginally)\s+(?:the\s+)?(?:more\s+comfortable\s+|better|ahead)\b|\bslightly\s+prefers\s+(White|Black)|\b(?:small|slight|tiny|little|pleasant|comfortable|safe|risk-free|useful|modest)\s+(?:(?:and|,)\s+\w+\s+)?(?:edge|advantage|plus|initiative)\b|\bthe\s+(?:slightly\s+)?better\s+chances\b|\bslightly\s+better\b/i;
    if ((m = slightRe.exec(s)) && !MODAL.test(s.slice(Math.max(0, m.index - 20), m.index)) && !clearRe.test(s) && !strongRe.test(s)) {
      let side = m[1] ? (m[1] === "White" ? "w" : "b") : sideOf(m.index);
      add("eval-slight", { key: "eval-slight", side, what: m[0] });
    }
    const plainRe = /\b(White|Black)\s+(?:is|are|stands|stays|remains)\s+(?:simply\s+)?(?:definitely\s+)?better\b|\b(?:somewhat|a bit|much)\s+better\s+for\s+(White|Black)/i;
    if ((m = plainRe.exec(s)) && !slightRe.test(s) && !clearRe.test(s) && !strongRe.test(s)) {
      const side = (m[1] || m[2]) === "White" ? "w" : "b";
      add("eval-better", { key: "eval-better", side, what: m[0] });
    }
    const worseRe = /\b(White|Black)\s+(?:is|are|stands|looks|remains)\s+(?:a bit\s+|slightly\s+|somewhat\s+|clearly\s+)?worse\b/i;
    if ((m = worseRe.exec(s))) add("eval-worse", { key: "eval-worse", side: m[1] === "White" ? "w" : "b", what: m[0] });
    const eqRe = /\b(?:equal|equality|balanced)\b|\b(?:is|are|about|nearly|roughly|pretty)\s+level\b/i;
    if ((m = eqRe.exec(s)) && !/\bequalis|\bequaliz|material is level|level the|levels? the|balanced? (?:by|against)|keeps? the balance|restor|balance(?:d)? (?:the|of)/i.test(s) && !MODAL.test(s.slice(Math.max(0, m.index - 24), m.index)) && !/\bto equal|\bcan equal|\beasily\b/i.test(s) && !/\b(?:and|but)\b[^.]*\b(?:better|edge)/.test(s))
      add("eval-equal", { key: "eval-equal", what: m[0] });
    const fineRe = /\b(White|Black)\s+(?:is|are|stays|remains|feels)\s+(?:completely\s+|perfectly\s+|still\s+|more\s+than\s+)?(?:fine|comfortable|ok|okay|solid|safe)\b/i;
    if ((m = fineRe.exec(s)) && !slightRe.test(s)) add("eval-fine", { key: "eval-fine", side: m[1] === "White" ? "w" : "b", what: m[0] });
    const numRe = /\(?\b(?:about|around|roughly)\s+([+-]\d(?:\.\d)?)\b(?:\s+(?:by the engine|for (White|Black)))?/i;
    if ((m = numRe.exec(s))) {
      let v = Number(m[1]);
      if (m[2] === "Black" && v > 0) v = -v; // "about +1 for Black" read as Black's view
      add("eval-num", { key: "eval-num", value: v, what: m[0] });
    }
  }

  // ---- "mistake" / "blunder" / "dubious" about the move the note is attached to
  {
    const mk = /(?:^|,\s*but\s+(?:it\s+is\s+)?|\bis\s+|\balready\s+|but\s+)(?:a\s+|an\s+|the\s+)?(?:greedy\s+|common\s+|natural-looking\s+|beginner's\s+|natural\s+|tempting\s+(?:pawn\s+grab,\s+but\s+a\s+)?)?(blunder|mistake|inaccurate|inaccuracy)\b[!:.,;]?/i.exec(s);
    if (mk && !hasAlt && !/\d+\.{1,3}[KQRBNOa-h]/.test(s) && !/\b(?:avoid|common mistakes?|Black's mistake|White's mistake|opponent)\b/i.test(s.slice(Math.max(0, mk.index - 12), mk.index + 25)))
      add("mistake", { key: "mistake", level: /blunder/i.test(mk[1]) ? "blunder" : /inaccura/i.test(mk[1]) ? "inaccuracy" : "mistake" });
    const du = /\b(?:objectively\s+dubious|is\s+dubious|unsound)\b/i.exec(s);
    if (du) add("dubious", { key: "dubious", side: base.mover });
  }

  // ---- best / only move (about the move this note is attached to)
  if (!hasAlt) {
    const bestRe = /\b(?:the\s+)?(?:best|strongest|correct|accurate|most accurate|sharpest|only)\s+(?:move|reply|defen[cs]e|response|retreat|recapture|choice|continuation|way|square|try|set-?up|plan)\b|\bBlack's best\b|\bWhite's best\b|\bThis is White's best\b|\bthe only move\b|\bpractically forced\b|^Forced\b|\bforced[.;,]|\bis forced\b|\bBest\b[:.]/i;
    const m = bestRe.exec(s);
    if (m && !/\b(?:not|isn't|wasn't|never)\b/i.test(s.slice(Math.max(0, m.index - 15), m.index)) && !/\bbest (?:try|way to)\b.*\bbut\b/i.test(s) )
      add("best-move", { key: "best-move", strict: /only|forced/i.test(m[0]), loose: /\btry\b/i.test(m[0]), what: m[0] });
  }

  // ---- tactics
  if (!hasAlt) {
    const fk = /\bfork(?:s|ed|ing)?\b/i.exec(s);
    if (fk) add("fork", { key: "fork", reply: /\b(?:loses?\s+to|walks?\s+into|falls?\s+(?:in)?to|runs?\s+into|allows|permits)\b[^.]*\bfork/i.test(s), future: /threat|\bnext\b|\bwill\b|\bcan\b|to fork|forking|\bso\b|hoping|idea|prepar/i.test(s) });
    for (const m of s.matchAll(/\bpin(?:s|ned|ning)\b\s*(?:down\s+)?(?:(?:the|a|his|her|their|an)\s+)?(?:([a-h][1-8])\s+)?(pawn|knight|bishop|rook|queen|piece|d5 knight|c3 knight|f3 knight)?/gi)) {
      if (/\b(?:the|a)\s+pin\b/i.test(m[0]) || /'pinned'|\bnot (?:really |actually )?pinned|\b(?:seems?|looks?|appears?) (?:to be )?pinned/i.test(s)) continue;
      const before = s.slice(Math.max(0, m.index - 30), m.index);
      if (MODAL.test(before) || /\b(?:remove|break|breaks|breaking|unpin|unpins|avoid|avoids|stop|stops|prevent|prevents|get rid of|to)\s*(?:the|a)?\s*$/i.test(before)) continue;
      if (/\bthreat|\bto pin|\bcan pin|\bwill pin|\bnext\b|\bthen\b|\bhoping|\bhopes\b|\bidea\b|\bready\b|\bprepar|\bbefore\b|\bso that\b/i.test(s)) continue;
      const piece = m[2] ? m[2].split(" ").pop().toLowerCase() : null;
      add("pin", { key: "pin " + (m[1] || "") + (piece || ""), square: m[1] || null, piece: piece === "piece" ? null : piece });
    }
    const tr = /\btrap(?:s|ped|ping)?\s+(?:the|his|her|a)\s+(queen|rook|bishop|knight)\b|\b(?:queen|rook|bishop|knight) (?:is|gets|becomes) trapped\b/i.exec(s);
    if (tr && !/\b(?:stops?|prevents?|avoids?|stopping|preventing)\b/i.test(s) && !MODAL.test(s.slice(Math.max(0, tr.index - 20), tr.index)) && !/threat|\bcan\b|\bwould\b|\bif\b/i.test(s))
      add("trap", { key: "trap", val: VALUE[(tr[1] || "knight").toLowerCase()] || 3, side: base.mover });
  }

  // ---- "attacks / hits / eyes X" and "defends / protects / covers X" (checked on the board after the move)
  if (!hasAlt) {
    const reA = /\b(attacks?|hits|eyes|pressures?|targets?|defends?|protects?|guards?|covers?|supports?)\s+(?:the\s+)?(?:(?:enemy|black|white)\s+)?([^.;:()!?,]{1,70})/gi;
    for (const m of s.matchAll(reA)) {
      const verb = m[1].toLowerCase();
      const before = s.slice(Math.max(0, m.index - 32), m.index);
      if (/\b[KQRBN]?[a-h]?x?[a-h][1-8]\s+and\s+[KQRBN]?x?[a-h][1-8]\s*$/.test(before)) continue; // "c4 and Qb3 target b7": about two moves
      if (MODAL.test(before) || /\b(?:no longer|doesn't|does not|cannot|can't|not|never|stops?|prevents?|to|and then|next|then|or|can|will|must|should|may|might|would|could|before)\s*(?:\w+\s+)?$/i.test(before)) continue;
      let rest = m[2].split(/\s+and\s+(?:the\s+)?(?:[a-h][1-8]\s+)?(?:pawn|knight|bishop|rook|queen)s?\s+(?:is|are|can|will|has|have)\b|\s+(?:but|while|so|because|since|though|after|before|when|if|once|which|as|rather|and\s+(?:opens?|prepares?|makes?|gives?|keeps?|eyes?|hits?|attacks?|defends?|protects?|supports?|covers?|threatens?|develops?|takes?|gains?|puts?|renews?|stops?|prevents?|heads?|aims?|has|is|leaves?|forces?|will|can|builds?|clears?|frees?|unblocks?|offers?|sets?|threats?|then|so))\b/i)[0];
      if (/^(?:a|an|the)?\s*(?:centre|center|d-file|e-file|file|diagonal|initiative)\b/i.test(rest)) continue;
      const defend = /^(defend|protect|guard|cover|support)/.test(verb);
      const squares = [];
      for (const sm of rest.matchAll(/(?:\b(pawn|knight|bishop|rook|queen|king)\s+on\s+)?(?<![A-Za-z0-9-])([a-h][1-8])(?![A-Za-z0-9'’+x#=-])(?:\s+(pawn|knight|bishop|rook|queen))?/g)) {
        const tail = rest.slice(sm.index + sm[0].length, sm.index + sm[0].length + 12);
        if (/^'s/.test(tail) || /^\s+defender/i.test(tail)) continue;
        squares.push({ sq: sm[2], piece: (sm[1] || sm[3] || "").toLowerCase() || null });
      }
      for (const q of squares) {
        let side = /\b(White|Black)\b/.test(s.slice(Math.max(0, m.index - 40), m.index)) ? sideAt(s, m.index) : base.mover;
        const subj = /(?:\b([a-h][1-8])\s+(?:pawn|knight|bishop|rook|queen)|\b(?:pawn|knight|bishop|rook|queen)\s+on\s+([a-h][1-8]))\s*$/.exec(before);
        if (subj) { try { const pc = new Chess(base.fenAfter).get(subj[1] || subj[2]); if (pc) side = pc.color; } catch (e) { /* keep */ } }
        add(defend ? "defends" : "attacks", { key: `${verb} ${q.sq}`, sq: q.sq, piece: q.piece, side, verb, what: `${m[1]} ${q.piece ? q.piece + " on " : ""}${q.sq}` });
      }
      if (!squares.length && !defend) {
        const pm = /^(?:(?:the|a|his|her|their)\s+)?(queen|rook|bishop|knight)\b(?!\s+(?:on|a second|twice))/i.exec(rest);
        if (pm && /attack/.test(verb)) add("attacks-piece", { key: "attacks " + pm[1], piece: pm[1].toLowerCase(), side: base.mover, what: m[1] + " " + pm[1] });
      }
    }
  }

  // ---- structure: open files, named diagonals, "cannot castle"
  if (!hasAlt) {
    for (const m of s.matchAll(/\b(opens?|takes?|uses?|seizes?|grabs?|occupies)\s+the\s+(?:now\s+)?(?:open\s+)?([a-h])-file\b/gi)) {
      if (/\b(?:half-open|prepares?|threat|plans?|to open)\b/i.test(s.slice(Math.max(0, m.index - 14), m.index + m[0].length))) continue;
      if (/^(opens?)$/i.test(m[1]) || /open/i.test(m[0])) add("open-file", { key: "open-file " + m[2], file: m[2].toLowerCase() });
    }
    for (const m of s.matchAll(/\b(?:on|along|keeps?\s+the\s+bishop\s+on|stays?\s+on|eyes|controls?)\s+the\s+(?:long\s+)?(?:([a-h][1-8])-([a-h][1-8])\s+)diagonal\b/gi)) {
      if (/\bprepar|threat|\bwill\b|\bto\b\s*$/i.test(s.slice(Math.max(0, m.index - 24), m.index))) continue;
      add("diagonal", { key: "diagonal " + m[1] + m[2], a: m[1], b: m[2] });
    }
    const cc = /\b(White|Black)'s king (?:cannot|can't|can no longer) castle|\b(White|Black) (?:cannot|can't|can no longer) castle/i.exec(s);
    if (cc) add("cannot-castle", { key: "cannot-castle", side: (cc[1] || cc[2]) === "White" ? "w" : "b" });
  }

  // ---- threats ("threatens Qxh2 mate" handled above); plain "threatens X"
  {
    const reT = /\bthreatens?\s+(?:to\s+)?(?:\.\.\.)?\s*((?:[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|O-O(?:-O)?|[a-h]x[a-h][1-8]|[a-h][1-8])(?:=[QRBN])?[+#]?)/g;
    for (const m of s.matchAll(reT)) {
      if (/\bmate\b/i.test(s)) continue;
      add("threat", { key: "threat " + m[1], token: m[1].replace(/[.,;)]+$/, "") });
    }
  }
  return out;
}

// ====================================================================================================================
// Board helpers
// ====================================================================================================================
function material(fen) {
  const c = new Chess(fen);
  let w = 0, b = 0;
  for (const row of c.board()) for (const p of row) if (p && p.type !== "k") { if (p.color === "w") w += PIECE_VAL[p.type]; else b += PIECE_VAL[p.type]; }
  return { w, b };
}
const matFor = (fen, side) => { const m = material(fen); return side === "w" ? m.w - m.b : m.b - m.w; };
// follows the engine PV (8 plies, then on while the last move was a capture, up to 12) and returns the final FEN
function followPv(fen, pv, plies = 8) {
  const c = new Chess(fen);
  let n = 0, last = null;
  for (const u of pv) {
    if (n >= plies && !(last && last.captured && n < 12)) break;
    try { last = c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }); } catch (e) { break; }
    n++;
  }
  return c.fen();
}
function nullFen(fen) {
  const p = fen.split(" ");
  p[1] = p[1] === "w" ? "b" : "w"; p[3] = "-";
  return p.join(" ");
}
function nullPosition(fen) { // the same position with the other side to move; null when that is not a legal position
  try {
    const f = nullFen(fen);
    const c = new Chess(f);
    const kingSq = (col) => { for (const row of c.board()) for (const p of row) if (p && p.type === "k" && p.color === col) return p.square; };
    const stm = c.turn(), opp = stm === "w" ? "b" : "w";
    if (c.isAttacked(kingSq(opp), stm)) return null; // the side that just moved is giving check: no null move
    return f;
  } catch (e) { return null; }
}
function squaresOf(c, color) {
  const out = [];
  for (const row of c.board()) for (const p of row) if (p && p.color === color) out.push(p);
  return out;
}
function forks(fen, from, color) { // enemy targets attacked by the piece on `from` (a king in check counts as a target)
  const c = new Chess(fen), enemy = color === "w" ? "b" : "w";
  const me = c.get(from);
  if (!me) return [];
  const targets = [];
  let kingDone = false;
  if (c.turn() === enemy && c.isCheck()) { kingDone = true; targets.push("k(check)"); }
  for (const t of squaresOf(c, enemy)) {
    if (!c.attackers(t.square, color).includes(from)) continue;
    const worth = PIECE_VAL[t.type] > PIECE_VAL[me.type] || t.type === "k" || c.attackers(t.square, enemy).length === 0;
    if (worth && t.type !== "p" && !(kingDone && t.type === "k")) targets.push(t.type + "@" + t.square);
  }
  return targets;
}
function pinned(fen, color) { // pieces of `color` pinned (absolute or to a more valuable piece)
  const c0 = new Chess(fen), opp = color === "w" ? "b" : "w";
  const out = [];
  const attackersOf = (c, sq) => c.attackers(sq, opp);
  const before = new Map(squaresOf(c0, color).map((p) => [p.square, attackersOf(c0, p.square)]));
  for (const p of squaresOf(c0, color)) {
    if (p.type === "k") continue;
    const c = new Chess(fen);
    c.remove(p.square);
    for (const q of squaresOf(c, color)) {
      if (q.square === p.square) continue;
      const fresh = attackersOf(c, q.square).filter((a) => !before.get(q.square).includes(a));
      if (fresh.length && (q.type === "k" || PIECE_VAL[q.type] > PIECE_VAL[p.type])) { out.push({ type: p.type, square: p.square, to: q.type }); break; }
    }
  }
  return out;
}

// ====================================================================================================================
// What each claim needs from the engine, and how it is judged
// ====================================================================================================================
const NAMES = { pawn: "p", knight: "n", bishop: "b", rook: "r", queen: "q" };
function needsOf(cl) {
  const need = [];
  const add = (fen, mpv = 1) => need.push({ fen, mpv });
  switch (cl.type) {
    case "mate-delivered": break;
    case "mate-in": case "eval-win": case "eval-clear": case "eval-slight": case "eval-better": case "eval-worse": case "eval-equal": case "eval-fine": case "eval-num":
    case "wins": case "loses": case "up": case "trap": add(cl.fenAfter); break;
    case "threat-mate": case "threat": { const n = nullPosition(cl.fenAfter); if (n) add(n, 3); break; }
    case "best-move": add(cl.fenBefore, 3); break;
    case "mistake": add(cl.fenBefore, 1); add(cl.fenAfter); break;
    case "dubious": add(cl.fenAfter); break;
    case "fork": add(cl.fenAfter); { const n = nullPosition(cl.fenAfter); if (n) add(n, 1); } break;
    case "pin": break;
    case "attacks": case "defends": case "attacks-piece": case "open-file": case "diagonal": case "cannot-castle": break;
    case "variation": if (!cl.v.bad) add(cl.v.endFen); break;
  }
  if (cl.type === "mate-in") add(cl.fenAfter);
  return need;
}

const CLASSES = ["confirmed", "contradicted", "unclear"];
function judge(cl, get) {
  const R = (cls, why) => ({ cls, why });
  const ev = (rec, side, which = "e") => (rec[which] === null || rec[which] === undefined ? null : (side === "w" ? rec[which] : -rec[which]) / 100);
  const fmt = (x) => (Math.abs(x) >= 900 ? (x > 0 ? "mate for them" : "mated") : (x >= 0 ? "+" : "") + x.toFixed(2));
  const after = get(cl.fenAfter);
  const side = cl.side || cl.mover;
  const sname = side === "w" ? "White" : "Black";
  const band = (x, soft) => x; // helper kept simple
  // classify a value against [lo, hi] with a soft margin; returns "in", "near" or "out"
  const place = (x, lo, hi, m) => (x >= lo && x <= hi ? "in" : (x >= lo - m && x <= hi + m ? "near" : "out"));
  const both = (fnCls) => { // class at depth 18 and at depth 12 must agree
    const a = fnCls(ev(after, side, "e")), b = after.e12 == null ? a : fnCls(ev(after, side, "e12"));
    return { a, b };
  };
  const evalClaim = (lo, hi, margin, label) => {
    const x18 = ev(after, side), x12 = after.e12 == null ? x18 : ev(after, side, "e12");
    const p18 = place(x18, lo, hi, margin), p12 = place(x12, lo, hi, margin);
    const desc = `engine (d18) gives ${sname} ${fmt(x18)} (d12: ${fmt(x12)}); "${label}" needs ${lo === -Infinity ? "" : fmt(lo)} to ${hi === Infinity ? "" : fmt(hi)}`;
    if (p18 === "in" && p12 !== "out") return R("confirmed", desc);
    if (p18 === "out" && p12 === "out") return R("contradicted", desc);
    if (p18 === "out" && p12 !== "out") return R("unclear", "depth 12 and 18 disagree: " + desc);
    return R("unclear", (p18 === "near" ? "borderline: " : "depth 12 and 18 disagree: ") + desc);
  };
  switch (cl.type) {
    case "mate-delivered": {
      const c = new Chess(cl.fenAfter);
      return c.isCheckmate() ? R("confirmed", "the move is checkmate") : R("contradicted", "the move is not checkmate");
    }
    case "mate-in": {
      const rec = after, x = ev(rec, side);
      const plies = Math.abs(x) >= 900 ? Math.round((MATE - Math.abs(rec.e)) ) : null;
      if (x >= 900 && plies !== null && Math.ceil(plies / 2) <= cl.n + 0) return R("confirmed", `engine finds mate in ${Math.ceil(plies / 2)} for ${sname}`);
      return R("contradicted", `engine eval ${fmt(x)} for ${sname}, no mate in ${cl.n} found at depth ${DEPTH}`);
    }
    case "threat-mate": {
      const nf = nullPosition(cl.fenAfter);
      if (!nf) return R("unclear", "side that just moved gives check: no null-move test");
      const rec = get(nf), x = ev(rec, cl.mover);
      if (x >= 900) return R("confirmed", `passing the move, the mover would have mate (${rec.m[0][0]})`);
      return R("contradicted", `no mate threat found: with the move passed the engine gives ${fmt(x)} for the mover (best ${rec.m[0][0]})`);
    }
    case "threat": {
      const nf = nullPosition(cl.fenAfter);
      if (!nf) return R("unclear", "side that just moved gives check: no null-move test");
      const c = new Chess(nf);
      if (/^[a-h][1-8]$/.test(cl.token)) {
        const att = c.attackers(cl.token, cl.mover).length > 0;
        return att ? R("confirmed", `${cl.token} is attacked by the mover`) : R("contradicted", `${cl.token} is not attacked by the mover`);
      }
      let mv = null;
      try { mv = c.move(cl.token); } catch (e) { mv = null; }
      if (!mv) return R("contradicted", `${cl.token} is not a legal move for the mover in this position`);
      const rec = get(nf);
      const idx = rec.m.findIndex((m) => m[0] === mv.san);
      if (idx >= 0) return R("confirmed", `${mv.san} is the engine's #${idx + 1} choice if the move were passed`);
      return R("unclear", `${mv.san} is legal but not in the engine's top 3 if the move were passed (best ${rec.m[0][0]})`);
    }
    case "best-move": {
      const rec = get(cl.fenBefore);
      const sign = cl.mover === "w" ? 1 : -1;
      const top = rec.m[0][2] * sign / 100;
      const mine = rec.m.find((m) => m[1] === cl.moveUci);
      const second = rec.m[1] ? rec.m[1][2] * sign / 100 : null;
      const lines = rec.m.map((m) => `${m[0]} ${fmt(m[2] * sign / 100)}`).join(", ");
      if (mine) {
        const loss = top - mine[2] * sign / 100;
        const rank = rec.m.indexOf(mine) + 1;
        if (cl.strict) {
          if (rank === 1 && (second === null || top - second >= 0.6)) return R("confirmed", `top engine move and alternatives are clearly worse (${lines})`);
          if (rank === 1) return R("unclear", `top engine move, but other moves are close (${lines})`);
          return loss <= 0.3 ? R("unclear", `near the top but not unique (${lines})`) : R("contradicted", `not the engine's first choice (${lines})`);
        }
        if (loss <= 0.3) return R("confirmed", `engine top 3: ${lines}`);
        if (loss <= 0.8) return R("unclear", `${loss.toFixed(2)} behind the top move (${lines})`);
        return R("contradicted", `${loss.toFixed(2)} behind the top move (${lines})`);
      }
      const x = ev(get(cl.fenAfter) || {}, cl.mover);
      return R(cl.loose ? "unclear" : "contradicted", `not in the engine's top 3 (${lines})`);
    }
    case "eval-equal": {
      const x18 = Math.abs(after.e) / 100, x12 = after.e12 == null ? x18 : Math.abs(after.e12) / 100;
      const cls = (x) => (x < 0.5 ? "in" : x < 0.65 ? "near" : "out");
      const desc = `engine (d18) gives ${fmt(after.e / 100)} for White (d12: ${after.e12 == null ? "n/a" : fmt(after.e12 / 100)}); "equal" needs |eval| < 0.5`;
      if (cls(x18) === "in" && cls(x12) !== "out") return R("confirmed", desc);
      if (cls(x18) === "out" && cls(x12) === "out") return R("contradicted", desc);
      return R("unclear", (cls(x18) === "near" ? "borderline: " : "depth 12 and 18 disagree: ") + desc);
    }
    case "eval-slight": return evalClaim(0.1, 1.5, 0.2, "slightly better");
    case "eval-better": return evalClaim(0.4, 2.0, 0.2, "better");
    case "eval-clear": return evalClaim(0.8, Infinity, 0.25, "clearly better");
    case "eval-win": return evalClaim(1.5, Infinity, 0.4, "winning");
    case "eval-fine": return evalClaim(-0.5, Infinity, 0.5, "fine");
    case "eval-worse": return evalClaim(-Infinity, -0.2, 0.2, "worse");
    case "eval-num": {
      const x = after.e / 100;
      const d = Math.abs(x - cl.value);
      const desc = `note says about ${cl.value >= 0 ? "+" : ""}${cl.value} (White's view); engine (d18) gives ${fmt(x)}`;
      if (Math.abs(cl.value) >= 900) return R("unclear", desc);
      if (d <= 0.6) return R("confirmed", desc);
      if (d <= 1.0) return R("unclear", desc);
      return R("contradicted", desc);
    }
    case "wins": case "trap": case "loses": case "up": {
      const pv = after.pv || [];
      const end = followPv(cl.fenAfter, pv);
      const x = ev(after, side);
      if (cl.type === "up") {
        const bal = matFor(end, side);
        const desc = `after the engine's line (${pv.slice(0, 8).join(" ")}) ${sname} is ${bal >= 0 ? "+" : ""}${bal} in material; engine ${fmt(x)}`;
        if (bal >= cl.val - 0.5 || (cl.val >= 3 && bal >= cl.val - 1.5 && x >= 1)) return R("confirmed", desc);
        if (bal <= 0 && x < 0.3) return R("contradicted", desc);
        return R("unclear", desc);
      }
      const gainOf = (s) => matFor(end, s) - matFor(cl.fenBefore, s);
      if (cl.type === "loses") {
        const loss = -gainOf(side);
        const desc = `${sname} nets ${gainOf(side) >= 0 ? "+" : ""}${gainOf(side)} material over the engine's line (${pv.slice(0, 8).join(" ")}); engine ${fmt(x)} for ${sname}`;
        if (loss >= cl.val - (cl.val >= 9 ? 3 : 1)) return R("confirmed", desc);
        if (loss <= 0 && x > -0.3) return R("contradicted", desc);
        return R("unclear", desc);
      }
      const gain = gainOf(side);
      const desc = `${sname} nets ${gain >= 0 ? "+" : ""}${gain} material over the engine's line (${pv.slice(0, 8).join(" ")}); engine ${fmt(x)} for ${sname}; note expects +${cl.val}`;
      if (gain >= cl.val - (cl.val >= 9 ? 3 : 1)) return R("confirmed", desc);
      if (cl.type === "trap") return x >= 1.5 ? R("confirmed", desc) : R("unclear", desc);
      if (x >= 1 || gain >= 1) return R("unclear", desc);
      return R("contradicted", desc);
    }
    case "attacks": case "defends": {
      const c = new Chess(cl.fenAfter);
      const me = cl.side, opp = me === "w" ? "b" : "w";
      const there = c.get(cl.sq);
      const T = { pawn: "p", knight: "n", bishop: "b", rook: "r", queen: "q", king: "k" };
      if (cl.piece && (!there || there.type !== T[cl.piece])) return R("contradicted", `there is no ${cl.piece} on ${cl.sq} after the move (${there ? there.color + there.type : "empty"})`);
      if (cl.type === "attacks" && cl.piece && there && there.color === me) return R("contradicted", `the ${cl.piece} on ${cl.sq} is the ${me === "w" ? "White" : "Black"} side's own piece`);
      if (cl.type === "defends" && cl.piece && there && there.color !== me) return R("contradicted", `the ${cl.piece} on ${cl.sq} is an enemy piece`);
      const att = c.attackers(cl.sq, me);
      if (!att.length) return R("contradicted", `${cl.sq} is not ${cl.type === "attacks" ? "attacked" : "defended"} by ${me === "w" ? "White" : "Black"} after the move`);
      const mvTo = cl.moveUci.slice(2, 4);
      const castled = /^O-O/.test(cl.san);
      const byMoved = att.includes(mvTo) || (castled && att.length);
      if (me === cl.mover && !byMoved) return R("unclear", `${cl.sq} is ${cl.type === "attacks" ? "attacked" : "defended"} (by ${att.join(", ")}) but not by the piece that just moved`);
      return R("confirmed", `${cl.sq} is ${cl.type === "attacks" ? "attacked" : "defended"} by ${att.join(", ")}`);
    }
    case "open-file": {
      const c = new Chess(cl.fenAfter);
      const own = [], other = [];
      for (const row of c.board()) for (const p of row) if (p && p.type === "p" && p.square[0] === cl.file) (p.color === cl.mover ? own : other).push(p.color + p.square);
      if (own.length) return R("contradicted", `the mover still has a pawn on the ${cl.file}-file: ${own.join(", ")}`);
      if (other.length) return R("unclear", `only half-open: the opponent still has a pawn on the ${cl.file}-file (${other.join(", ")})`);
      return R("confirmed", `no pawns on the ${cl.file}-file`);
    }
    case "diagonal": {
      const f = (sq) => [sq.charCodeAt(0) - 97, Number(sq[1])];
      const [ax, ay] = f(cl.a), [bx, by] = f(cl.b);
      const [tx, ty] = f(cl.moveUci.slice(2, 4));
      const onLine = Math.abs(ax - bx) === Math.abs(ay - by) && Math.abs(tx - ax) === Math.abs(ty - ay) && (tx - ax) * (bx - ax) * (ty - ay) * (by - ay) >= 0 && Math.sign(tx - ax) * Math.sign(ty - ay) === Math.sign(bx - ax) * Math.sign(by - ay);
      const sameDiag = Math.abs(ax - bx) === Math.abs(ay - by) && (tx - ax) * (by - ay) === (ty - ay) * (bx - ax);
      return sameDiag ? R("confirmed", `${cl.moveUci.slice(2, 4)} lies on the ${cl.a}-${cl.b} diagonal`) : R("contradicted", `the piece now on ${cl.moveUci.slice(2, 4)} is not on the ${cl.a}-${cl.b} diagonal`);
    }
    case "cannot-castle": {
      const rights = cl.fenAfter.split(" ")[2];
      const mine = cl.side === "w" ? /[KQ]/.test(rights) : /[kq]/.test(rights);
      if (!mine) return R("confirmed", "no castling rights left");
      const nf = nullFen(cl.fenAfter);
      let ok = false;
      try { const c = new Chess(cl.fenAfter.split(" ")[1] === cl.side ? cl.fenAfter : nf); ok = c.moves().some((m) => /^O-O/.test(m)); } catch (e) { ok = false; }
      return ok ? R("contradicted", "castling is still legal") : R("unclear", "castling rights remain but castling is not possible right now");
    }
    case "attacks-piece": {
      const c = new Chess(cl.fenAfter), me = cl.mover, opp = me === "w" ? "b" : "w";
      const T = { queen: "q", rook: "r", bishop: "b", knight: "n" };
      const to = cl.moveUci.slice(2, 4);
      const hit = squaresOf(c, opp).filter((p) => p.type === T[cl.piece] && c.attackers(p.square, me).includes(to));
      if (hit.length) return R("confirmed", `the piece on ${to} attacks ${hit.map((p) => p.type + "@" + p.square).join(", ")}`);
      const other = squaresOf(c, opp).filter((p) => p.type === T[cl.piece] && c.attackers(p.square, me).length);
      return other.length ? R("unclear", `${cl.piece} is attacked by another piece, not the one that moved`) : R("contradicted", `no enemy ${cl.piece} is attacked after the move`);
    }
    case "variation": {
      if (cl.v.bad) return R("contradicted", `the quoted line is not legal: "${cl.v.bad}" cannot be played after ${cl.v.played.join(" ")}`);
      const rec = get(cl.v.endFen);
      const end = followPv(cl.v.endFen, rec.pv || []);
      const s2 = cl.side, nm = s2 === "w" ? "White" : "Black";
      const gain = matFor(end, s2) - matFor(cl.v.startFen, s2);
      const x = ev(rec, s2);
      const desc = `line ${cl.v.played.join(" ")}: ${nm} nets ${gain >= 0 ? "+" : ""}${gain} material (with the engine's continuation ${(rec.pv || []).slice(0, 8).join(" ")}); engine ${fmt(x)} for ${nm} at the end`;
      if (cl.kind === "wins") { if (gain >= cl.val - (cl.val >= 9 ? 3 : 1)) return R("confirmed", desc); return x >= 1.5 ? R("unclear", desc) : R("contradicted", desc); }
      const loss = -matFor(end, s2) + matFor(cl.v.startFen, s2);
      return loss >= cl.val - (cl.val >= 9 ? 3 : 1) ? R("confirmed", desc) : R(x > -1 ? "contradicted" : "unclear", desc);
    }
    case "mistake": {
      const sign = cl.mover === "w" ? 1 : -1;
      const before = get(cl.fenBefore);
      const loss = (before.e - after.e) * sign / 100;
      const lossB = before.e12 == null || after.e12 == null ? loss : (before.e12 - after.e12) * sign / 100;
      const [lo, hi] = cl.level === "blunder" ? [1.5, 0.5] : cl.level === "mistake" ? [0.7, 0.3] : [0.3, 0.15];
      const desc = `${cl.level}: the move costs ${loss.toFixed(2)} pawns (d18: ${fmt(before.e * sign / 100)} before, ${fmt(after.e * sign / 100)} after; d12 loss ${lossB.toFixed(2)})`;
      if (loss >= lo && lossB >= hi) return R("confirmed", desc);
      if (loss < hi && lossB < hi) return R("contradicted", desc);
      return R("unclear", desc);
    }
    case "dubious": return evalClaim(-Infinity, -0.3, 0.2, "dubious");
    case "fork": {
      if (cl.reply) {
        const c = new Chess(cl.fenAfter), opp = cl.mover === "w" ? "b" : "w";
        const hits = [];
        for (const m of c.moves({ verbose: true })) {
          c.move(m);
          const t = forks(c.fen(), m.to, opp);
          c.undo();
          if (t.length >= 2) hits.push(`${m.san} (${t.join(", ")})`);
        }
        const x = ev(after, opp);
        if (hits.length) return x >= 1 ? R("confirmed", `reply fork: ${hits.join("; ")}; engine ${fmt(x)} for the opponent`) : R("unclear", `fork exists (${hits.join("; ")}) but engine only gives the opponent ${fmt(x)}`);
        return R("contradicted", "no forking reply exists after this move");
      }
      const mv = new Chess(cl.fenBefore).move(cl.moveUci.length > 4 ? { from: cl.moveUci.slice(0, 2), to: cl.moveUci.slice(2, 4), promotion: cl.moveUci[4] } : { from: cl.moveUci.slice(0, 2), to: cl.moveUci.slice(2, 4) });
      const t = forks(cl.fenAfter, mv.to, cl.mover);
      if (t.length >= 2) return R("confirmed", `the piece on ${mv.to} attacks ${t.join(", ")}`);
      const nf = nullPosition(cl.fenAfter);
      if (nf) {
        const c = new Chess(nf);
        for (const tok of cl.sentence.match(/[KQRBN][a-h]?[1-8]?x?[a-h][1-8][+#]?/g) || []) {
          let m2; try { m2 = c.move(tok); } catch (e) { m2 = null; }
          if (!m2) continue;
          const t2 = forks(c.fen(), m2.to, cl.mover);
          c.undo();
          if (t2.length >= 2) return R("confirmed", `${tok} would fork ${t2.join(", ")}`);
        }
      }
      return cl.future ? R("unclear", "a fork is mentioned as a possibility; none found with the move played") : R("contradicted", `the moved piece on ${mv.to} attacks ${t.length ? t.join(", ") : "no valuable targets"}: no fork found`);
    }
    case "pin": {
      const found = [];
      for (const col of ["w", "b"]) for (const p of pinned(cl.fenAfter, col)) found.push({ ...p, col });
      const want = cl.piece ? NAMES[cl.piece] || null : null;
      const hit = found.filter((p) => (!want || p.type === want) && (!cl.square || p.square === cl.square));
      if (hit.length) return R("confirmed", `pinned: ${hit.map((p) => p.type + "@" + p.square).join(", ")}`);
      return R(found.length ? "contradicted" : "contradicted", `no ${cl.piece || "piece"}${cl.square ? " on " + cl.square : ""} is pinned (pins found: ${found.map((p) => p.type + "@" + p.square).join(", ") || "none"})`);
    }
  }
  return R("unclear", "no rule");
}

// ====================================================================================================================
// Run
// ====================================================================================================================
let cache = { version: 1, depth: DEPTH, positions: {} };
try { cache = JSON.parse(fs.readFileSync(evalsPath, "utf8")); } catch (e) { /* none yet */ }
if (!cache.positions) cache.positions = {};
const saveCache = () => { const tmp = evalsPath + ".tmp"; fs.writeFileSync(tmp, JSON.stringify(cache)); fs.renameSync(tmp, evalsPath); };

async function analyseAll(jobs) {
  const todo = jobs.slice(0, LIMIT);
  console.log(`${todo.length} positions to analyse at depth ${DEPTH} with ${WORKERS} workers`);
  if (!todo.length) return;
  const t0 = Date.now();
  let next = 0, done = 0;
  await new Promise((resolve) => {
    let alive = 0;
    for (let i = 0; i < WORKERS; i++) {
      const w = fork(__filename, ["--worker"]);
      alive++;
      const feed = () => {
        if (next >= todo.length) { w.send({ quit: true }); return; }
        const j = todo[next++];
        w.send({ key: j.key, fen: j.fen, mpv: j.mpv, depth: DEPTH });
      };
      w.on("message", (m) => {
        if (m.ready) return feed();
        cache.positions[m.key] = m.out;
        done++;
        if (done % 20 === 0) { saveCache(); const el = (Date.now() - t0) / 1000; console.log(`  ${done}/${todo.length}  ${el.toFixed(0)}s elapsed, ~${((todo.length - done) * el / done).toFixed(0)}s left (saved)`); }
        feed();
      });
      w.on("exit", () => { if (--alive === 0) resolve(); });
    }
  });
  saveCache();
  console.log(`analysed ${done} positions in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

// hand-written sections of the report (kept here so re-running the audit keeps them)
const REVIEW = {
  baseline: { courses: "?", notes: "?", claims: "?", confirmed: "?", contradicted: "?", unclear: "?" },
  sections: () => [],
};

(async () => {
  const claims = extractClaims();
  const notes = new Set(claims.map((c) => c.course + "|" + c.label + "|" + c.note)).size;
  let totalNotes = 0;
  for (const course of courses) for (const line of course.lines) totalNotes += Object.keys(line.notes || {}).length;
  const uniqueNotes = new Set();
  for (const course of courses) for (const line of course.lines) for (const [l, n] of Object.entries(line.notes || {})) uniqueNotes.add(course.id + "|" + l + "|" + n);
  console.log(`${courses.length} courses, ${uniqueNotes.size} distinct notes, ${claims.length} claims`);

  const jobs = new Map();
  for (const cl of claims) for (const n of needsOf(cl)) {
    const key = epd(n.fen), cur = jobs.get(key);
    if (!cur || cur.mpv < n.mpv) jobs.set(key, { key, fen: n.fen, mpv: n.mpv });
  }
  const todo = [...jobs.values()].filter((j) => { const c = cache.positions[j.key]; return !(c && c.d >= DEPTH && c.mp >= j.mpv); });
  if (!NO_ENGINE && !REPORT_ONLY) await analyseAll(todo);

  const get = (fen) => cache.positions[epd(fen)];
  const results = [];
  for (const cl of claims) {
    let r;
    try {
      if (needsOf(cl).some((n) => !get(n.fen))) r = { cls: "unclear", why: "not analysed yet" };
      else r = judge(cl, get);
    } catch (e) { r = { cls: "unclear", why: "check failed: " + e.message }; }
    results.push({ ...cl, ...r });
  }
  writeReport(results, uniqueNotes.size, courses.length);
  process.exit(0);
})();

function writeReport(results, nNotes, nCourses) {
  const counts = { confirmed: 0, contradicted: 0, unclear: 0 };
  for (const r of results) counts[r.cls]++;
  const byType = {};
  for (const r of results) { byType[r.type] = byType[r.type] || { confirmed: 0, contradicted: 0, unclear: 0 }; byType[r.type][r.cls]++; }
  const esc = (t) => String(t).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const md = [];
  md.push("# Note audit", "");
  md.push(`Generated by \`node scripts/note-audit.js\` (Stockfish 19 lite, depth ${DEPTH}; MultiPV 3 for best-move and threat claims; scores cached in data/evals-deep.json).`, "");
  md.push("## Totals", "");
  md.push("| | Now (after fixes) | First run (before fixes) |", "|---|---|---|");
  md.push(`| Courses (data/courses.js) | ${nCourses} | ${REVIEW.baseline.courses} |`);
  md.push(`| Distinct coach notes scanned | ${nNotes} | ${REVIEW.baseline.notes} |`);
  md.push(`| Claims found | ${results.length} | ${REVIEW.baseline.claims} |`);
  md.push(`| Confirmed | ${counts.confirmed} | ${REVIEW.baseline.confirmed} |`);
  md.push(`| Contradicted | ${counts.contradicted} | ${REVIEW.baseline.contradicted} |`);
  md.push(`| Unclear | ${counts.unclear} | ${REVIEW.baseline.unclear} |`, "");
  md.push("By claim type (now):", "", "| Type | Confirmed | Contradicted | Unclear |", "|---|---|---|---|");
  for (const [t, v] of Object.entries(byType).sort()) md.push(`| ${t} | ${v.confirmed} | ${v.contradicted} | ${v.unclear} |`);
  md.push("");
  md.push("How claims are judged: material claims follow the engine's principal variation for 8 plies (longer while a capture is pending) and compare the material change; evaluation words use the thresholds |eval| < 0.5 equal, 0.5-1.5 better, > 1.5 winning for the side the note names (with a small unclear margin at each limit); \"best / only move\" uses MultiPV 3 on the position before the move; threats use a null move; forks, pins and mates are checked on the board with chess.js. A claim whose class changes between depth 12 and depth 18 is unclear. Hypothetical sentences (\"if...\", \"hoping to win...\") and sentences about a different move are not claims.", "");
  const label = (r) => `${Math.ceil((labelPly(r.label) + 1) / 2)}${labelPly(r.label) % 2 ? "..." : "."}${r.san}`;
  const contra = results.filter((r) => r.cls === "contradicted");
  md.push(`## Contradicted claims (${contra.length})`, "");
  if (!contra.length) md.push("None left. See \"Fixes\" below for what was changed.", "");
  else {
    md.push("| Course | Line | Move | Note text | Engine says |", "|---|---|---|---|---|");
    for (const r of contra) md.push(`| ${r.course} | ${esc(r.line)} | ${r.label} | ${esc(r.sentence)} | ${esc(r.why)} |`);
    md.push("");
  }
  md.push(...REVIEW.sections());
  const unclear = results.filter((r) => r.cls === "unclear");
  md.push(`## Unclear claims (${unclear.length})`, "");
  md.push("Sharp positions where depth 12 and 18 disagree, borderline scores, vague wording or conditions the checker cannot test. Listed briefly for a human expert.", "");
  md.push("| Course | Move | Claim | Why unclear |", "|---|---|---|---|");
  for (const r of unclear) md.push(`| ${r.course} | ${r.label} | ${esc(r.sentence.length > 110 ? r.sentence.slice(0, 107) + "..." : r.sentence)} | ${esc(r.why.length > 150 ? r.why.slice(0, 147) + "..." : r.why)} |`);
  md.push("");
  fs.writeFileSync(path.join(root, "NOTE-AUDIT.md"), md.join("\n"));
  const dumpI = args.indexOf("--dump");
  if (dumpI >= 0) fs.writeFileSync(args[dumpI + 1], JSON.stringify(results.map((r) => ({ course: r.course, line: r.line, label: r.label, type: r.type, cls: r.cls, sentence: r.sentence, why: r.why })), null, 1));
  console.log(`claims ${results.length}: confirmed ${counts.confirmed}, contradicted ${counts.contradicted}, unclear ${counts.unclear} -> NOTE-AUDIT.md`);
}
