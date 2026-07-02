import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getMyAssignments } from "../../api/workAssignments";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { DashTable } from "../../components/dashboard/DashTable";
import { BookingStatusBadge } from "../../components/common/BookingStatusBadge";

export default function MyAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyAssignments(user.u_id)
      .then((data) => { setAssignments(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.u_id]);

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>My <em>Assignments</em></h1>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && assignments.length === 0 && (
        <EmptyState message="You have no assignments yet." />
      )}
      {!loading && !error && assignments.length > 0 && (
        <DashTable columns={["Date", "Start Time", "Vehicle", "Status"]}>
          {assignments.map((a) => (
            <tr key={a.wa_b_id}>
              <td>{a.b_dateFrom?.slice(0, 10)}</td>
              <td>{a.wa_startTime}</td>
              <td className="dash-vehicle-cell">
                {a.v_imageURL && <img className="dash-thumb" src={a.v_imageURL} alt={a.v_name} loading="lazy" />}
                {a.v_name} ({a.vt_name})
              </td>
              <td><BookingStatusBadge status={a.b_status} /></td>
            </tr>
          ))}
        </DashTable>
      )}
    </div>
  );
}
