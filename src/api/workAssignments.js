import { apiFetch } from "./client";

export function getMyAssignments(u_id) {
  return apiFetch(`/workassignments?u_id=${u_id}`);
}

export function getOpenAssignments() {
  return apiFetch("/workassignments?available=true");
}

// wa_u_id is intentionally omitted — the backend forces it to the caller's
// own id for Employees; only an Admin may name someone else.
export function claimAssignment(wa_b_id, wa_startTime) {
  return apiFetch("/workassignments", {
    method: "POST",
    body: JSON.stringify({ wa_b_id, wa_startTime }),
  });
}

export function unassign(wa_b_id) {
  return apiFetch(`/workassignments/${wa_b_id}`, { method: "DELETE" });
}
