import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="auth-right" style={{ gridColumn: "1 / -1" }}>
        <div className="auth-box" style={{ textAlign: "center" }}>
          <h1 className="auth-title">404 — Page Not <em>Found</em></h1>
          <p className="auth-subtitle">The page you're looking for doesn't exist.</p>
          <p className="auth-foot"><Link to="/">Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
