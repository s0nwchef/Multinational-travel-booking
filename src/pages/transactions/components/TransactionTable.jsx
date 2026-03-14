import React from 'react';
import TransactionRow from './TransactionRow';

const TransactionTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border rounded-[12px]">
        <thead>
          <tr className="text-[#64748B] uppercase text-xs">
            <th className="p-4">Date</th>
            <th className="p-4">Order ID</th>
            <th className="p-4">Service</th>
            <th className="p-4">Payment Method</th>
            <th className="p-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <TransactionRow key={index} {...transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
