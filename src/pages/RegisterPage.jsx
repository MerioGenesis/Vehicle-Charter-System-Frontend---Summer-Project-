import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { AuthLeft } from "../components/AuthLeft";

const REGISTER_INITIAL = {
  u_f_name: "", u_l_name: "", u_email: "", u_phone: "",
  u_gender: "", u_dob: "",
  u_password: "", confirmPassword: "",
  u_address: "", u_city: "", u_postcode: "",
  tos: false,
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login: setSession } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(REGISTER_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validateStep1 = () => {
    if (!form.u_f_name || !form.u_l_name || !form.u_email || !form.u_phone || !form.u_gender || !form.u_dob) {
      return "Please fill in all fields.";
    }
    if (form.u_password.length < 8) return "Password must be at least 8 characters.";
    if (form.u_password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.u_address || !form.u_city || !form.u_postcode) {
      setError("Please fill in your address details.");
      return;
    }
    if (!form.tos) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { u_f_name, u_l_name, u_email, u_phone, u_gender, u_dob, u_password, u_address, u_city, u_postcode } = form;
      await register({ u_f_name, u_l_name, u_email, u_phone, u_gender, u_dob, u_password, u_address, u_city, u_postcode });

      const { token, user } = await login(u_email, u_password);
      setSession({ token, user });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthLeft
        heading="Create Your<br/><em>Account.</em>"
        sub="Register as a customer to book vehicles, track journeys, and manage your travel history."
      />
      <div className="auth-right">
        <div className="auth-box">
          <button className="auth-back" onClick={() => navigate("/login")}>← Back to Sign In</button>
          <h1 className="auth-title">
            {step === 1 ? <>Customer <em>Registration</em></> : <>Almost <em>Done</em></>}
          </h1>
          <p className="auth-subtitle">
            {step === 1
              ? "Fill in your details to create a customer account."
              : "A few more details to complete your registration."}
          </p>

          {/* Step progress */}
          <div className="step-bar">
            {[1, 2].map((s) => (
              <div key={s} className="step-seg" style={{ background: s <= step ? "var(--gold)" : "rgba(196,154,14,.14)" }} />
            ))}
          </div>

          {error && <p className="auth-note" style={{ color: "var(--gold-b)" }}>{error}</p>}

          {step === 1 ? (
            <div className="auth-form">
              <div className="auth-row">
                <div className="auth-fg">
                  <label className="auth-lbl">First Name</label>
                  <input className="auth-inp" type="text" placeholder="John" value={form.u_f_name} onChange={set("u_f_name")} />
                </div>
                <div className="auth-fg">
                  <label className="auth-lbl">Last Name</label>
                  <input className="auth-inp" type="text" placeholder="Smith" value={form.u_l_name} onChange={set("u_l_name")} />
                </div>
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Email Address</label>
                <input className="auth-inp" type="email" placeholder="you@example.com" value={form.u_email} onChange={set("u_email")} />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Phone Number</label>
                <input className="auth-inp" type="tel" placeholder="+44 7700 000000" value={form.u_phone} onChange={set("u_phone")} />
              </div>
              <div className="auth-row">
                <div className="auth-fg">
                  <label className="auth-lbl">Gender</label>
                  <select className="auth-inp" value={form.u_gender} onChange={set("u_gender")}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="auth-fg">
                  <label className="auth-lbl">Date of Birth</label>
                  <input className="auth-inp" type="date" value={form.u_dob} onChange={set("u_dob")} />
                </div>
              </div>
              <div className="auth-divider"><span className="auth-divider-txt">Security</span></div>
              <div className="auth-fg">
                <label className="auth-lbl">Password</label>
                <input className="auth-inp" type="password" placeholder="Min. 8 characters" value={form.u_password} onChange={set("u_password")} />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Confirm Password</label>
                <input className="auth-inp" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set("confirmPassword")} />
              </div>
              <button className="auth-submit" onClick={goToStep2} type="button">Continue →</button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-fg">
                <label className="auth-lbl">Address Line 1</label>
                <input className="auth-inp" type="text" placeholder="Street and house number" value={form.u_address} onChange={set("u_address")} />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">City</label>
                <input className="auth-inp" type="text" placeholder="London" value={form.u_city} onChange={set("u_city")} />
              </div>
              <div className="auth-fg">
                <label className="auth-lbl">Postcode</label>
                <input className="auth-inp" type="text" placeholder="SW1A 1AA" value={form.u_postcode} onChange={set("u_postcode")} />
              </div>
              <div className="info-box">
                <p>
                  This form creates a <strong>customer account</strong>.
                  Employee and admin accounts are created internally by management and cannot be self-registered.
                </p>
              </div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:".65rem" }}>
                <input type="checkbox" id="tos" checked={form.tos} onChange={set("tos")} style={{ accentColor:"var(--gold)", width:"13px", height:"13px", marginTop:".15rem", flexShrink:0 }} />
                <label htmlFor="tos" style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:".7rem", letterSpacing:".04em", color:"var(--muted)", lineHeight:1.55, cursor:"pointer" }}>
                  I agree to the <span style={{ color:"var(--gold-l)" }}>Terms of Service</span> and <span style={{ color:"var(--gold-l)" }}>Privacy Policy</span>
                </label>
              </div>
              <div style={{ display:"flex", gap:".65rem" }}>
                <button type="button" onClick={() => setStep(1)} style={{ flexShrink:0, fontFamily:"'Josefin Sans',sans-serif", fontSize:".7rem", letterSpacing:".18em", textTransform:"uppercase", background:"none", border:"1px solid rgba(196,154,14,.22)", color:"var(--muted)", padding:".88rem 1.1rem", cursor:"pointer" }}>
                  ← Back
                </button>
                <button className="auth-submit" style={{ flex:1 }} type="submit" disabled={submitting}>
                  {submitting ? "Creating Account…" : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="auth-foot">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
