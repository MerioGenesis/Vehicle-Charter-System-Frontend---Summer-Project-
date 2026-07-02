import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/reviews";

export default function AddReviewPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createReview({ r_content: content, r_rating: Number(rating) });
      navigate("/customer/reviews");
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Add <em>Review</em></h1>
      <form className="auth-form" style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
        <div className="auth-fg">
          <label className="auth-lbl">Rating</label>
          <select className="auth-inp" value={rating} onChange={(e) => setRating(e.target.value)}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}{"☆".repeat(5 - n)}</option>)}
          </select>
        </div>
        <div className="auth-fg">
          <label className="auth-lbl">Your Review</label>
          <textarea
            className="auth-inp"
            rows={5}
            style={{ resize: "vertical" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us about your experience…"
            required
          />
        </div>

        {error && <p className="auth-note" style={{ color: "var(--gold-b)" }}>{error}</p>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
