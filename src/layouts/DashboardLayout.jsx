import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "../components/dashboard/DashboardTopbar";

export default function DashboardLayout() {
  return (
    <div className="dash-layout">
      <DashboardSidebar />
      <div className="dash-main">
        <DashboardTopbar />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
