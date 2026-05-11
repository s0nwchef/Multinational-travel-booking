import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StaffLayout from "../layouts/StaffLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import HomePage from "../pages/HomePage";
import Notifications from "../pages/Notifications";
import TourDetailPage from "../pages/TourDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import WriteReviewPage from "../pages/WriteReviewPage";
import HelpPage from "../pages/HelpPage";
import ToursPage from "../pages/ToursPage";
import FlightsPage from "../pages/FlightsPage";
import FlightSearchPage from "../pages/flights/FlightSearchPage";
import SeatSelectionPage from "../pages/flights/SeatSelectionPage";
import Destination from "../pages/Destination/layout/Destination.jsx";
import RegionDetail from "../pages/RegionDetail/layout/RegionDetail.jsx";
import CouponsPage from "../pages/coupons/CouponsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import PaymentPage from "../pages/payment/PaymentPage";
import TransactionPage from "../pages/transactions/TransactionPage";
import { Sidebar } from "lucide-react";
import RightSidebar from "../pages/payment/sections/RightSidebar.jsx";
import { div } from "motion/react-client";
import Dashboard from "../pages/DashboardPage.jsx";
import WishlistPage from "../pages/WishlistPage.jsx";
import CancelBookingModal from "../pages/Modal/CancelBookingModal.jsx";
import RefundStatusPage from "../pages/RefundStatusPage.jsx";
import MyBookingsPage from "../pages/MyBookingPage.jsx";

// Staff Pages
import StaffDashboardPage from "../pages/staff/StaffDashboardPage.jsx";
import TourManagementPage from "../pages/staff/TourManagementPage.jsx";
import BookingManagementPage from "../pages/staff/BookingManagementPage.jsx";
import CustomerManagementPage from "../pages/staff/CustomerManagementPage.jsx";
import AnalyticsPage from "../pages/staff/AnalyticsPage.jsx";
import StaffSettingsPage from "../pages/staff/StaffSettingsPage.jsx";
import TourEditorPage from "../pages/staff/TourEditorPage.jsx";

// import Sidebar from "../layouts/Sidebar.jsx";

import LandingPage from "../pages/LandingPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      <Route element={<MainLayout />}>
        {/* Homepage */}
        <Route path="/home" element={<HomePage />} />

        {/* Destination */}
        <Route path="/region/:regionName" element={<RegionDetail />} />

        {/* Coupons & User */}
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/destination" element={<Destination />} />

        {/* Tours & Flights */}
        <Route path="tours" element={<ToursPage />} />
        <Route path="flights" element={<FlightsPage />} />
        <Route path="flights/search" element={<FlightSearchPage />} />
        <Route path="flights/:flightId/seats" element={<SeatSelectionPage />} />
        <Route path="tour/:tourId" element={<TourDetailPage />} />
        <Route
          path="checkout/:tourId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="review/:tourId"
          element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          }
        />

        {/* Other */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<HelpPage />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Wishlist */}
        <Route path="wishlist" element={<WishlistPage />} />

        {/* CancellModal */}
        <Route path="cancel-booking" element={<CancelBookingModal />} />

        {/* RefundStatusPage */}
        <Route path="refund-status" element={<RefundStatusPage />} />

        {/* MyBookingsPage */}
        <Route path="my-bookings" element={<MyBookingsPage />} />
      </Route>

      {/* Staff Routes */}
      <Route element={<StaffLayout />}>
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tours"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <TourManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/bookings"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <BookingManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/customers"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <CustomerManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/analytics"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/settings"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <StaffSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tours/new"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <TourEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tours/:id/edit"
          element={
            <ProtectedRoute roles={["tour_operator", "admin"]}>
              <TourEditorPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
