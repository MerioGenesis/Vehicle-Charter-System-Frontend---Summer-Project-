import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function DashboardTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dash-topbar">
      <span className="nav-greeting">Hi, {user.u_f_name}</span>
      <button className="btn-ghost" onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
