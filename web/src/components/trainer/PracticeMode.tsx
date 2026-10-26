import { useCallback } from "react";
import { getLine } from "../../lib/courses";
import { progress } from "../../lib/progress";
import { QueuePractice } from "./QueuePractice";
import type { QueueItem } from "./QueuePractice";
import type { ModeProps } from "./modeProps";

export function PracticeMode({ course, streak, refreshStreak, tabs, selectMode, pick, lanes, backTo }: ModeProps) {
  // The chosen line leads the first round; "another round" goes back to the scheduler's order.
  const loadItems = useCallback(async (again?: boolean): Promise<QueueItem[]> => {
    let ids = await progress.pickLines(course, "practice", 10);
    const chosen = !again && pick ? getLine(course, pick) : undefined;
    if (chosen && chosen.kind !== "warning") ids = [chosen.id, ...ids.filter((id) => id !== chosen.id)].slice(0, 10);
    const out: QueueItem[] = [];
    for (const id of ids) {
      const line = getLine(course, id);
      if (line && line.kind !== "warning") out.push({ course, line });
    }
    return out;
  }, [course, pick]);

  return (
    <QueuePractice
      mode="practice"
      fallbackTitle={course.title}
      loadItems={loadItems}
      streak={streak}
      refreshStreak={refreshStreak}
      tabs={tabs}
      lanes={lanes}
      backTo={backTo}
      emptyText="Nothing to practise yet. Learn a line first, then it will show up here."
      extraActions={
        <button type="button" className="og-btn og-btn--ghost" onClick={() => selectMode("learn")} data-testid="go-learn">
          Learn
        </button>
      }
    />
  );
}
