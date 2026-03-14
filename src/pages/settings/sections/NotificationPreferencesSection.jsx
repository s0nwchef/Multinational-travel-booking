import React from 'react';
import { FiBell } from 'react-icons/fi';
import bell from '../img/notification.png';
import SettingSection from '../components/SettingSection';
import ToggleSwitch from '../components/ToggleSwitch';

const NotificationPreferencesSection = () => {
  return (
    <SettingSection title="Notification Preferences" icon={bell}>
      <hr/>
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <ToggleSwitch />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">SMS Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via SMS</p>
          </div>
          <ToggleSwitch />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Special Deals & Offers</p>
            <p className="text-sm text-gray-500">Get notified about promotions</p>
          </div>
          <ToggleSwitch />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="bg-[#DADADA] text-[#334155] rounded-full px-4 py-2 mt-4">Update Preferences</button>
      </div>
    </SettingSection>
  );
};

export default NotificationPreferencesSection;
