import React from 'react';

const CreditCardPreview = ({ brand, number, holder, expiry }) => {
  return (
    <div className="w-64 h-40 rounded-xl bg-gradient-to-r from-[#1F2937] to-[#111827] text-white p-4">
      <div className="flex justify-between">
        <span>{brand}</span>
        <span>{brand === 'Visa' ? 'VISA' : 'MC'}</span>
      </div>
      <div className="mt-8">
        <p className="text-lg">**** **** **** {number.slice(-4)}</p>
      </div>
      <div className="flex justify-between mt-4">
        <span>{holder}</span>
        <span>{expiry}</span>
      </div>
    </div>
  );
};

export default CreditCardPreview;
