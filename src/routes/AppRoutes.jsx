import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Notifications from "../pages/Notifications";
import TourDetailPage from "../pages/TourDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import WriteReviewPage from "../pages/WriteReviewPage";
import HelpPage from "../pages/HelpPage";
import ToursPage from "../pages/ToursPage";
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

// import Sidebar from "../layouts/Sidebar.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Homepage */}
        <Route index element={<HomePage />} />

        {/* Destination */}
        <Route path="/region/:regionName" element={<RegionDetail />} />

        {/* Coupons & User */}
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/destination" element={<Destination />} />

        {/* Tours */}
        <Route path="tours" element={<ToursPage />} />
        <Route path="tour/:tourId" element={<TourDetailPage />} />
        <Route path="checkout/:tourId" element={<CheckoutPage />} />
        <Route path="review/:tourId" element={<WriteReviewPage />} />

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
      </Route>
    </Routes>
  );
}
