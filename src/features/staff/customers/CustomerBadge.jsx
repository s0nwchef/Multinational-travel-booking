import React from 'react';

const CustomerBadge = ({ customerType }) => {
  const statusConfig = {
    regular: {
      text: 'Thường xuyên',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    prospect: {
      text: 'Tiềm năng',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    new: {
      text: 'Mới',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  };

  const config = statusConfig[customerType] || statusConfig.new;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
      {config.text}
    </span>
  );
};

export default CustomerBadge;