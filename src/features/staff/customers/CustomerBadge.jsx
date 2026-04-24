import React from 'react';

const CustomerBadge = ({ customerType }) => {
  const statusConfig = {
    regular: {
      text: 'Khách hàng thường xuyên',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '⭐'
    },
    prospect: {
      text: 'Khách hàng tiềm năng',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '🔍'
    },
    new: {
      text: 'Khách hàng mới',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '🆕'
    }
  };

  const config = statusConfig[customerType] || statusConfig.new;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.75rem] ${config.bgColor}`}>
      <span className="text-sm">{config.icon}</span>
      <span className={`text-[9px] font-black ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default CustomerBadge;