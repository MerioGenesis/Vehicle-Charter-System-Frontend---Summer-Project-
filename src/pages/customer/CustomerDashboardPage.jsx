import { useAuth } from "../../auth/AuthContext";
import { DashCardLink } from "../../components/dashboard/DashCard";

const LINKS = [
  { to: "/customer/profile",       title: "Profile",        sub: "View and edit your details" },
  { to: "/customer/bookings",      title: "My Bookings",    sub: "View and cancel your bookings" },
  { to: "/customer/book",          title: "Book a Vehicle", sub: "Charter a car, coach, or boat" },
  { to: "/customer/reviews",       title: "Reviews",        sub: "Read and leave reviews" },
  { to: "/customer/notifications", title: "Notifications",  sub: "Booking updates" },
];

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: ".4rem" }}>Welcome back, <em>{user.u_f_name}</em></h1>
      <p className="auth-subtitle">Manage your account and bookings from here.</p>
      <div className="dash-card-grid">
        {LINKS.map((l) => <DashCardLink key={l.to} {...l} />)}
      </div>
    </div>
  );
}
