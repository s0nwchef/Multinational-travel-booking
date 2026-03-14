import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import security from '../img/ser.png'

const SecurityTipsCard = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#EEF2FF] shadow-sm p-6">
      <div className="flex items-center gap-4 mb-3">
          <img src={security} alt="icon" />
          <span className="text-lg text-black font-semibold">Security Tips</span>
      </div>
      <ul className="space-y-2 ps-4">
        <li className="flex items-center text-[#64748B]">
          <FiCheckCircle className="mr-2 text-[#22C55E]" />
          Enable two-factor authentication
        </li>
        <li className="flex items-center text-[#64748B]">
          <FiCheckCircle className="mr-2 text-[#22C55E]" />
          Review your transaction history regularly
        </li>
        <li className="flex items-center text-[#64748B]">
          <FiCheckCircle className="mr-2 text-[#22C55E]" />
          Never share your CVV code with anyone
        </li>
      </ul>
      <a href="#" className="text-orange-500 mt-4 block hover:underline font-bold">Learn more about security</a>
    </div>
  );
};

export default SecurityTipsCard;
