import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getReviews, getMyReviews } from "../../api/reviews";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

export default function ReviewsListPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("mine");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting loading ahead of the fetch this effect exists to run
    setLoading(true);
    const fetcher = tab === "mine" ? getMyReviews(user.u_id) : getReviews();
    fetcher
      .then((data) => { setReviews(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tab, user.u_id]);

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Reviews</h1>

      <div className="dash-tabs">
        <button className={`dash-tab-btn${tab === "mine" ? " on" : ""}`} onClick={() => setTab("mine")}>My Reviews</button>
        <button className={`dash-tab-btn${tab === "all" ? " on" : ""}`} onClick={() => setTab("all")}>All Reviews</button>
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          message={tab === "mine" ? "You haven't left any reviews yet." : "No reviews yet."}
          action={<Link to="/customer/reviews/new" className="btn-gold" style={{ textDecoration: "none" }}>Add Review</Link>}
        />
      )}
      {!loading && !error && reviews.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(196,154,14,.06)", marginBottom: "1.2rem" }}>
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
          <Link to="/customer/reviews/new" className="btn-gold" style={{ textDecoration: "none" }}>Add Review</Link>
        </>
      )}
    </div>
  );
}
