import React from 'react';

const SectionContainer = ({ children }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      {children}
    </div>
  );
};

export default SectionContainer;
