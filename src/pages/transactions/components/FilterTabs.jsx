import React from 'react';

const FilterTabs = ({ activeStatus, onStatusChange }) => {
  const tabs = [
    { label: 'All Status', value: 'all' },
    { label: 'Successful', value: 'paid' },
    { label: 'Processing', value: 'unpaid' },
    { label: 'Refunded', value: 'refunded' }
  ];

  return (
    <div className="flex gap-2 mb-4 bg-white rounded-[12px] border border-[#E2E8F0] p-4">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeStatus === tab.value
              ? 'bg-orange-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
