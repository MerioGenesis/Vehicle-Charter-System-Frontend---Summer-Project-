import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { RequireRole } from "./auth/RequireRole";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProfilePage from "./pages/shared/ProfilePage";
import EditProfilePage from "./pages/shared/EditProfilePage";
import NotificationsPage from "./pages/shared/NotificationsPage";

import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import BookingsListPage from "./pages/customer/BookingsListPage";
import BookingDetailPage from "./pages/customer/BookingDetailPage";
import SelectDatePage from "./pages/customer/book/SelectDatePage";
import SelectVehiclePage from "./pages/customer/book/SelectVehiclePage";
import ConfirmBookingPage from "./pages/customer/book/ConfirmBookingPage";
import CustomerReviewsListPage from "./pages/customer/ReviewsListPage";
import AddReviewPage from "./pages/customer/AddReviewPage";

import EmployeeDashboardPage from "./pages/employee/EmployeeDashboardPage";
import MyAssignmentsPage from "./pages/employee/MyAssignmentsPage";
import OpenAssignmentsPage from "./pages/employee/OpenAssignmentsPage";
import EmployeeReviewsListPage from "./pages/employee/ReviewsListPage";
import LicensesPage from "./pages/employee/LicensesPage";
import HealthTestsPage from "./pages/employee/HealthTestsPage";

const CUSTOMER_LINKS = [
  { to: "/customer", label: "Dashboard", end: true },
  { to: "/customer/bookings", label: "My Bookings" },
  { to: "/customer/book", label: "Book a Vehicle" },
  { to: "/customer/reviews", label: "Reviews" },
  { to: "/customer/notifications", label: "Notifications" },
  { to: "/customer/profile", label: "Profile" },
];

const EMPLOYEE_LINKS = [
  { to: "/employee", label: "Dashboard", end: true },
  { to: "/employee/assignments", label: "My Assignments" },
  { to: "/employee/assignments/open", label: "Open Assignments" },
  { to: "/employee/reviews", label: "Reviews" },
  { to: "/employee/notifications", label: "Notifications" },
  { to: "/employee/licenses", label: "Licenses" },
  { to: "/employee/tests", label: "Health Tests" },
  { to: "/employee/profile", label: "Profile" },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/customer",
        element: (
          <RequireRole role="Customer">
            <DashboardLayout links={CUSTOMER_LINKS} />
          </RequireRole>
        ),
        children: [
          { index: true, element: <CustomerDashboardPage /> },
          { path: "profile", element: <ProfilePage basePath="/customer" /> },
          { path: "profile/edit", element: <EditProfilePage basePath="/customer" /> },
          { path: "bookings", element: <BookingsListPage /> },
          { path: "bookings/:id", element: <BookingDetailPage /> },
          { path: "book", element: <SelectDatePage /> },
          { path: "book/vehicle", element: <SelectVehiclePage /> },
          { path: "book/confirm", element: <ConfirmBookingPage /> },
          { path: "reviews", element: <CustomerReviewsListPage /> },
          { path: "reviews/new", element: <AddReviewPage /> },
          { path: "notifications", element: <NotificationsPage /> },
        ],
      },
      {
        path: "/employee",
        element: (
          <RequireRole role="Employee">
            <DashboardLayout links={EMPLOYEE_LINKS} />
          </RequireRole>
        ),
        children: [
          { index: true, element: <EmployeeDashboardPage /> },
          { path: "profile", element: <ProfilePage basePath="/employee" /> },
          { path: "profile/edit", element: <EditProfilePage basePath="/employee" /> },
          { path: "assignments", element: <MyAssignmentsPage /> },
          { path: "assignments/open", element: <OpenAssignmentsPage /> },
          { path: "reviews", element: <EmployeeReviewsListPage /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "licenses", element: <LicensesPage /> },
          { path: "tests", element: <HealthTestsPage /> },
        ],
      },
      // Future: { path: "/admin", element: <RequireRole role="Admin"><DashboardLayout links={ADMIN_LINKS}/></RequireRole>, children: [...] }
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
