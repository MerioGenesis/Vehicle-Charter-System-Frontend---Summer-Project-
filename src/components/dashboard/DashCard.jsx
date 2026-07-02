import { Link } from "react-router-dom";

export function DashCard({ children, ...props }) {
  return <div className="dash-card" {...props}>{children}</div>;
}

export function DashCardLink({ to, title, sub }) {
  return (
    <Link to={to} className="dash-card dash-card-link">
      <div className="dash-card-title">{title}</div>
      {sub && <div className="dash-card-sub">{sub}</div>}
    </Link>
  );
}
