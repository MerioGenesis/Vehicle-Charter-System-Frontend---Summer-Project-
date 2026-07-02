export function EmptyState({ message, action }) {
  return (
    <div className="dash-empty">
      <span>{message}</span>
      {action}
    </div>
  );
}
