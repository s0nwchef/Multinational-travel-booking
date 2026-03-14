import React from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import SettingSection from '../components/SettingSection';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import InputField from '../components/InputField';
import profile from "../img/profile.png"

const PersonalInformationSection = () => {
  return (
    <SettingSection title="Personal Information" icon={profile}>
      <ProfilePhotoUpload />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="First Name" placeholder="John" icon={FiUser} />
        <InputField label="Last Name" placeholder="Doe" icon={FiUser} />
        <InputField label="Email Address" placeholder="john@example.com" icon={FiMail} />
        <InputField label="Phone Number" placeholder="+1 234 567 890" icon={FiPhone} />
      </div>
      <button className="bg-orange-500 text-white rounded-full px-4 py-2 mt-4">Save Changes</button>
    </SettingSection>
  );
};

export default PersonalInformationSection;
