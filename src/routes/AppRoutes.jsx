import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import Notifications from "../pages/Notifications";
import ToursPage from "../pages/ToursPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="/tours" element={<ToursPage />} />
        {/*<Route path="destinations" element={} />*/}
        {/*<Route path="tours" element={} />*/}
        {/*<Route path="hotels" element={} />*/}
        {/*<Route path="help" element={} />*/}
        {/*<Route path="blog" element={} />*/}
      </Route>
    </Routes>
  );
}
