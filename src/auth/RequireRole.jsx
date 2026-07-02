import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Only "Customer" is mapped today; extend when Employee/Admin dashboards land.
const ROLE_HOME = { Customer: "/customer" };

export function RequireRole({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && user.userType !== role) {
    return <Navigate to={ROLE_HOME[user.userType] ?? "/"} replace />;
  }
  return children;
}
