import React from 'react';
import ServiceBadge from './ServiceBadge';
import PaymentMethodBadge from './PaymentMethodBadge';

const TransactionRow = ({ date, orderId, service, serviceImage, paymentMethod, amount, status, rawStatus }) => {
  // Status color mapping
  const statusColors = {
    'Successful': 'text-green-600 bg-green-50',
    'Processing': 'text-yellow-600 bg-yellow-50',
    'Refunded': 'text-red-600 bg-red-50'
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="p-4 text-black">{date}</td>
      <td className="p-4 text-[#FF5B00] font-medium">{orderId}</td>
      <td className="p-4">
        <ServiceBadge service={service} image={serviceImage} />
      </td>
      <td className="p-4">
        <PaymentMethodBadge method={paymentMethod} />
      </td>
      <td className="p-4 font-bold text-black">{amount}</td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'text-gray-600 bg-gray-50'}`}>
          {status}
        </span>
      </td>
    </tr>
  );
};

export default TransactionRow;
