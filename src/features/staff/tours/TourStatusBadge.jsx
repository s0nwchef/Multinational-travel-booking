import React from 'react';

const TourStatusBadge = ({ status }) => {
  const statusConfig = {
    inactive: {
      text: 'Không hoạt động',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    active: {
      text: 'Đang hoạt động',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    soldout: {
      text: 'Đã bán hết',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.color}`}>
      {config.text}
    </span>
  );
};

export default TourStatusBadge;