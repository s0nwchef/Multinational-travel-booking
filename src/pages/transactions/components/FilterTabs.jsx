import React, { useState } from 'react';

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState('All Status');
  const tabs = ['All Status', 'Successful', 'Processing', 'Refunded'];

  return (
    <div className="flex gap-2 mb-4 bg-white rounded-[12px] border border-[#E2E8F0] p-4">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-lg ${
            activeTab === tab
              ? 'bg-orange-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
