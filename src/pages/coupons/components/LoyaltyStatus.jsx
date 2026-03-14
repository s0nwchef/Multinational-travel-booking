import React from 'react';
import ProgressBar from './ProgressBar';

const LoyaltyStatus = () => {
  return (
    <div className="mb-6 bg-white rounded-[32px] p-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl font-semibold">
  <span className="text-black">Loyalty Status: </span>
  <span style={{ color: "#FF5A1F" }}>Platinum</span> <br/>
            <span className="text-[#6B7280] text-sm">Earn points with every trip to unlock exclusive benefits.</span>
</span>
        <span className="text-lg font-semibold bg-[#FFF7ED] border border-[#FFEDD5] text-[#FF5A1F] p-2 px-4 rounded-[9999px]">2,450 pts</span>
      </div>
        <div className="flex justify-between items-center mb-4 text-[#6B7280] font-bold">
            <p>Current level</p>
            <p>NEXT: DIAMOND (3,000 pts)</p>
        </div>
      <ProgressBar value={2450} max={3000} />
      <div className="text-center mt-2  text-[#6B7280] flex justify-end">
        <p>550 points to go!</p>
      </div>
    </div>
  );
};

export default LoyaltyStatus;
