import React from 'react';

const TourStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      text: 'Bản nháp',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: '📝'
    },
    active: {
      text: 'Đang hoạt động',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '✅'
    },
    archived: {
      text: 'Đã lưu trữ',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: '📦'
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
      <span className="text-sm">{config.icon}</span>
      <span className={`text-xs font-black ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

export default TourStatusBadge;