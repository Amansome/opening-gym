import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { localDayKey, progress } from "../lib/progress";
import type { ScoreEntry } from "../lib/progress";
import { courses, getCourse } from "../lib/courses";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { ProgressBar } from "../components/ui/ProgressBar";
import "../styles/heatmap.css";
import { useCourseProgressMap, useDocumentMeta, useStreak } from "../components/ui/hooks";

function useTopScores(mode: "drill" | "time"): ScoreEntry[] {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  useEffect(() => {
    let alive = true;
    const run = () =>
      progress.topScores(mode, undefined, 5).then(
        (s) => alive && setScores(s),
        () => {},
      );
    run();
    const off = progress.subscribe(run);
    return () => {
      alive = false;
      off();
    };
  }, [mode]);
  return scores;
}

function useActivity(): Record<string, number> | undefined {
  const [activity, setActivity] = useState<Record<string, number>>();
  useEffect(() => {
    let alive = true;
    const run = () =>
      progress.getActivity().then(
        (a) => alive && setActivity(a),
        () => {},
      );
    run();
    const off = progress.subscribe(run);
    return () => {
      alive = false;
      off();
    };
  }, []);
  return activity;
}

const HEATMAP_WEEKS = 12;
const WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

function heatLevel(n: number): 0 | 1 | 2 | 3 | 4 {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return 4;
}

interface HeatCell { key: string; date: Date; count: number; level: number; future: boolean; today: boolean }

/** Cells for the last 12 weeks (Monday-first columns), ending with the current week. */
function buildHeatmap(activity: Record<string, number>, now = new Date()): { weeks: HeatCell[][]; total: number; activeDays: number } {
  const todayKey = localDayKey(now.getTime());
  const sinceMonday = (now.getDay() + 6) % 7;
  const weeks: HeatCell[][] = [];
  let total = 0;
  let activeDays = 0;
  for (let w = 0; w < HEATMAP_WEEKS; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday - (HEATMAP_WEEKS - 1 - w) * 7 + d);
      const key = localDayKey(date.getTime());
      const future = key > todayKey;
      const count = future ? 0 : (activity[key] ?? 0);
      total += count;
      if (count > 0) activeDays++;
      col.push({ key, date, count, level: heatLevel(count), future, today: key === todayKey });
    }
    weeks.push(col);
  }
  return { weeks, total, activeDays };
}

function cellLabel(c: HeatCell): string {
  const day = c.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  return `${day}: ${c.count === 0 ? "no lines" : c.count === 1 ? "1 line" : `${c.count} lines`} completed`;
}

function ActivityHeatmap({ activity }: { activity: Record<string, number> | undefined }) {
  const { weeks, total, activeDays } = buildHeatmap(activity ?? {});
  return (
    <section className="section-block" aria-labelledby="activity-h">
      <h2 id="activity-h">Activity</h2>
      <p className="muted heatmap-summary">
        {total === 0
          ? "No lines completed in the last 12 weeks. Finish a line to light up today."
          : `${total} ${total === 1 ? "line" : "lines"} completed on ${activeDays} ${activeDays === 1 ? "day" : "days"} in the last 12 weeks.`}
      </p>
      <div className="heatmap-wrap">
        <div className="heatmap" role="group" aria-label="Activity over the last 12 weeks, one square per day">
          <div className="heatmap-days" aria-hidden="true">
            {WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <ol className="heatmap-weeks" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {weeks.map((col, wi) => {
              const first = col[0].date;
              const prev = wi > 0 ? weeks[wi - 1][0].date : undefined;
              const label = !prev || prev.getMonth() !== first.getMonth() ? first.toLocaleDateString(undefined, { month: "short" }) : "";
              return (
                <li key={col[0].key} className="heatmap-week">
                  <span className="heatmap-month" aria-hidden="true">{label}</span>
                  {col.map((c) => (
                    <span
                      key={c.key}
                      className="heatmap-cell"
                      data-level={c.level}
                      data-today={c.today || undefined}
                      data-future={c.future || undefined}
                      role="img"
                      aria-label={cellLabel(c)}
                      aria-hidden={c.future || undefined}
                      title={cellLabel(c)}
                    />
                  ))}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div className="heatmap-legend" aria-hidden="true">
        Less
        {[0, 1, 2, 3, 4].map((l) => <span key={l} className="heatmap-cell" data-level={l} />)}
        More
      </div>
    </section>
  );
}

function ScoreList({ title, unit, scores, icon }: { title: string; unit: string; scores: ScoreEntry[]; icon: "flame" | "clock" }) {
  return (
    <div className="panel">
      <h3 className="panel-title"><Icon name={icon} size={18} /> {title}</h3>
      {scores.length === 0 ? (
        <p className="muted">No scores yet. Unlock this mode by learning a few lines.</p>
      ) : (
        <ol className="scores">
          {scores.map((s, i) => (
            <li key={`${s.courseId}-${s.at}-${i}`}>
              <span className="score-rank">{i + 1}</span>
              <span className="score-course">{getCourse(s.courseId)?.title ?? s.courseId}</span>
              <span className="score-date">{new Date(s.at).toLocaleDateString()}</span>
              <strong className="score-value">{s.value} <span className="muted">{unit}</span></strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

type Notice = { tone: "ok" | "error"; text: string } | null;

function DataSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ name: string; json: string } | null>(null);
  const [resetId, setResetId] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function doExport() {
    try {
      const json = await progress.exportAll();
      const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `opening-gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice({ tone: "ok", text: "Backup downloaded." });
    } catch (e) {
      setNotice({ tone: "error", text: `Export failed: ${e instanceof Error ? e.message : String(e)}` });
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const json = await file.text();
      JSON.parse(json); // fail early on files that are not JSON at all
      setPending({ name: file.name, json });
      setNotice(null);
    } catch {
      setPending(null);
      setNotice({ tone: "error", text: "That file is not a valid backup (it is not readable JSON)." });
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function doImport() {
    if (!pending) return;
    try {
      await progress.importAll(pending.json);
      setNotice({ tone: "ok", text: "Backup restored. Your progress has been replaced with the contents of the file." });
    } catch (e) {
      setNotice({ tone: "error", text: `Import failed: ${e instanceof Error ? e.message : String(e)}` });
    }
    setPending(null);
  }

  async function doReset() {
    try {
      await progress.resetCourse(resetId);
      setNotice({ tone: "ok", text: `Progress for ${getCourse(resetId)?.title ?? resetId} was reset.` });
    } catch (e) {
      setNotice({ tone: "error", text: `Reset failed: ${e instanceof Error ? e.message : String(e)}` });
    }
    setConfirmReset(false);
    setResetId("");
  }

  return (
    <section className="section-block" aria-labelledby="data-h">
      <h2 id="data-h">Your data</h2>
      <p className="muted">
        Everything is stored in this browser, on your device. Export a backup before clearing browser data or moving to
        another device.
      </p>
      <div className="data-grid">
        <div className="panel">
          <h3 className="panel-title"><Icon name="download" size={18} /> Export backup</h3>
          <p className="muted">Download all your progress as a JSON file.</p>
          <Button onClick={doExport}><Icon name="download" size={16} /> Export backup</Button>
        </div>
        <div className="panel">
          <h3 className="panel-title"><Icon name="upload" size={18} /> Import backup</h3>
          <p className="muted">Restore from a file you exported earlier. This replaces your current progress.</p>
          <input
            ref={fileRef}
            id="import-file"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button onClick={() => fileRef.current?.click()}><Icon name="upload" size={16} /> Choose backup file</Button>
          {pending ? (
            <div className="confirm" role="alertdialog" aria-label="Confirm import">
              <p>Replace all progress with <strong>{pending.name}</strong>? This cannot be undone.</p>
              <div className="confirm-actions">
                <Button variant="danger" onClick={doImport}>Replace my progress</Button>
                <Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="panel">
          <h3 className="panel-title"><Icon name="reset" size={18} /> Reset a course</h3>
          <p className="muted">Forget what you learned in one opening and start it again.</p>
          <label className="select-wrap">
            <span className="sr-only">Course to reset</span>
            <select value={resetId} onChange={(e) => { setResetId(e.target.value); setConfirmReset(false); }}>
              <option value="">Choose a course…</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          {resetId && !confirmReset ? (
            <Button variant="danger" onClick={() => setConfirmReset(true)}>Reset this course</Button>
          ) : null}
          {resetId && confirmReset ? (
            <div className="confirm" role="alertdialog" aria-label="Confirm reset">
              <p>Delete all progress for <strong>{getCourse(resetId)?.title}</strong>?</p>
              <div className="confirm-actions">
                <Button variant="danger" onClick={doReset}>Yes, reset</Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <p className="notice" data-tone={notice?.tone} role="status" aria-live="polite">{notice?.text}</p>
    </section>
  );
}

export default function ProgressPage() {
  useDocumentMeta({
    title: "My progress",
    description: "Your streak, learned lines, spaced-repetition reviews and best scores. Stored on your device.",
  });
  const streak = useStreak();
  const map = useCourseProgressMap(courses);
  const drill = useTopScores("drill");
  const time = useTopScores("time");
  const activity = useActivity();

  const rows = courses
    .map((c) => ({ c, p: map[c.id] }))
    .sort((a, b) => (b.p?.learnedCount ?? 0) - (a.p?.learnedCount ?? 0));
  const startedRows = rows.filter((r) => (r.p?.learnedCount ?? 0) > 0);
  const otherRows = rows.filter((r) => (r.p?.learnedCount ?? 0) === 0);
  const totalLearned = rows.reduce((n, r) => n + (r.p?.learnedCount ?? 0), 0);
  const totalDue = rows.reduce((n, r) => n + (r.p?.dueCount ?? 0), 0);

  return (
    <div className="container">
      <header className="page-head">
        <h1>My progress</h1>
        <p className="page-lead">Stored only on this device. No account, nothing uploaded.</p>
      </header>

      <div className="stat-grid">
        <div className="stat">
          <Icon name="flame" size={22} />
          <strong>{streak?.current ?? 0}</strong>
          <span>day streak{streak?.todayDone ? " (done today)" : ""}</span>
        </div>
        <div className="stat">
          <Icon name="trophy" size={22} />
          <strong>{streak?.best ?? 0}</strong>
          <span>best streak</span>
        </div>
        <div className="stat">
          <Icon name="check" size={22} />
          <strong>{totalLearned}</strong>
          <span>lines learned</span>
        </div>
        <div className="stat">
          <Icon name="repeat" size={22} />
          <strong>{totalDue}</strong>
          <span>due for review</span>
        </div>
      </div>

      <ActivityHeatmap activity={activity} />

      <section className="section-block" aria-labelledby="courses-h">
        <h2 id="courses-h">Courses</h2>
        {startedRows.length === 0 ? (
          <div className="callout">
            <h3>You have not started a course yet</h3>
            <p>Learn your first line and your progress shows up here.</p>
            <Link className="btn" data-variant="primary" data-size="md" to="/openings">Pick an opening</Link>
          </div>
        ) : (
          <ul className="progress-list">
            {startedRows.map(({ c, p }) => (
              <li key={c.id}>
                <div className="progress-row-head">
                  <Link to={`/opening/${c.id}`}>{c.title}</Link>
                  <span className="muted">
                    {p?.learnedCount ?? 0}/{p?.totalLines ?? 0} learned
                    {p && p.dueCount > 0 ? <strong className="due-pill">{p.dueCount} due</strong> : null}
                  </span>
                </div>
                <ProgressBar value={p?.learnedCount ?? 0} max={p?.totalLines ?? 0} label={`${c.title} progress`} />
              </li>
            ))}
          </ul>
        )}
        {startedRows.length > 0 && otherRows.length > 0 ? (
          <details className="more">
            <summary>{otherRows.length} courses not started</summary>
            <ul className="progress-list">
              {otherRows.map(({ c, p }) => (
                <li key={c.id}>
                  <div className="progress-row-head">
                    <Link to={`/opening/${c.id}`}>{c.title}</Link>
                    <span className="muted">0/{p?.totalLines ?? c.lines.length} learned</span>
                  </div>
                  <ProgressBar value={0} max={p?.totalLines ?? 1} label={`${c.title} progress`} />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      <section className="section-block" aria-labelledby="scores-h">
        <h2 id="scores-h">Best scores</h2>
        <div className="data-grid two">
          <ScoreList title="Drill: longest streak" unit="in a row" scores={drill} icon="flame" />
          <ScoreList title="Time: most lines in 60s" unit="lines" scores={time} icon="clock" />
        </div>
      </section>

      <DataSection />
    </div>
  );
}
