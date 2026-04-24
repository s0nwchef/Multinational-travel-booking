import React from 'react';

const BookingStatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: {
      text: 'Đã xác nhận',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅'
    },
    pending: {
      text: 'Chờ xác nhận',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '⏳'
    },
    cancelled: {
      text: 'Đã hủy',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      icon: '❌'
    },
    completed: {
      text: 'Hoàn thành',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      icon: '✅'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.75rem] ${config.bgColor}`}>
      <span className="text-sm">{config.icon}</span>
      <span className={`text-[9px] font-black ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default BookingStatusBadge;