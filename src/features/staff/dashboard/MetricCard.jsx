import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendUp = true,
  onClick 
}) => {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100'
  };

  const iconBgClasses = {
    orange: 'bg-orange-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100'
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full bg-white rounded-2xl p-6 text-left
        border border-gray-200 hover:border-gray-300
        shadow-sm hover:shadow-lg
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        group cursor-pointer
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgClasses[color]} rounded-2xl flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{trend}</span>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 group-hover:text-gray-700">
            Xem chi tiết
          </span>
          <div className={`w-8 h-8 ${colorClasses[color]} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default MetricCard;