import React from 'react';
import { TrendingUp, TrendingDown, Users, Star, Clock, DollarSign } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      title: 'Khách hàng mới',
      value: 24,
      change: '+12%',
      trendUp: true,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Đánh giá 5 sao',
      value: 89,
      change: '+5%',
      trendUp: true,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Thời gian xử lý TB',
      value: '2.4h',
      change: '-15%',
      trendUp: true,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Doanh thu/Tour',
      value: '$586',
      change: '+8%',
      trendUp: true,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Thống kê nhanh</h3>
          <p className="text-sm text-gray-500">Cập nhật theo thời gian thực</p>
        </div>
        <div className="text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded-lg">Hôm nay</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div 
              key={index}
              className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-medium">{stat.change}</span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>

              {/* Mini progress indicator */}
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.trendUp ? 'bg-green-500' : 'bg-red-500'} rounded-full`}
                    style={{ width: `${stat.trendUp ? '75%' : '40%'}` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Tổng hiệu suất</p>
            <p className="text-lg font-semibold text-gray-900">Tốt hơn 12%</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Xu hướng tích cực</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;