import React from 'react';

const SectionHeader = ({ title, icon, action }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3 items-center">
          <img src={icon} alt="icon"/>
        <h3 className="text-lg font-semibold text-black">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
