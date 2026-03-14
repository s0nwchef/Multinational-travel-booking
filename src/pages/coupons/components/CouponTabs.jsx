import React, {useState} from 'react';

const CouponTabs = () => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Flights', 'Hotels'];

    return (
        <div className="flex items-center justify-between mb-6">
  <span className="text-[#111827] font-bold text-2xl">
    Available Coupons
  </span>

            <div className="flex space-x-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full border transition-all duration-200
        ${
                            activeTab === tab
                                ? "border-[rgba(229,231,235,1)] bg-gray-100 text-gray-900"
                                : "border-transparent bg-white text-gray-500 hover:border-[rgba(255,90,31,1)] hover:text-gray-900"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CouponTabs;
