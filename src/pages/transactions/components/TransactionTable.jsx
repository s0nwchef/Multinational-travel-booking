import React from 'react';
import TransactionRow from './TransactionRow';

const TransactionTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[#64748B] uppercase text-xs border-b border-gray-200">
            <th className="p-4">Date</th>
            <th className="p-4">Order ID</th>
            <th className="p-4">Service</th>
            <th className="p-4">Payment Method</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} {...transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
