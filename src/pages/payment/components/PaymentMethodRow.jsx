import React from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi';

const PaymentMethodRow = ({ icon, name, description }) => {
  return (
    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center">
          <img src={icon} alt="icon" />
        <div className="ml-1">
          <p className="font-bold text-black">{name}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="text-gray-500 hover:text-blue-500"><FiEdit /></button>
        <button className="text-gray-500 hover:text-red-500"><FiTrash /></button>
      </div>
    </div>
  );
};

export default PaymentMethodRow;
