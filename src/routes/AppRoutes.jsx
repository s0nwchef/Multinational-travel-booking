

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
import Destination from '../pages/Destination/layout/Destination.jsx';
import RegionDetail from '../pages/RegionDetail/layout/RegionDetail.jsx';
import CouponsPage from '../pages/coupons/CouponsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import PaymentPage from '../pages/payment/PaymentPage';
import TransactionPage from '../pages/transactions/TransactionPage';

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

      </Route>
    </Routes>
  );
}
