import { apiFetch } from "./client";

export function getUserTypes() {
  return apiFetch("/usertypes");
}

export function getUsersByType(ut_id) {
  return apiFetch(`/users?ut_id=${ut_id}`);
}
