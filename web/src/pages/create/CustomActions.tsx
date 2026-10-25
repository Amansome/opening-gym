import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, LinkButton } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { courseToPgn, deleteCustomCourse, pgnFileName, refreshCustomCourses } from "../../lib/custom";
import { progress } from "../../lib/progress";
import type { Course } from "../../lib/types";
import "../create.css";

/** Edit / Export PGN / Delete for a course the user made. */
export function CustomActions({ course }: { course: Course }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function exportPgn() {
    const blob = new Blob([courseToPgn(course)], { type: "application/x-chess-pgn;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = pgnFileName(course);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await progress.resetCourse(course.id);
      await deleteCustomCourse(course.id);
      navigate("/openings"); // leave first so the page never flashes a 404 for the course that was just removed
      void refreshCustomCourses();
    } catch {
      setError("Could not delete the course. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="cc-owner" role="group" aria-label="Manage your course">
      <LinkButton to={`/create/${course.id}`} size="sm">Edit</LinkButton>
      <Button size="sm" onClick={exportPgn}><Icon name="download" size={16} />Export PGN</Button>
      {confirming ? (
        <div className="confirm" role="alertdialog" aria-label="Confirm delete">
          <span>Delete “{course.title}” and its progress? This cannot be undone.</span>
          <div className="confirm-actions">
            <Button size="sm" variant="danger" onClick={() => void remove()} disabled={busy}>{busy ? "Deleting…" : "Yes, delete"}</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={busy}>Keep it</Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="danger" onClick={() => setConfirming(true)}>Delete</Button>
      )}
      {error ? <p className="cc-msg" data-tone="error" role="alert">{error}</p> : null}
    </div>
  );
}
