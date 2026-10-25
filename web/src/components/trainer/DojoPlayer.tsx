// Dojo: practice across every course you have started. Due lines first, interleaved between courses.
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourse, getLine } from "../../lib/courses";
import { progress } from "../../lib/progress";
import { interleave } from "../../lib/trainer";
import { QueuePractice } from "./QueuePractice";
import type { QueueItem } from "./QueuePractice";
import { useStreak } from "./hooks";
import { Icon } from "./icons";
import "./trainer.css";

const MAX_LINES = 20;

export function DojoPlayer() {
  const { streak, refresh } = useStreak();
  const [started, setStarted] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void progress.startedCourses().then((ids) => {
      if (alive) setStarted(ids.length);
    });
    return () => {
      alive = false;
    };
  }, []);

  const loadItems = useCallback(async (): Promise<QueueItem[]> => {
    const ids = await progress.startedCourses();
    const courses = ids.map((id) => getCourse(id)).filter((c): c is NonNullable<typeof c> => !!c);
    if (courses.length === 0) return [];
    const perCourse = Math.min(8, Math.max(3, Math.ceil(12 / courses.length)));
    const lists = await Promise.all(
      courses.map(async (course) => {
        const [cp, picks] = await Promise.all([progress.getCourseProgress(course), progress.pickLines(course, "dojo", perCourse)]);
        const items: QueueItem[] = [];
        for (const id of picks) {
          const line = getLine(course, id);
          if (line && line.kind !== "warning") items.push({ course, line });
        }
        return { due: cp.dueCount, items };
      }),
    );
    lists.sort((a, b) => b.due - a.due); // courses with due lines lead each round-robin pass
    return interleave(lists.map((l) => l.items)).slice(0, MAX_LINES);
  }, []);

  if (started === 0) {
    return (
      <div className="og-empty" data-testid="dojo-empty">
        <Icon name="target" size={40} />
        <h2>The Dojo is empty</h2>
        <p>Learn a line in any course to unlock the Dojo. It mixes lines from every course you have started.</p>
        <Link className="og-btn" to="/openings">
          Browse openings
        </Link>
      </div>
    );
  }

  return (
    <QueuePractice
      mode="dojo"
      fallbackTitle="Dojo"
      loadItems={loadItems}
      streak={streak}
      refreshStreak={refresh}
      emptyText="Nothing to practise right now. Learn a few more lines, then come back."
      extraActions={
        <Link className="og-btn og-btn--ghost" to="/openings">
          Browse openings
        </Link>
      }
    />
  );
}
