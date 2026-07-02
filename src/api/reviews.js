import { apiFetch } from "./client";

export function getReviews() {
  return apiFetch("/reviews");
}

// Always filters client-side on r_u_id after fetching, regardless of whether
// the backend's own ?u_id= filter is active — a no-op if the backend already
// scoped the results, and correct even if it didn't.
export async function getMyReviews(u_id) {
  const reviews = await apiFetch(`/reviews?u_id=${u_id}`);
  return reviews.filter((r) => r.r_u_id === u_id);
}

export function createReview(fields) {
  return apiFetch("/reviews", {
    method: "POST",
    body: JSON.stringify(fields),
  });
}
