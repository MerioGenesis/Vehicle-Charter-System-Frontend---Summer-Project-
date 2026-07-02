import { apiFetch } from "./client";
import { getBookings } from "./bookings";

// Notifications have no direct user id (only n_b_id), so "my notifications"
// is resolved by cross-referencing the caller's own booking ids. Works
// whether or not the backend's own ?u_id= filter is scoping things too.
export async function getMyNotifications(u_id) {
  const [notifications, myBookings] = await Promise.all([
    apiFetch(`/notifications?u_id=${u_id}`),
    getBookings(u_id),
  ]);
  const myBookingIds = new Set(myBookings.map((b) => b.b_id));
  return notifications.filter((n) => myBookingIds.has(n.n_b_id));
}

export function markNotificationRead(id) {
  return apiFetch(`/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ n_status: 1 }),
  });
}
