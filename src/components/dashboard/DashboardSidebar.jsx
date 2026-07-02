import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getUnreadCount } from "../../api/notifications";

const CUSTOMER_LINKS = [
  { to: "/customer", label: "Dashboard", end: true },
  { to: "/customer/bookings", label: "My Bookings" },
  { to: "/customer/book", label: "Book a Vehicle" },
  { to: "/customer/reviews", label: "Reviews" },
  { to: "/customer/notifications", label: "Notifications" },
  { to: "/customer/profile", label: "Profile" },
];

export function DashboardSidebar({ links = CUSTOMER_LINKS }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount().then(setUnreadCount).catch(() => {});
  }, [location.pathname]);

  return (
    <nav className="dash-sidebar">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => `dash-nav-link${isActive ? " active" : ""}`}
        >
          {l.label}
          {l.to.endsWith("/notifications") && unreadCount > 0 && (
            <span className="dash-nav-badge">{unreadCount}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
