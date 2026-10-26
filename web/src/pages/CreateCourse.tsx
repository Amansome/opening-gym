import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useDocumentMeta } from "../components/ui/hooks";
import {
  buildFromTree,
  courseToDraft,
  deleteLine,
  mergeGames,
  saveAndRegister,
  setLeafMeta,
  useCustomCourses,
} from "../lib/custom";
import type { DraftTree, Path, PgnGame } from "../lib/custom";
import type { Course, Level, LineKind } from "../lib/types";
import NotFound from "./NotFound";
import { ImportPanel } from "./create/ImportPanel";
import { MoveEditor } from "./create/MoveEditor";
import { Preview } from "./create/Preview";
import "./create.css";

type Tab = "board" | "import";
type PlaySide = "white" | "black";

const LEVELS: { key: Level; label: string }[] = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
];

export default function CreateCourse() {
  const { courseId } = useParams();
  const { courses, ready } = useCustomCourses();
  const existing = courseId ? courses.find((c) => c.id === courseId) : undefined;
  useDocumentMeta({ title: courseId ? "Edit course" : "Create a course", description: "Build your own opening course: play the moves on a board or import a PGN, then train it like any other course." });

  if (courseId && !existing) {
    if (!ready) return <p className="container" style={{ padding: "48px 16px" }} role="status">Loading…</p>;
    return <NotFound what="course" />;
  }
  return <Editor key={existing?.id ?? "new"} existing={existing} />;
}

function Editor({ existing }: { existing?: Course }) {
  const navigate = useNavigate();
  const [name, setName] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing && !/^My course · /.test(existing.summary) ? existing.summary : "");
  const [side, setSide] = useState<PlaySide>(existing?.side === "black" ? "black" : "white");
  const [sideTouched, setSideTouched] = useState(Boolean(existing));
  const [level, setLevel] = useState<Level>(existing?.level ?? "intermediate");
  const [tree, setTree] = useState<DraftTree>(() => (existing ? courseToDraft(existing) : []));
  const [path, setPath] = useState<Path>([]);
  const [tab, setTab] = useState<Tab>("board");
  const [triedSave, setTriedSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [flash, setFlash] = useState("");
  const boardRef = useRef<HTMLElement>(null);

  const result = useMemo(
    () =>
      buildFromTree({
        id: existing?.id,
        title: name.trim() || "Untitled",
        summary: description,
        side,
        level,
        tree,
        createdAt: existing?.createdAt,
      }),
    [existing, name, description, side, level, tree],
  );
  const nameMissing = !name.trim();
  const canSave = !nameMissing && result.errors.length === 0 && Boolean(result.course);

  function addGames(games: PgnGame[]) {
    const wasEmpty = tree.length === 0;
    const next = mergeGames(tree, games);
    setTree(next);
    if (!name.trim()) {
      const study = games.map((g) => g.headers.StudyName).find((s) => s && s.trim());
      const first = games[0].name;
      setName((study ?? first ?? "").trim());
    }
    if (wasEmpty && !sideTouched) {
      const o = games[0].headers.Orientation?.toLowerCase();
      if (o === "black" || o === "white") setSide(o);
    }
    setFlash(`Added ${games.length} ${games.length === 1 ? "game" : "games"}. Review the lines below.`);
    setPath([]);
  }

  function resolveConflicts() {
    let next = tree;
    for (const w of result.warnings) if (w.code === "conflict") next = setLeafMeta(next, w.sans, { kind: "alternative" });
    setTree(next);
  }

  async function save() {
    setTriedSave(true);
    setSaveError("");
    if (!canSave || !result.course) return;
    setSaving(true);
    try {
      await saveAndRegister(result.course);
      navigate(`/opening/${result.course.id}`);
    } catch {
      setSaveError("Could not save the course in this browser. Check that site storage is allowed and try again.");
      setSaving(false);
    }
  }

  return (
    <div className="container cc">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/openings">Openings</Link>
        <Icon name="chevron" size={14} />
        <span aria-current="page">{existing ? "Edit course" : "Create a course"}</span>
      </nav>
      <header className="page-head cc-head">
        <h1>{existing ? "Edit your course" : "Create a course"}</h1>
        <p className="page-lead">
          Build a repertoire of your own: play the lines on a board or import them from a PGN or a Lichess study. Everything stays in
          this browser, and you train it like any other course.
        </p>
      </header>

      <section className="cc-card" aria-labelledby="cc-details">
        <h2 id="cc-details">1. Details</h2>
        <div className="cc-form">
          <div className="cc-field cc-field-wide">
            <label htmlFor="cc-name" className="cc-label">Course name</label>
            <input
              id="cc-name"
              className="cc-input"
              value={name}
              maxLength={80}
              placeholder="e.g. My Italian repertoire"
              aria-invalid={triedSave && nameMissing ? true : undefined}
              aria-describedby={triedSave && nameMissing ? "cc-name-err" : undefined}
              onChange={(e) => setName(e.target.value)}
            />
            {triedSave && nameMissing ? <p id="cc-name-err" className="cc-msg" data-tone="error" role="alert">Give the course a name.</p> : null}
          </div>
          <div className="cc-field cc-field-wide">
            <label htmlFor="cc-desc" className="cc-label">Description <span className="muted">(optional)</span></label>
            <textarea
              id="cc-desc"
              className="cc-input"
              rows={2}
              maxLength={400}
              value={description}
              placeholder="What is this course for?"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="cc-field">
            <span className="cc-label" id="cc-side-l">I play as</span>
            <div className="seg cc-seg" role="group" aria-labelledby="cc-side-l">
              {(["white", "black"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={side === s}
                  onClick={() => {
                    setSide(s);
                    setSideTouched(true);
                  }}
                >
                  {s === "white" ? "White" : "Black"}
                </button>
              ))}
            </div>
          </div>
          <div className="cc-field">
            <label htmlFor="cc-level" className="cc-label">Level</label>
            <label className="select-wrap">
              <select id="cc-level" value={level} onChange={(e) => setLevel(e.target.value as Level)}>
                {LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="cc-card" aria-labelledby="cc-moves" ref={boardRef}>
        <h2 id="cc-moves">2. Add the moves</h2>
        <div className="seg cc-tabs" role="group" aria-label="How to add moves">
          <button type="button" aria-pressed={tab === "board"} onClick={() => setTab("board")}>Play on the board</button>
          <button type="button" aria-pressed={tab === "import"} onClick={() => setTab("import")}>Import PGN</button>
        </div>
        {flash ? <p className="cc-msg" data-tone="ok" role="status">{flash}</p> : null}
        {tab === "board" ? (
          <MoveEditor
            tree={tree}
            path={path}
            side={side}
            onPath={setPath}
            onTree={(t) => {
              setTree(t);
              setFlash("");
            }}
          />
        ) : (
          <ImportPanel
            onAdd={(games) => {
              addGames(games);
              setTab("board");
            }}
          />
        )}
      </section>

      <section className="cc-card" aria-labelledby="cc-preview" data-lane="green">
        <h2 id="cc-preview">3. Review and save</h2>
        <Preview
          tree={tree}
          result={result}
          onName={(p, n) => setTree((t) => setLeafMeta(t, p, { name: n }))}
          onKind={(p, kind: LineKind) => setTree((t) => setLeafMeta(t, p, { kind }))}
          onView={(p) => {
            setPath(p);
            setTab("board");
            boardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onDelete={(p) => {
            setTree((t) => deleteLine(t, p));
            setPath([]);
          }}
          onResolveConflicts={resolveConflicts}
        />
        {saveError ? <p className="cc-msg" data-tone="error" role="alert">{saveError}</p> : null}
        <div className="cc-savebar">
          <Button variant="primary" size="lg" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : existing ? "Save changes" : "Save course"}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate(existing ? `/opening/${existing.id}` : "/openings")}>Cancel</Button>
          {!canSave && triedSave ? <span className="cc-msg" data-tone="error" role="alert">{nameMissing ? "Give the course a name." : result.errors[0]}</span> : null}
        </div>
      </section>
    </div>
  );
}
