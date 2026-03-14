import React from 'react';
import PersonalInformationSection from './sections/PersonalInformationSection';
import SecuritySection from './sections/SecuritySection';
import NotificationPreferencesSection from './sections/NotificationPreferencesSection';
import PaymentMethodsSection from './sections/PaymentMethodsSection';

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-[#F6F7F8]">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-black font-bold text-[28px]">Acount Settings</h1>
                <p className="text-[#64748B]">Mange your personal details and prefercens</p>
            </div>
            <button className="text-[#334155] bg-[#DADADA] px-5 py-3 rounded-[32px]">View Public Profile</button>
        </div>
      <PersonalInformationSection />
      <SecuritySection />
      <NotificationPreferencesSection />
      <PaymentMethodsSection />
    </div>
  );
};

export default SettingsPage;
