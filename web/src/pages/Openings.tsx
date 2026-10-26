import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CourseCard, RosterHead } from "../components/ui/CourseCard";
import { Icon } from "../components/ui/Icon";
import { QuickPicks } from "../components/ui/QuickPicks";
import { useCourseProgressMap, useDocumentMeta } from "../components/ui/hooks";
import { courses } from "../lib/courses";
import type { Course, Level } from "../lib/types";
import { MyCourses } from "./create/MyCourses";

type SideFilter = "all" | "white" | "black" | "both";
const SIDES: { key: SideFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "white", label: "White" },
  { key: "black", label: "Black" },
  { key: "both", label: "Traps" },
];
const LEVELS: { key: "all" | Level; label: string }[] = [
  { key: "all", label: "Any level" },
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
];

function searchText(c: Course): string {
  const names = new Set<string>();
  for (const l of c.lines) {
    names.add(l.name);
    if (l.opening) names.add(l.opening);
  }
  return [c.title, c.eco, c.style ?? "", ...names].join(" ").toLowerCase();
}

const INDEX = new Map(courses.map((c) => [c.id, searchText(c)]));

export default function Openings() {
  useDocumentMeta({
    title: "Chess openings",
    description: `Browse ${courses.length} free chess opening courses for White and Black, from beginner-friendly systems to deep theory. Every move explained.`,
  });
  const [params, setParams] = useSearchParams();
  const side = (params.get("side") as SideFilter) || "all";
  const level = (params.get("level") as "all" | Level) || "all";
  const style = params.get("style") || "all";
  const q = params.get("q") ?? "";
  const progressMap = useCourseProgressMap(courses);

  const styles = useMemo(() => [...new Set(courses.map((c) => c.style).filter((s): s is string => !!s))].sort(), []);

  function set(key: string, value: string, empty: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === empty) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  const needle = q.trim().toLowerCase();
  const filtered = courses.filter(
    (c) =>
      (side === "all" || c.side === side) &&
      (level === "all" || c.level === level) &&
      (style === "all" || c.style === style) &&
      (!needle || needle.split(/\s+/).every((w) => (INDEX.get(c.id) ?? "").includes(w))),
  );
  const groups: { key: string; title: string; dot: string; items: Course[] }[] = [
    { key: "white", title: "Openings for White", dot: "white", items: filtered.filter((c) => c.side === "white") },
    { key: "black", title: "Openings for Black", dot: "black", items: filtered.filter((c) => c.side === "black") },
    { key: "both", title: "Traps and tricks", dot: "both", items: filtered.filter((c) => c.side === "both") },
  ];
  const totalLines = courses.reduce((n, c) => n + c.lines.length, 0);
  // Inside a White / Black / Traps group the heading already names the side; a text search is the one case
  // where rows are read on their own, so they carry their side badge again.
  const showSide = needle !== "";
  const filtersActive = side !== "all" || level !== "all" || style !== "all" || needle !== "";

  return (
    <div className="container">
      <header className="page-head">
        <h1>Chess openings</h1>
        <p className="page-lead">
          Pick an opening and start training. Each course teaches the real lines move by move, then drills you with
          spaced repetition until you play them on instinct.
        </p>
        <p className="page-meta">{courses.length} courses · {totalLines} lines · free</p>
      </header>

      <MyCourses />

      {!filtersActive ? <QuickPicks headingId="picks-h" /> : null}

      <div className="filters" role="search">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={q}
            onChange={(e) => set("q", e.target.value, "")}
            placeholder="Search openings, ECO codes, variations…"
            aria-label="Search openings"
          />
        </div>
        <div className="seg" role="group" aria-label="Side">
          {SIDES.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={side === s.key}
              onClick={() => set("side", s.key, "all")}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="select-wrap">
          <span className="sr-only">Level</span>
          <select value={level} onChange={(e) => set("level", e.target.value, "all")}>
            {LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
          </select>
        </label>
        {styles.length > 0 ? (
          <label className="select-wrap">
            <span className="sr-only">Style</span>
            <select value={style} onChange={(e) => set("style", e.target.value, "all")}>
              <option value="all">Any style</option>
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        ) : null}
        {filtersActive ? (
          <button type="button" className="link-btn" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        ) : null}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{filtered.length} openings shown</p>

      {filtered.length === 0 ? (
        <div className="empty">
          <h2>No openings match</h2>
          <p>Try a different search term, or clear the filters.</p>
        </div>
      ) : (
        groups.filter((g) => g.items.length > 0).map((g) => (
          <section key={g.key} className="group" data-side={g.key} aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="group-title">
              <span className="side-dot side-dot-lg" data-side={g.dot} aria-hidden="true" />
              {g.title}
              <span className="count">{g.items.length}</span>
            </h2>
            <RosterHead showSide={showSide} />
            <div className="card-grid" data-nosides={showSide ? undefined : ""}>
              {g.items.map((c) => <CourseCard key={c.id} course={c} progress={progressMap[c.id]} showSide={showSide} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
