import { apiFetch } from "./client";

export function getTestTypes() {
  return apiFetch("/tests");
}

export function getMyTests(u_id) {
  return apiFetch(`/teststaken?u_id=${u_id}`);
}

export function addTest(tt_t_id, tt_testDate, tt_result) {
  return apiFetch("/teststaken", {
    method: "POST",
    body: JSON.stringify({ tt_t_id, tt_testDate, tt_result }),
  });
}

export function updateTest(t_id, u_id, testDate, tt_result) {
  return apiFetch(`/teststaken/${t_id}/${u_id}/${testDate}`, {
    method: "PUT",
    body: JSON.stringify({ tt_result }),
  });
}

export function deleteTest(t_id, u_id, testDate) {
  return apiFetch(`/teststaken/${t_id}/${u_id}/${testDate}`, { method: "DELETE" });
}
