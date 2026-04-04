import React from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import PersonalInformationSection from './sections/PersonalInformationSection';
import SecuritySection from './sections/SecuritySection';
import NotificationPreferencesSection from './sections/NotificationPreferencesSection';
import PaymentMethodsSection from './sections/PaymentMethodsSection';

const SettingsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-black font-bold text-[28px]">Account Settings</h1>
              <p className="text-[#64748B]">Manage your personal details and preferences</p>
            </div>
            <button className="text-[#334155] bg-[#DADADA] px-5 py-3 rounded-[32px]">View Public Profile</button>
          </div>
          <PersonalInformationSection />
          <SecuritySection />
          <NotificationPreferencesSection />
          <PaymentMethodsSection />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
