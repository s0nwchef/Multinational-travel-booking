import React from 'react';
import { FiBell, FiInfo } from 'react-icons/fi';
import bell from '../img/notification.png';
import SettingSection from '../components/SettingSection';
import ToggleSwitch from '../components/ToggleSwitch';

/**
 * Notification Preferences Section
 * 
 * Note: Settings shown are system-wide defaults and are read-only for now.
 * For future per-user settings implementation, see docs/notification-settings-future-enhancement.md
 */
const NotificationPreferencesSection = () => {
  // System-wide default settings (read-only)
  const defaultSettings = {
    emailNotifications: true,
    pushNotifications: true,
    bookingUpdates: true,
    promotions: true,
    newsletter: false
  };

  return (
    <SettingSection title="Notification Preferences" icon={bell}>
      <hr/>
      
      {/* Info banner about system defaults */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4 flex items-start gap-2">
        <FiInfo className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">
          These are system-wide default settings. Personal notification preferences will be available in a future update.
        </p>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <ToggleSwitch checked={defaultSettings.emailNotifications} disabled />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive real-time push notifications</p>
          </div>
          <ToggleSwitch checked={defaultSettings.pushNotifications} disabled />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Booking Updates</p>
            <p className="text-sm text-gray-500">Notifications about your bookings and payments</p>
          </div>
          <ToggleSwitch checked={defaultSettings.bookingUpdates} disabled />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Special Deals & Offers</p>
            <p className="text-sm text-gray-500">Get notified about promotions and discounts</p>
          </div>
          <ToggleSwitch checked={defaultSettings.promotions} disabled />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Newsletter</p>
            <p className="text-sm text-gray-500">Receive travel tips and destination guides</p>
          </div>
          <ToggleSwitch checked={defaultSettings.newsletter} disabled />
        </div>
      </div>
      
      {/* Removed the Update button since settings are read-only */}
    </SettingSection>
  );
};

export default NotificationPreferencesSection;
