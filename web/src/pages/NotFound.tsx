import { LinkButton } from "../components/ui/Button";
import { useDocumentMeta } from "../components/ui/hooks";

export default function NotFound({ what = "page" }: { what?: string }) {
  useDocumentMeta({ title: "Page not found", description: "This page does not exist." });
  return (
    <div className="container not-found">
      <p className="nf-code" aria-hidden="true">404</p>
      <h1>We could not find that {what}</h1>
      <p className="page-lead">The link may be old, or the opening may have been renamed. Try the full list.</p>
      <div className="hero-cta" style={{ justifyContent: "center" }}>
        <LinkButton to="/openings" variant="primary" size="lg">Browse openings</LinkButton>
        <LinkButton to="/" size="lg">Back home</LinkButton>
      </div>
    </div>
  );
}
