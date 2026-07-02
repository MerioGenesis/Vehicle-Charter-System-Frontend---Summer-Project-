import { NavLink } from "react-router-dom";

const CUSTOMER_LINKS = [
  { to: "/customer", label: "Dashboard", end: true },
  { to: "/customer/bookings", label: "My Bookings" },
  { to: "/customer/book", label: "Book a Vehicle" },
  { to: "/customer/reviews", label: "Reviews" },
  { to: "/customer/notifications", label: "Notifications" },
  { to: "/customer/profile", label: "Profile" },
];

export function DashboardSidebar({ links = CUSTOMER_LINKS }) {
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
        </NavLink>
      ))}
    </nav>
  );
}
