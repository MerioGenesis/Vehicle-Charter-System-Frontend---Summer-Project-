import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { RequireRole } from "./auth/RequireRole";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import ProfilePage from "./pages/customer/ProfilePage";
import EditProfilePage from "./pages/customer/EditProfilePage";
import BookingsListPage from "./pages/customer/BookingsListPage";
import BookingDetailPage from "./pages/customer/BookingDetailPage";
import SelectDatePage from "./pages/customer/book/SelectDatePage";
import SelectVehiclePage from "./pages/customer/book/SelectVehiclePage";
import ConfirmBookingPage from "./pages/customer/book/ConfirmBookingPage";
import ReviewsListPage from "./pages/customer/ReviewsListPage";
import AddReviewPage from "./pages/customer/AddReviewPage";
import NotificationsPage from "./pages/customer/NotificationsPage";

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
            <DashboardLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <CustomerDashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/edit", element: <EditProfilePage /> },
          { path: "bookings", element: <BookingsListPage /> },
          { path: "bookings/:id", element: <BookingDetailPage /> },
          { path: "book", element: <SelectDatePage /> },
          { path: "book/vehicle", element: <SelectVehiclePage /> },
          { path: "book/confirm", element: <ConfirmBookingPage /> },
          { path: "reviews", element: <ReviewsListPage /> },
          { path: "reviews/new", element: <AddReviewPage /> },
          { path: "notifications", element: <NotificationsPage /> },
        ],
      },
      // Future: { path: "/employee", element: <RequireRole role="Employee"><EmployeeLayout/></RequireRole>, children: [...] }
      // Future: { path: "/admin",    element: <RequireRole role="Admin"><AdminLayout/></RequireRole>,    children: [...] }
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
