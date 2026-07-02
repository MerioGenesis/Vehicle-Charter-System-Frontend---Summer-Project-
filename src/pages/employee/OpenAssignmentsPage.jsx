import { useState, useEffect } from "react";
import { getOpenAssignments, claimAssignment } from "../../api/workAssignments";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";

export default function OpenAssignmentsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claimingId, setClaimingId] = useState(null);
  const [startTimes, setStartTimes] = useState({});
  const [claimError, setClaimError] = useState(null);

  const load = () => {
    setLoading(true);
    getOpenAssignments()
      .then((data) => {
        setBookings(data);
        setError(null);
        setStartTimes((prev) => {
          const next = { ...prev };
          data.forEach((b) => { if (next[b.wa_b_id] === undefined) next[b.wa_b_id] = b.b_timeStart?.slice(0, 5) || ""; });
          return next;
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets loading state ahead of the fetch it performs
  useEffect(() => { load(); }, []);

  const handleClaim = async (wa_b_id) => {
    setClaimingId(wa_b_id);
    setClaimError(null);
    try {
      await claimAssignment(wa_b_id, startTimes[wa_b_id]);
      load();
    } catch (err) {
      setClaimError(err.message || "Failed to claim assignment");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Open <em>Assignments</em></h1>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && bookings.length === 0 && <EmptyState message="No unstaffed bookings right now." />}
      {claimError && <p className="dash-error">{claimError}</p>}
      {!loading && !error && bookings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(196,154,14,.06)" }}>
          {bookings.map((b) => (
            <div key={b.wa_b_id} className="dash-card" style={{ border: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="dash-card-title">{b.b_pickUpLocation} → {b.b_destination}</div>
                <div className="dash-card-sub">{b.b_dateFrom?.slice(0, 10)} · {b.v_name} ({b.vt_name})</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                <input
                  className="auth-inp"
                  type="time"
                  style={{ width: 120 }}
                  value={startTimes[b.wa_b_id] || ""}
                  onChange={(e) => setStartTimes((s) => ({ ...s, [b.wa_b_id]: e.target.value }))}
                />
                <button className="btn-gold" onClick={() => handleClaim(b.wa_b_id)} disabled={claimingId === b.wa_b_id}>
                  {claimingId === b.wa_b_id ? "Claiming…" : "Claim"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
