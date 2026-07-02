import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Extend when the Admin dashboard lands.
const ROLE_HOME = { Customer: "/customer", Employee: "/employee" };

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
