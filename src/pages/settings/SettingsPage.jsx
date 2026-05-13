import React from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import PersonalInformationSection from './sections/PersonalInformationSection';
import SecuritySection from './sections/SecuritySection';
import NotificationPreferencesSection from './sections/NotificationPreferencesSection';
import PaymentMethodsSection from './sections/PaymentMethodsSection';

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-8 pt-[100px]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-black font-bold text-[28px]">Account Settings</h1>
              <p className="text-[#64748B]">Manage your personal details and preferences</p>
            </div>

          </div>
          <PersonalInformationSection />
          <SecuritySection />

          <PaymentMethodsSection />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
