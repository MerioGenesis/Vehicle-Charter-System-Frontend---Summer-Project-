import { useAuth } from "../../auth/AuthContext";
import { DashCardLink } from "../../components/dashboard/DashCard";

const LINKS = [
  { to: "/employee/profile",       title: "Profile",           sub: "View and edit your details" },
  { to: "/employee/assignments",   title: "My Assignments",    sub: "Bookings you're staffed on" },
  { to: "/employee/assignments/open", title: "Open Assignments", sub: "Claim an unstaffed booking" },
  { to: "/employee/reviews",       title: "Reviews",           sub: "Read customer reviews" },
  { to: "/employee/notifications", title: "Notifications",     sub: "Booking updates" },
  { to: "/employee/licenses",      title: "Licenses",          sub: "Your driving/operating licenses" },
  { to: "/employee/tests",         title: "Health Tests",      sub: "Your medical/fitness checks" },
];

export default function EmployeeDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="auth-title" style={{ marginBottom: ".4rem" }}>Welcome back, <em>{user.u_f_name}</em></h1>
      <p className="auth-subtitle">Manage your assignments, qualifications, and account from here.</p>
      <div className="dash-card-grid">
        {LINKS.map((l) => <DashCardLink key={l.to} {...l} />)}
      </div>
    </div>
  );
}
