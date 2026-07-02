import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { getFleet } from "../../../api/vehicles";
import { FleetVisual } from "../../../components/FleetVisual";
import { LoadingState } from "../../../components/common/LoadingState";
import { ErrorState } from "../../../components/common/ErrorState";

export default function SelectVehiclePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const date = params.get("date");

  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    getFleet()
      .then(setFleet)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!date) return <Navigate to="/customer/book" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleId || !pickup || !destination || !time) return;
    const q = new URLSearchParams({ date, vehicleId, pickup, destination, time });
    navigate(`/customer/book/confirm?${q.toString()}`);
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: ".4rem" }}>Book a <em>Vehicle</em></h1>
      <p className="auth-subtitle">Step 2 of 3 — choose a vehicle and trip details for {date}.</p>

      <div className="step-bar" style={{ maxWidth: 420 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="step-seg" style={{ background: s <= 2 ? "var(--gold)" : "rgba(196,154,14,.14)" }} />
        ))}
      </div>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div className="dash-vehicle-grid" style={{ marginBottom: "1.4rem" }}>
            {fleet.map((v) => (
              <div
                key={v.id}
                className={`dash-vehicle-card${vehicleId === v.id ? " sel" : ""}`}
                onClick={() => setVehicleId(v.id)}
              >
                <FleetVisual vehicle={v} />
                <div className="ft-name">{v.name}</div>
                <div className="ft-type">{v.type} · {v.seats}</div>
              </div>
            ))}
          </div>

          <div className="auth-form" style={{ maxWidth: 420 }}>
            <div className="auth-fg">
              <label className="auth-lbl">Pickup Location</label>
              <input className="auth-inp" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
            </div>
            <div className="auth-fg">
              <label className="auth-lbl">Destination</label>
              <input className="auth-inp" value={destination} onChange={(e) => setDestination(e.target.value)} required />
            </div>
            <div className="auth-fg">
              <label className="auth-lbl">Time</label>
              <input className="auth-inp" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
            <button className="auth-submit" type="submit" disabled={!vehicleId}>Continue →</button>
          </div>
        </form>
      )}
    </div>
  );
}
