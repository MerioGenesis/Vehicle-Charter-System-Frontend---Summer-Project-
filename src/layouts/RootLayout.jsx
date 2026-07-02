import { Outlet } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { CSS } from "../styles/theme.css.js";

export default function RootLayout() {
  return (
    <AuthProvider>
      <style>{CSS}</style>
      <Outlet />
    </AuthProvider>
  );
}
