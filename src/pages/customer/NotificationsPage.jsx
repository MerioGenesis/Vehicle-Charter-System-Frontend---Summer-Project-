import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getMyNotifications, markNotificationRead } from "../../api/notifications";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/StatusBadge";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getMyNotifications(user.u_id)
      .then((data) => { setNotifications(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.u_id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets loading state ahead of the fetch it performs
  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    setMarkingId(id);
    try {
      await markNotificationRead(id);
      load();
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Notifications</h1>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && notifications.length === 0 && <EmptyState message="No notifications yet." />}
      {!loading && !error && notifications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(196,154,14,.06)" }}>
          {notifications.map((n) => {
            const unread = !n.n_status;
            return (
              <div key={n.n_id} className="dash-card" style={{ border: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="dash-card-title">{n.b_pickUpLocation} → {n.b_destination}</div>
                  <div className="dash-card-sub">{n.b_dateFrom?.slice(0, 10)} {n.b_timeStart} · {n.v_name} ({n.vt_name})</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
                  <StatusBadge unread={unread} />
                  {unread && (
                    <button className="btn-ghost" onClick={() => handleMarkRead(n.n_id)} disabled={markingId === n.n_id}>
                      {markingId === n.n_id ? "…" : "Mark as read"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
