import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import visaLogo from "../img/visa.png";
import mastercardLogo from "../img/mastercard.png";

const logos = {
    Visa: visaLogo,
    Mastercard: mastercardLogo,
};

const PaymentCard = ({ type, digits, expiry, primary }) => {
  return (
      <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
              <img
                  src={logos[type]}
                  alt={type}
                  className="w-10 h-6 object-contain"
              />
              <div>
                  <p className="font-semibold text-gray-900">
                      {type} ending {digits}
                  </p>
                  <p className="text-sm text-gray-500">
                      Expires {expiry}
                  </p>
              </div>
          </div>
          <div className="flex items-center gap-2">
              {primary ? (
                  <span className="bg-[#DCFCE7] text-[#166534] text-xs px-2 py-1 rounded-full">
                    Primary
                    </span>
                    ) : (
                  <span className="text-[#64748B] text-sm cursor-pointer hover:underline">
                    Set as Primary
                  </span>
              )}
              <FiMoreVertical className="text-gray-400 cursor-pointer" />
          </div>

      </div>
  );
};

export default PaymentCard;
