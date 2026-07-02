import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getBooking, cancelBooking } from "../../api/bookings";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";
import { BookingStatusBadge } from "../../components/common/BookingStatusBadge";

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    getBooking(id)
      .then((data) => { setBooking(data); setLoadError(null); })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (loadError) return <ErrorState message={loadError} />;

  const isOwner = booking.b_u_id === user.u_id;

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelBooking(id);
      navigate("/customer/bookings");
    } catch (err) {
      setCancelError(err.message || "You can only cancel your own bookings.");
      setCancelling(false);
    }
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Booking <em>#{booking.b_id}</em></h1>

      <div className="dash-card" style={{ maxWidth: 480, marginBottom: "1.2rem" }}>
        {[
          ["Status", <BookingStatusBadge status={booking.b_status} />],
          ["Date", booking.b_dateFrom?.slice(0, 10)],
          ["Time", booking.b_timeStart],
          ["Pickup", booking.b_pickUpLocation],
          ["Destination", booking.b_destination],
          ["Vehicle", `${booking.v_name} (${booking.v_brand}, ${booking.vt_name})`],
          ["Booked by", `${booking.u_f_name} ${booking.u_l_name}`],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(196,154,14,.06)" }}>
            <span className="auth-lbl">{label}</span>
            <span style={{ color: "var(--cream)", fontFamily: "'Josefin Sans',sans-serif", fontSize: ".8rem" }}>{value}</span>
          </div>
        ))}
      </div>

      {cancelError && <p className="dash-error">{cancelError}</p>}

      <div style={{ display: "flex", gap: ".7rem" }}>
        <Link to="/customer/bookings" className="btn-ghost" style={{ textDecoration: "none" }}>Back</Link>
        {isOwner && !confirming && (
          <button className="btn-ghost" onClick={() => setConfirming(true)}>Cancel Booking</button>
        )}
        {isOwner && confirming && (
          <>
            <span className="auth-note" style={{ alignSelf: "center" }}>Cancel this booking?</span>
            <button className="btn-gold" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? "Cancelling…" : "Yes, Cancel"}
            </button>
            <button className="btn-ghost" onClick={() => setConfirming(false)}>Keep It</button>
          </>
        )}
      </div>
    </div>
  );
}
