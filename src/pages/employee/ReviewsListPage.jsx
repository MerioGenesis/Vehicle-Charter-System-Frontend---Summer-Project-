import { useState, useEffect } from "react";
import { getReviews } from "../../api/reviews";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

export default function ReviewsListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getReviews()
      .then((data) => { setReviews(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Reviews</h1>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && reviews.length === 0 && <EmptyState message="No reviews yet." />}
      {!loading && !error && reviews.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(196,154,14,.06)" }}>
          {reviews.map((r) => (
            <div key={r.r_id} className="dash-card" style={{ border: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".4rem" }}>
                <span className="dash-card-title">{r.u_f_name} {r.u_l_name}</span>
                <span className="ft-tag">{"★".repeat(r.r_rating)}{"☆".repeat(5 - r.r_rating)}</span>
              </div>
              <p className="dash-card-sub">{r.r_content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
