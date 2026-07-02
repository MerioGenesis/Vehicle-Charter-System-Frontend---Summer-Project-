import { apiFetch } from "./client";

export function getLicenseTypes() {
  return apiFetch("/licenses");
}

export function getMyLicenses(u_id) {
  return apiFetch(`/licensesobtained?u_id=${u_id}`);
}

export function addLicense(lo_l_id, lo_expiryDate) {
  return apiFetch("/licensesobtained", {
    method: "POST",
    body: JSON.stringify({ lo_l_id, lo_expiryDate }),
  });
}

export function updateLicense(u_id, l_id, expiryDate, lo_expiryDate) {
  return apiFetch(`/licensesobtained/${u_id}/${l_id}/${expiryDate}`, {
    method: "PUT",
    body: JSON.stringify({ lo_expiryDate }),
  });
}

export function deleteLicense(u_id, l_id, expiryDate) {
  return apiFetch(`/licensesobtained/${u_id}/${l_id}/${expiryDate}`, { method: "DELETE" });
}
