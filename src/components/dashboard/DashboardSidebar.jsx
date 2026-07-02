import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/customer", label: "Dashboard", end: true },
  { to: "/customer/bookings", label: "My Bookings" },
  { to: "/customer/book", label: "Book a Vehicle" },
  { to: "/customer/reviews", label: "Reviews" },
  { to: "/customer/notifications", label: "Notifications" },
  { to: "/customer/profile", label: "Profile" },
];

export function DashboardSidebar() {
  return (
    <nav className="dash-sidebar">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => `dash-nav-link${isActive ? " active" : ""}`}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
