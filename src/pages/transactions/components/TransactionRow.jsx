import React from 'react';
import ServiceBadge from './ServiceBadge';
import PaymentMethodBadge from './PaymentMethodBadge';

const TransactionRow = ({ date, orderId, service, paymentMethod, amount }) => {
  return (
    <tr className="border-t border-gray-200">
      <td className="p-4 text-black">{date}</td>
      <td className="p-4 text-[#FF5B00]">{orderId}</td>
      <td className="p-4">
        <ServiceBadge service={service} />
      </td>
      <td className="p-4">
        <PaymentMethodBadge method={paymentMethod} />
      </td>
      <td className="p-4 font-bold text-black">{amount}</td>
    </tr>
  );
};

export default TransactionRow;
