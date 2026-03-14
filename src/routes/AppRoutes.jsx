import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
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
        {/*<Route index element={<HomePage />} />*/}
          <Route index element={<Destination />} />
          <Route path="/region/:regionName" element={<RegionDetail />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
      </Route>
    </Routes>
  );
}
