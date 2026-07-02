import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getUser } from "../../api/users";
import { LoadingState } from "../../components/common/LoadingState";
import { ErrorState } from "../../components/common/ErrorState";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUser(user.u_id)
      .then((data) => { setProfile(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.u_id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const rows = [
    ["First Name", profile.u_f_name],
    ["Last Name", profile.u_l_name],
    ["Email", profile.u_email],
    ["Phone", profile.u_phone],
    ["Gender", profile.u_gender],
    ["Date of Birth", profile.u_dob?.slice(0, 10)],
    ["Address", profile.u_address],
    ["City", profile.u_city],
    ["Postcode", profile.u_postcode],
  ];

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: "1.4rem" }}>My <em>Profile</em></h1>
      <div className="dash-card" style={{ maxWidth: 480, marginBottom: "1.2rem" }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: ".5rem 0", borderBottom: "1px solid rgba(196,154,14,.06)" }}>
            <span className="auth-lbl">{label}</span>
            <span style={{ color: "var(--cream)", fontFamily: "'Josefin Sans',sans-serif", fontSize: ".8rem" }}>{value}</span>
          </div>
        ))}
      </div>
      <Link to="/customer/profile/edit" className="btn-gold" style={{ textDecoration: "none", display: "inline-block" }}>
        Edit Profile
      </Link>
    </div>
  );
}
