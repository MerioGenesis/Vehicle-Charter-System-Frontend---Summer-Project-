import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectDatePage() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    navigate(`/customer/book/vehicle?date=${date}`);
  };

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: ".4rem" }}>Book a <em>Vehicle</em></h1>
      <p className="auth-subtitle">Step 1 of 3 — when do you need it?</p>

      <div className="step-bar" style={{ maxWidth: 420 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="step-seg" style={{ background: s === 1 ? "var(--gold)" : "rgba(196,154,14,.14)" }} />
        ))}
      </div>

      <form className="auth-form" style={{ maxWidth: 420 }} onSubmit={handleSubmit}>
        <div className="auth-fg">
          <label className="auth-lbl">Date</label>
          <input className="auth-inp" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button className="auth-submit" type="submit">Continue →</button>
      </form>
    </div>
  );
}
