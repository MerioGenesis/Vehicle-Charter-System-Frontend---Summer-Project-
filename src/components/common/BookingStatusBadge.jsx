export function BookingStatusBadge({ status }) {
  return <span className={`dash-badge ${status}`}>{status}</span>;
}
