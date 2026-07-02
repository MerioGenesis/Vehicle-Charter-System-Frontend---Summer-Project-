export function StatusBadge({ unread }) {
  return (
    <span className={`dash-badge ${unread ? "unread" : "read"}`}>
      {unread ? "Unread" : "Read"}
    </span>
  );
}
