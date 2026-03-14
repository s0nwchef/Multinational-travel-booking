import React from 'react';
import { FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';

const PaymentMethodBadge = ({ method }) => {
  const icons = {
    Visa: FiCreditCard,
    Mastercard: FiCreditCard,
    PayPal: FiDollarSign,
    'Apple Pay': FiSmartphone,
  };
  const Icon = icons[method] || FiCreditCard;

  return (
    <div className="flex items-center gap-2 text-[#64748B]">
      <Icon className="text-gray-600" />
      <span>{method}</span>
    </div>
  );
};

export default PaymentMethodBadge;
