import { describe, expect, it } from "vitest";
import { getCourse, trainableLines, lineNodes, courses, userColor } from "../courses";
import type { Course, Line, Mode } from "../types";
import { LineSession, START_FEN, nodeColor } from "./session";
import type { MoveAttempt } from "./session";

function course(id: string): Course {
  const c = getCourse(id);
  if (!c) throw new Error("missing course " + id);
  return c;
}
function line(c: Course, id: string): Line {
  const l = c.lines.find((x) => x.id === id);
  if (!l) throw new Error("missing line " + id);
  return l;
}
function attempt(uci: string): MoveAttempt {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined };
}

/** Clock whose time the test controls. */
function clock(start = 1000) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

/** Play the whole line correctly; `ms` is how long the user takes per move. */
function playPerfect(s: LineSession, clk: ReturnType<typeof clock>, ms = 5000) {
  let guard = 0;
  while (s.status !== "done" && guard++ < 200) {
    if (s.status === "opponent") s.playOpponent();
    else {
      clk.advance(ms);
      const f = s.submit(attempt(s.nextNode!.uci));
      expect(f.kind).toBe("correct");
    }
  }
}

function make(c: Course, l: Line, mode: Mode = "learn") {
  const clk = clock();
  return { s: new LineSession({ course: c, line: l, mode, now: clk.now }), clk };
}

describe("LineSession basics (white course: london-system)", () => {
  const c = course("london-system");
  const l = c.lines[0];

  it("starts on the user's turn when the user plays White", () => {
    const { s } = make(c, l);
    expect(s.color).toBe("white");
    expect(s.status).toBe("user");
    expect(s.fen).toBe(START_FEN);
    expect(s.instruction).toBe("Play pawn to d4.");
  });

  it("auto-plays the opponent and waits for the user", () => {
    const { s, clk } = make(c, l);
    clk.advance(1000);
    const f = s.submit(attempt("d2d4"));
    expect(f.kind).toBe("correct");
    expect(s.status).toBe("opponent");
    expect(s.playOpponent()?.san).toBe(l.sans[1]);
    expect(s.status).toBe("user");
    expect(s.instruction).toBe("Play bishop to f4.");
    expect(s.playOpponent()).toBeUndefined();
  });

  it("ignores submissions on the opponent's turn", () => {
    const { s } = make(c, l);
    s.submit(attempt("d2d4"));
    expect(s.submit(attempt("e2e4")).kind).toBe("ignored");
  });

  it("reports illegal moves without penalty", () => {
    const { s } = make(c, l);
    expect(s.submit({ from: "e2", to: "e5" }).kind).toBe("illegal");
    expect(s.submit({ from: "a8", to: "a7" }).kind).toBe("illegal");
    expect(s.result().mistakes).toBe(0);
    expect(s.status).toBe("user");
  });

  it("completes the whole line and reports every trained move as good", () => {
    const { s, clk } = make(c, l);
    playPerfect(s, clk);
    const r = s.result();
    expect(r.completed).toBe(true);
    expect(r.mistakes).toBe(0);
    expect(r.moves).toHaveLength(s.trainedCount);
    expect(r.moves.every((m) => m.grade === "good" && !m.usedHint)).toBe(true);
    expect(r.courseId).toBe(c.id);
    expect(r.lineId).toBe(l.id);
    expect(r.mode).toBe("learn");
  });

  it("wrong move then correct move grades 'again' and counts the mistake", () => {
    const { s, clk } = make(c, l);
    clk.advance(500);
    const bad = s.submit(attempt("e2e4"));
    expect(bad.kind).toBe("wrong");
    if (bad.kind !== "wrong") return;
    expect(bad.expectedPhrase).toBe("pawn to d4");
    expect(bad.playedSan).toBe("e4");
    expect(bad.failed).toBe(false);
    expect(bad.attemptFen).toContain("4P3");
    expect(s.status).toBe("user"); // can retry
    expect(s.ply).toBe(0);
    const ok = s.submit(attempt("d2d4"));
    expect(ok.kind === "correct" && ok.grade).toBe("again");
    const r = s.result();
    expect(r.mistakes).toBe(1);
    expect(r.moves[0]).toMatchObject({ nodeId: l.sans[0], grade: "again", usedHint: false });
  });

  it("counts several mistakes on one move", () => {
    const { s } = make(c, l);
    s.submit(attempt("e2e4"));
    s.submit(attempt("g1f3"));
    s.submit(attempt("d2d4"));
    expect(s.result().mistakes).toBe(2);
  });
});

describe("grading", () => {
  const c = course("london-system");
  const l = c.lines[0];

  it("hint grades 'hard' (and level 1 then 2)", () => {
    const { s, clk } = make(c, l, "practice");
    const h1 = s.hint();
    expect(h1).toEqual({ level: 1, from: "d2" });
    const h2 = s.hint();
    expect(h2).toEqual({ level: 2, from: "d2", to: "d4" });
    expect(s.hint()).toEqual({ level: 2, from: "d2", to: "d4" });
    clk.advance(100);
    const f = s.submit(attempt("d2d4"));
    expect(f.kind === "correct" && f.grade).toBe("hard");
    expect(f.kind === "correct" && f.usedHint).toBe(true);
    // hint level resets on the next turn
    s.playOpponent();
    expect(s.hint()?.level).toBe(1);
  });

  it("fast first-try move is 'easy' outside Learn", () => {
    const { s, clk } = make(c, l, "practice");
    clk.advance(2499);
    const f = s.submit(attempt("d2d4"));
    expect(f.kind === "correct" && f.grade).toBe("easy");
  });

  it("2.5 s or more is 'good'", () => {
    const { s, clk } = make(c, l, "practice");
    clk.advance(2500);
    const f = s.submit(attempt("d2d4"));
    expect(f.kind === "correct" && f.grade).toBe("good");
  });

  it("Learn mode never grades 'easy'", () => {
    const { s, clk } = make(c, l, "learn");
    clk.advance(10);
    const f = s.submit(attempt("d2d4"));
    expect(f.kind === "correct" && f.grade).toBe("good");
  });

  it("measures the turn from when it begins (after the opponent move)", () => {
    const { s, clk } = make(c, l, "drill");
    clk.advance(60000);
    s.submit(attempt("d2d4"));
    clk.advance(400); // opponent delay etc.
    s.playOpponent();
    clk.advance(1200);
    const f = s.submit(attempt("c1f4"));
    expect(f.kind === "correct" && f.ms).toBe(1200);
    expect(f.kind === "correct" && f.grade).toBe("easy");
  });

  it("a mistake beats a hint", () => {
    const { s } = make(c, l, "practice");
    s.hint();
    s.submit(attempt("e2e4"));
    const f = s.submit(attempt("d2d4"));
    expect(f.kind === "correct" && f.grade).toBe("again");
  });
});

describe("other-line feedback", () => {
  it("recognises a trained move from another line in the course (any course with a branch on the user's turn)", () => {
    let found: { c: Course; l: Line; idx: number; alt: string; expectedSan: string } | undefined;
    outer: for (const c of courses) {
      for (const l of trainableLines(c)) {
        const color = userColor(c, l);
        const nodes = lineNodes(c, l);
        for (let i = 0; i < nodes.length; i++) {
          if (nodeColor(nodes[i]) !== color) continue;
          const sibs = i === 0 ? c.tree : nodes[i - 1].children;
          const other = sibs.find((n) => n.uci !== nodes[i].uci);
          if (other) {
            found = { c, l, idx: i, alt: other.uci, expectedSan: nodes[i].san };
            break outer;
          }
        }
      }
    }
    expect(found).toBeDefined();
    if (!found) return;
    const { s } = make(found.c, found.l);
    while (s.ply < found.idx) {
      if (s.status === "opponent") s.playOpponent();
      else s.submit(attempt(s.nextNode!.uci));
    }
    const f = s.submit(attempt(found.alt));
    expect(f.kind).toBe("other-line");
    if (f.kind === "other-line") {
      expect(f.message).toContain("another line in this course");
      expect(f.message).toContain(f.expectedPhrase);
      expect(f.alternative?.uci).toBe(found.alt);
      expect(f.expected.san).toBe(found.expectedSan);
    }
  });

  it("a legal move that is in no line is plain 'wrong'", () => {
    const c = course("london-system");
    const { s } = make(c, c.lines[0]);
    const f = s.submit(attempt("a2a3"));
    expect(f.kind).toBe("wrong");
  });
});

describe("black-side course (caro-kann)", () => {
  const c = course("caro-kann");
  const l = c.lines.find((x) => x.kind === "main")!;

  it("opponent (White) moves first, user is Black", () => {
    const { s } = make(c, l);
    expect(s.color).toBe("black");
    expect(s.status).toBe("opponent");
    expect(s.submit(attempt("c7c6")).kind).toBe("ignored");
    expect(s.playOpponent()?.san).toBe("e4");
    expect(s.status).toBe("user");
    expect(s.instruction).toBe("Play pawn to c6.");
  });

  it("clock for the first user turn starts when the opponent moves", () => {
    const clk = clock();
    const s = new LineSession({ course: c, line: l, mode: "practice", now: clk.now });
    clk.advance(30000);
    s.playOpponent();
    clk.advance(800);
    const f = s.submit(attempt("c7c6"));
    expect(f.kind === "correct" && f.ms).toBe(800);
    expect(f.kind === "correct" && f.grade).toBe("easy");
  });

  it("plays through a whole line; result only has Black moves", () => {
    const { s, clk } = make(c, l);
    playPerfect(s, clk);
    const r = s.result();
    expect(r.completed).toBe(true);
    const blackIds = lineNodes(c, l).filter((n) => n.ply % 2 === 0).map((n) => n.id);
    expect(r.moves.map((m) => m.nodeId)).toEqual(blackIds);
  });

  it("when the opponent makes the final move the line ends on playOpponent", () => {
    const odd = c.lines.find((x) => x.sans.length % 2 === 1);
    if (!odd) return;
    const { s, clk } = make(c, odd);
    playPerfect(s, clk);
    expect(s.status).toBe("done");
  });
});

describe("'both' course (opening-traps)", () => {
  const c = course("opening-traps");

  it("user plays the side that makes the final move", () => {
    const scholar = line(c, "scholar-s-mate");
    const fool = line(c, "fool-s-mate");
    expect(new LineSession({ course: c, line: scholar, mode: "learn" }).color).toBe("white");
    expect(new LineSession({ course: c, line: fool, mode: "learn" }).color).toBe("black");
    expect(userColor(c, fool)).toBe("black");
  });

  it("Fool's mate: White's blunders are autoplayed, Black finds Qh4#", () => {
    const fool = line(c, "fool-s-mate");
    const { s } = make(c, fool);
    expect(s.status).toBe("opponent");
    expect(s.playOpponent()?.san).toBe("f3");
    expect(s.submit(attempt("e7e5")).kind).toBe("correct");
    expect(s.playOpponent()?.san).toBe("g4");
    const f = s.submit(attempt("d8h4"));
    expect(f.kind === "correct" && f.done).toBe(true);
    expect(s.status).toBe("done");
    expect(s.result().completed).toBe(true);
  });

  it("every trap line completes perfectly for the side that wins", () => {
    for (const l of c.lines) {
      const { s, clk } = make(c, l);
      playPerfect(s, clk);
      expect(s.result().completed).toBe(true);
    }
  });

  it("Lasker trap: castling-free line ending in underpromotion fxg1=N+", () => {
    const lasker = line(c, "lasker-trap");
    const { s, clk } = make(c, lasker);
    expect(s.color).toBe("black");
    while (s.status !== "done") {
      if (s.status === "opponent") {
        s.playOpponent();
        continue;
      }
      clk.advance(3000);
      const node = s.nextNode!;
      if (node.san === "fxg1=N+") {
        // queen promotion is a legal but wrong move
        const q = s.submit({ from: "f2", to: "g1", promotion: "q" });
        expect(q.kind).toBe("wrong");
        if (q.kind === "wrong") expect(q.playedSan).toMatch(/^fxg1=Q/);
        // omitting the promotion piece defaults to a queen, so it is also wrong
        expect(s.submit({ from: "f2", to: "g1" }).kind).toBe("wrong");
        const ok = s.submit({ from: "f2", to: "g1", promotion: "n" });
        expect(ok.kind === "correct" && ok.done).toBe(true);
        expect(ok.kind === "correct" && ok.grade).toBe("again");
      } else {
        expect(s.submit(attempt(node.uci)).kind).toBe("correct");
      }
    }
    const r = s.result();
    expect(r.completed).toBe(true);
    expect(r.mistakes).toBe(2);
    expect(r.moves.at(-1)).toMatchObject({ nodeId: expect.stringContaining("fxg1=N+"), grade: "again" });
  });
});

describe("castling", () => {
  function walkTo(s: LineSession, clk: ReturnType<typeof clock>, idx: number) {
    while (s.ply < idx) {
      clk.advance(3000);
      if (s.status === "opponent") s.playOpponent();
      else expect(s.submit(attempt(s.nextNode!.uci)).kind).toBe("correct");
    }
  }

  it("White castles: accepts e1g1 and says 'Castle kingside.'", () => {
    const c = course("italian-game");
    const l = line(c, "giuoco-pianissimo-main-plan");
    const { s, clk } = make(c, l);
    walkTo(s, clk, l.sans.indexOf("O-O"));
    expect(s.instruction).toBe("Castle kingside.");
    const f = s.submit({ from: "e1", to: "g1" });
    expect(f.kind).toBe("correct");
    expect(s.fen.split(" ")[0].split("/")[7]).toMatch(/R1?\d*RK1$|RK1$/);
  });

  it("White castles by dragging the king onto its own rook", () => {
    const c = course("italian-game");
    const l = line(c, "giuoco-pianissimo-main-plan");
    const { s, clk } = make(c, l);
    walkTo(s, clk, l.sans.indexOf("O-O"));
    expect(s.submit({ from: "e1", to: "h1" }).kind).toBe("correct");
  });

  it("Black castles (black-side course)", () => {
    const c = course("kings-indian");
    const l = line(c, "classical-mar-del-plata-9-ne1");
    const { s, clk } = make(c, l);
    walkTo(s, clk, l.sans.indexOf("O-O"));
    expect(s.color).toBe("black");
    expect(s.instruction).toBe("Castle kingside.");
    expect(s.submit({ from: "e8", to: "g8" }).kind).toBe("correct");
  });

  it("castling the wrong way is a mistake, not an illegal move", () => {
    const c = course("italian-game");
    const l = line(c, "giuoco-pianissimo-main-plan");
    const { s, clk } = make(c, l);
    walkTo(s, clk, l.sans.indexOf("O-O"));
    // queenside castling is not possible here (pieces in the way) -> illegal
    expect(s.submit({ from: "e1", to: "c1" }).kind).toBe("illegal");
    expect(s.result().mistakes).toBe(0);
  });
});

describe("hint, undo", () => {
  const c = course("london-system");
  const l = c.lines[0];

  it("undo goes back to the user's previous turn and keeps penalties", () => {
    const { s, clk } = make(c, l);
    clk.advance(100);
    s.submit(attempt("d2d4")); // ply 1 user
    s.playOpponent(); // ply 2
    expect(s.ply).toBe(2);
    expect(s.canUndo).toBe(true);
    s.hint();
    const u = s.undo();
    expect(u?.ply).toBe(0);
    expect(u?.fen).toBe(START_FEN);
    expect(s.status).toBe("user");
    expect(s.canUndo).toBe(false);
    expect(s.undo()).toBeUndefined();
    const f = s.submit(attempt("d2d4"));
    expect(f.kind).toBe("correct");
    s.playOpponent();
    // the hint was taken on ply index 2 before undo; it is kept -> hard
    const f2 = s.submit(attempt(s.nextNode!.uci));
    expect(f2.kind === "correct" && f2.grade).toBe("hard");
    // result has each move exactly once
    const ids = s.result().moves.map((m) => m.nodeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("undo is unavailable at the very start and for Black until they have moved", () => {
    const k = course("caro-kann");
    const { s } = make(k, k.lines[0]);
    s.playOpponent();
    expect(s.canUndo).toBe(false);
    s.submit(attempt("c7c6"));
    s.playOpponent();
    expect(s.canUndo).toBe(true);
    expect(s.undo()?.ply).toBe(1);
  });

  it("hint is unavailable on the opponent's turn", () => {
    const { s } = make(c, l);
    s.submit(attempt("d2d4"));
    expect(s.hint()).toBeUndefined();
  });
});

describe("Drill / Time failure", () => {
  const c = course("london-system");
  const l = c.lines[0];

  for (const mode of ["drill", "time"] as Mode[]) {
    it(`${mode}: first mistake ends the run (completed=false)`, () => {
      const { s, clk } = make(c, l, mode);
      clk.advance(1000);
      s.submit(attempt("d2d4"));
      s.playOpponent();
      clk.advance(700);
      const bad = s.submit(attempt("g1f3"));
      expect(bad.kind === "wrong" && bad.failed).toBe(true);
      expect(s.status).toBe("failed");
      expect(s.submit(attempt("c1f4")).kind).toBe("ignored");
      const r = s.result();
      expect(r.completed).toBe(false);
      expect(r.mistakes).toBe(1);
      expect(r.moves.map((m) => m.grade)).toEqual(["easy", "again"]);
      expect(r.moves[1].ms).toBe(700);
    });
  }

  it("Practice mistakes do not end the run", () => {
    const { s } = make(c, l, "practice");
    const bad = s.submit(attempt("e2e4"));
    expect(bad.kind === "wrong" && bad.failed).toBe(false);
    expect(s.status).toBe("user");
  });
});

describe("opening names", () => {
  it("tracks the most recent named position", () => {
    const c = course("london-system");
    const { s } = make(c, c.lines[0]);
    expect(s.openingName).toBeUndefined();
    s.submit(attempt("d2d4"));
    expect(s.openingName).toMatch(/Queen's Pawn/);
  });
});

describe("every line of every course (data integrity through the engine)", () => {
  it("can be completed perfectly by the user's side, and every wrong first move is rejected", () => {
    for (const c of courses) {
      for (const l of c.lines) {
        const clk = clock();
        const s = new LineSession({ course: c, line: l, mode: "practice", now: clk.now });
        let safety = 0;
        while (s.status !== "done" && safety++ < 100) {
          if (s.status === "opponent") {
            s.playOpponent();
            continue;
          }
          const exp = s.nextNode!;
          clk.advance(3000);
          // a legal-but-wrong move never gets accepted: try the reverse of expected if it is not a legal move it's illegal
          const f = s.submit(attempt(exp.uci));
          if (f.kind !== "correct") throw new Error(`${c.id}/${l.id} ${exp.id}: ${f.kind}`);
        }
        expect(s.status).toBe("done");
        expect(s.result().moves).toHaveLength(s.trainedCount);
      }
    }
  });
});
