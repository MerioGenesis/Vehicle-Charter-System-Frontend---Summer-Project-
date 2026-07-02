import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { getVehicle } from "../../../api/vehicles";
import { createBooking } from "../../../api/bookings";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

export default function ConfirmBookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const date = params.get("date");
  const vehicleId = params.get("vehicleId");
  const pickup = params.get("pickup");
  const destination = params.get("destination");
  const time = params.get("time");

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicleId) return;
    getVehicle(vehicleId)
      .then(setVehicle)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (!date || !vehicleId || !pickup || !destination || !time) {
    return <Navigate to="/customer/book" replace />;
  }

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const booking = await createBooking({
        b_pickUpLocation: pickup,
        b_destination: destination,
        b_dateFrom: date,
        b_timeStart: time,
        b_v_id: vehicleId,
      });
      navigate(booking?.b_id ? `/customer/bookings/${booking.b_id}` : "/customer/bookings");
    } catch (err) {
      setError(err.message || "Failed to create booking");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: ".4rem" }}>Book a <em>Vehicle</em></h1>
      <p className="auth-subtitle">Step 3 of 3 — review and confirm.</p>

      <div className="step-bar" style={{ maxWidth: 420 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="step-seg" style={{ background: "var(--gold)" }} />
        ))}
      </div>

      {loading && <LoadingState />}
      {!loading && loadError && <ErrorState message={loadError} />}
      {!loading && !loadError && (
        <>
          <div className="dash-card" style={{ maxWidth: 420, marginBottom: "1.2rem" }}>
            {[
              ["Date", date],
              ["Time", time],
              ["Pickup", pickup],
              ["Destination", destination],
              ["Vehicle", `${vehicle.name} (${vehicle.type})`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(196,154,14,.06)" }}>
                <span className="auth-lbl">{label}</span>
                <span style={{ color: "var(--cream)", fontFamily: "'Josefin Sans',sans-serif", fontSize: ".8rem" }}>{value}</span>
              </div>
            ))}
          </div>

          {error && <p className="dash-error">{error}</p>}

          <button className="auth-submit" style={{ maxWidth: 420 }} onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Booking…" : "Confirm Booking"}
          </button>
        </>
      )}
    </div>
  );
}
