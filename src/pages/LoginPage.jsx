import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { contextLogin } from "../api/auth";
import { getUserTypes, getUsersByType } from "../api/users";
import { useAuth } from "../auth/AuthContext";
import { AuthLeft } from "../components/AuthLeft";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [userTypes, setUserTypes]   = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [people, setPeople]         = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  useEffect(() => {
    getUserTypes()
      .then((types) => { setUserTypes(types); if (types.length) setSelectedType(types[0].ut_id); })
      .catch((err) => { console.error("Failed to load user types:", err); setError(err.message); });
  }, []);

  useEffect(() => {
    if (!selectedType) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting loading/selection ahead of the fetch this effect exists to run
    setPeopleLoading(true);
    setSelectedUserId("");
    getUsersByType(selectedType)
      .then(setPeople)
      .catch((err) => { console.error("Failed to load users:", err); setError(err.message); })
      .finally(() => setPeopleLoading(false));
  }, [selectedType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) { setError("Please select who you're logging in as."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const { token, user } = await contextLogin(selectedUserId);
      login({ token, user });
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthLeft
        heading="Welcome<br/><em>Back.</em>"
        sub="Sign in to manage your bookings or access the operations portal."
      />
      <div className="auth-right">
        <div className="auth-box">
          <button className="auth-back" onClick={() => navigate("/")}>← Back to Home</button>
          <h1 className="auth-title">Sign <em>In</em></h1>
          <p className="auth-subtitle">Select your account type, then who you are.</p>

          <div className="role-tabs">
            {userTypes.map((t) => (
              <button
                key={t.ut_id}
                className={`role-btn${selectedType === t.ut_id ? " sel" : ""}`}
                type="button"
                onClick={() => setSelectedType(t.ut_id)}
              >
                <span className="role-lbl">{t.ut_name}</span>
              </button>
            ))}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-fg">
              <label className="auth-lbl">Person</label>
              <select
                className="auth-inp"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={peopleLoading || !people.length}
              >
                <option value="">
                  {peopleLoading ? "Loading…" : people.length ? "Select a person" : "No users of this type"}
                </option>
                {people.map((p) => (
                  <option key={p.u_id} value={p.u_id}>{p.u_f_name} {p.u_l_name}</option>
                ))}
              </select>
            </div>

            {error && <p className="auth-note" style={{ color: "var(--gold-b)" }}>{error}</p>}

            <button className="auth-submit" type="submit" disabled={submitting || !selectedUserId}>
              {submitting ? "Signing In…" : "Sign In"}
            </button>
          </form>

          <p className="auth-foot">
            No account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
