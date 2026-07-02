import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getBookings } from "../../api/bookings";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { EmptyState } from "../../components/common/EmptyState";
import { DashTable } from "../../components/dashboard/DashTable";
import { BookingStatusBadge } from "../../components/common/BookingStatusBadge";

export default function BookingsListPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookings(user.u_id)
      .then((data) => { setBookings(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.u_id]);

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>My <em>Bookings</em></h1>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && bookings.length === 0 && (
        <EmptyState
          message="No bookings yet."
          action={<Link to="/customer/book" className="btn-gold" style={{ textDecoration: "none" }}>Book a vehicle</Link>}
        />
      )}
      {!loading && !error && bookings.length > 0 && (
        <DashTable columns={["Date", "Pickup → Destination", "Vehicle", "Status", ""]}>
          {bookings.map((b) => (
            <tr key={b.b_id}>
              <td>{b.b_dateFrom?.slice(0, 10)} {b.b_timeStart}</td>
              <td>{b.b_pickUpLocation} → {b.b_destination}</td>
              <td className="dash-vehicle-cell">
                {b.v_imageURL && <img className="dash-thumb" src={b.v_imageURL} alt={b.v_name} loading="lazy" />}
                {b.v_name} ({b.vt_name})
              </td>
              <td><BookingStatusBadge status={b.b_status} /></td>
              <td><Link to={`/customer/bookings/${b.b_id}`}>View</Link></td>
            </tr>
          ))}
        </DashTable>
      )}
    </div>
  );
}
