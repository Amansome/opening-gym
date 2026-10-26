import { DojoPlayer } from "../components/trainer/DojoPlayer";
import { LinkButton } from "../components/ui/Button";
import { useDocumentMeta, useStartedCourses } from "../components/ui/hooks";

export default function DojoPage() {
  useDocumentMeta({
    title: "Dojo",
    description: "Train every opening you have started in one mixed session. Lines that are due or weak come first.",
  });
  const started = useStartedCourses();
  const empty = started !== undefined && started.length === 0;
  return (
    <div className="container">
      <header className="page-head" style={{ ["--head-line" as string]: "var(--court-black)" }}>
        <h1>Dojo</h1>
        <p className="page-lead">
          One session, every course you have started, mixed together. Lines that are due or shaky come first, so you
          spend your time on what you are most likely to forget. No hints, no notes: just you and the position.
        </p>
      </header>
      {empty ? (
        <div className="callout">
          <h2>Nothing to train yet</h2>
          <p>The Dojo draws from lines you have learned. Learn your first line in any opening, then come back.</p>
          <LinkButton to="/openings" variant="primary">Pick an opening</LinkButton>
        </div>
      ) : null}
      <div className="player-slot">
        <DojoPlayer />
      </div>
    </div>
  );
}
