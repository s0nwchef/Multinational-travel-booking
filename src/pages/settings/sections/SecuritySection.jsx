import React from 'react';
import lock from "../img/lock.png"
import { FiLock } from 'react-icons/fi';
import SettingSection from '../components/SettingSection';
import ToggleSwitch from '../components/ToggleSwitch';

const SecuritySection = () => {
  return (
    <SettingSection title="Security" icon={lock}>
        <hr/>
      <div className="mb-4 flex justify-between my-4">
          <div>
              <p className="font-medium text-black font-bold">Password</p>
              <p className="text-[#64748B]">Last changed 3 months ago</p>
          </div>
        <button className="text-orange-500 hover:underline">Change Password</button>
      </div>
        <hr/>
      <div className="flex justify-between items-center my-4    ">
        <div>
            <div>
                <p className="font-medium text-black font-bold">Two-factor authentication</p>
                <p className="text-[#64748B]">Secure your account</p>
            </div>
        </div>
        <ToggleSwitch />
      </div>
        <div className="flex justify-end ">
            <button className="bg-[#DADADA] text-[#334155] rounded-full px-4 py-2 mt-4 right-0">Review Login Activity</button>
        </div>
    </SettingSection>
  );
};

export default SecuritySection;
