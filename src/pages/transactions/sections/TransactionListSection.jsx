import React from 'react';
import TransactionTable from '../components/TransactionTable';
import TablePagination from '../components/TablePagination';

const TransactionListSection = () => {
  const transactions = [
    {
      date: 'Oct 24, 2023',
      orderId: '#TRV-8921',
      service: 'Flight',
      paymentMethod: 'Visa',
      amount: '$1,250.00',
    },
    {
      date: 'Oct 22, 2023',
      orderId: '#HTL-4412',
      service: 'Hotel',
      paymentMethod: 'Mastercard',
      amount: '$450.00',
    },
    {
      date: 'Oct 20, 2023',
      orderId: '#TRN-1102',
      service: 'Train',
      paymentMethod: 'PayPal',
      amount: '$120.00',
    },
  ];

  return (
    <div>
      <TransactionTable transactions={transactions} />
      <TablePagination />
    </div>
  );
};

export default TransactionListSection;
