import React from 'react';

const BookingStatusBadge = ({ status }) => {
  const statusConfig = {
    confirmed: {
      text: 'Đã xác nhận',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    pending: {
      text: 'Chờ xác nhận',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    cancelled: {
      text: 'Đã hủy',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    completed: {
      text: 'Hoàn thành',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
      {config.text}
    </span>
  );
};

export default BookingStatusBadge;