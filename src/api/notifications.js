import { apiFetch } from "./client";

// The backend now scopes "my notifications" server-side per role (Customer:
// bookings they own; Employee: bookings they're assigned to), so the client
// no longer needs to cross-reference bookings itself.
export function getMyNotifications() {
  return apiFetch("/notifications");
}

export function markNotificationRead(id) {
  return apiFetch(`/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ n_status: 1 }),
  });
}
