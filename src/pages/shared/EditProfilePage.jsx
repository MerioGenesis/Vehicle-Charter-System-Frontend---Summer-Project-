import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getUser, updateUser } from "../../api/users";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";

const FIELDS = [
  ["u_f_name", "First Name", "text"],
  ["u_l_name", "Last Name", "text"],
  ["u_email", "Email", "email"],
  ["u_phone", "Phone", "tel"],
  ["u_address", "Address", "text"],
  ["u_city", "City", "text"],
  ["u_postcode", "Postcode", "text"],
];

export default function EditProfilePage({ basePath = "/customer" }) {
  const navigate = useNavigate();
  const { user, updateCurrentUser } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUser(user.u_id)
      .then((u) => setForm({ ...u, u_dob: u.u_dob?.slice(0, 10) }))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [user.u_id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { u_f_name, u_l_name, u_email, u_phone, u_address, u_city, u_postcode } = form;
      const updated = await updateUser(user.u_id, { u_f_name, u_l_name, u_email, u_phone, u_address, u_city, u_postcode });
      updateCurrentUser({ u_f_name: updated.u_f_name, u_l_name: updated.u_l_name, u_email: updated.u_email, u_phone: updated.u_phone });
      navigate(`${basePath}/profile`);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (loadError) return <ErrorState message={loadError} />;

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>Edit <em>Profile</em></h1>
      <form className="auth-form" style={{ maxWidth: 420 }} onSubmit={handleSubmit}>
        {FIELDS.map(([field, label, type]) => (
          <div className="auth-fg" key={field}>
            <label className="auth-lbl">{label}</label>
            <input className="auth-inp" type={type} value={form[field] || ""} onChange={set(field)} />
          </div>
        ))}

        {error && <p className="auth-note" style={{ color: "var(--gold-b)" }}>{error}</p>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
