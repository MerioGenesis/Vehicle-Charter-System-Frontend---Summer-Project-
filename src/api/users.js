import { apiFetch } from "./client";

export function getUserTypes() {
  return apiFetch("/usertypes");
}

export function getUsersByType(ut_id) {
  return apiFetch(`/users?ut_id=${ut_id}`);
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function updateUser(id, fields) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });
}
