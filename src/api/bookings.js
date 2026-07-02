import { apiFetch } from "./client";

export function getBookings(u_id) {
  return apiFetch(`/bookings?u_id=${u_id}`);
}

export function getBooking(id) {
  return apiFetch(`/bookings/${id}`);
}

export function createBooking(fields) {
  return apiFetch("/bookings", {
    method: "POST",
    body: JSON.stringify(fields),
  });
}

export function updateBooking(id, fields) {
  return apiFetch(`/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(fields),
  });
}

export function cancelBooking(id) {
  return apiFetch(`/bookings/${id}`, { method: "DELETE" });
}
