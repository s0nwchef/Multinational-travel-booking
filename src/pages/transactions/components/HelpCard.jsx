import React from 'react';
import help from '../img/help.png';

const HelpCard = ({ onContactSupport }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center mb-4">
        <img src={help} alt="help" className="mr-2" />
        <h3 className="text-lg font-bold text-black">Need Help?</h3>
      </div>
      <p className="text-[#64748B] mb-4">
        Can't find a transaction or need an invoice for a past booking? Our support team is here to assist you.
      </p>
      <button 
        onClick={onContactSupport}
        className="bg-orange-500 text-white rounded-lg px-4 py-2 w-full hover:bg-orange-600 transition-colors"
      >
        Contact Support
      </button>
    </div>
  );
};

export default HelpCard;
