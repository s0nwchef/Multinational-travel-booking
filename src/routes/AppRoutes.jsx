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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="tour/:tourId" element={<TourDetailPage />} />
        <Route path="checkout/:tourId" element={<CheckoutPage />} />
        <Route path="review/:tourId" element={<WriteReviewPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="tours" element={<ToursPage />} />
        {/*<Route path="destinations" element={} />*/}
        {/*<Route path="tours" element={} />*/}
        {/*<Route path="hotels" element={} />*/}
        {/*<Route path="blog" element={} />*/}
      </Route>
    </Routes>
  );
}
