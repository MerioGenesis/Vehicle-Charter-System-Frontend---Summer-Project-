import { apiFetch } from "./client";

export function login(u_email, u_password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ u_email, u_password }),
  });
}

// Dev/demo convenience: log in as an existing user with no password, picked
// by user type + name in the UI. Real credential-based login is above.
export function contextLogin(u_id) {
  return apiFetch("/auth/context-login", {
    method: "POST",
    body: JSON.stringify({ u_id }),
  });
}

// Registration reuses the users endpoint — there's no separate /register route.
// New accounts are always created as customers (u_ut_id 1); driver/admin
// accounts are provisioned internally, matching the RegisterPage copy.
const CUSTOMER_UT_ID = 1;

export function register(fields) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify({ ...fields, u_ut_id: CUSTOMER_UT_ID }),
  });
}
