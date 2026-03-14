import React from 'react';
import SectionHeader from './SectionHeader';

const SettingSection = ({ title, icon, action, children }) => {
  return (
    <div className="rounded-xl border p-6 bg-white border-black]">
      <SectionHeader title={title} icon={icon} action={action} />
      {children}
    </div>
  );
};

export default SettingSection;
