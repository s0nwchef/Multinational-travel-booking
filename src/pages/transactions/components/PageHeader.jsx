import React from 'react';
import { FiDownload } from 'react-icons/fi';

const PageHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl text-black font-bold">Transaction History</h1>
        <p className="text-gray-600">View your past payments, refunds, and pending transactions.</p>
      </div>
      <button className="border border-[#E2E8F0] bg-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-black">
        <FiDownload />
        Export to CSV
      </button>
    </div>
  );
};

export default PageHeader;
