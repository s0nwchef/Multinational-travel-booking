import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueChart = ({ data = [], dateRange = { from: '', to: '' } }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { date: "2024-01", revenue: 12000 },
    { date: "2024-02", revenue: 15000 },
    { date: "2024-03", revenue: 18000 },
    { date: "2024-04", revenue: 24580 },
    { date: "2024-05", revenue: 21000 },
    { date: "2024-06", revenue: 19500 },
  ];

  // Calculate chart dimensions and values
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = 40;
  const innerWidth = chartWidth - 2 * padding;
  const innerHeight = chartHeight - 2 * padding;

  // Find min and max revenue for scaling
  const revenues = chartData.map(d => d.revenue);
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues);
  const revenueRange = maxRevenue - minRevenue;

  // Calculate points for line chart
  const points = chartData.map((item, index) => {
    const x = padding + (index / (chartData.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((item.revenue - minRevenue) / revenueRange) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  // Calculate total revenue
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / chartData.length;
  const latestRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const previousRevenue = chartData[chartData.length - 2]?.revenue || 0;
  const growthPercentage = previousRevenue ? ((latestRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</h3>
          <p className="text-gray-500">
            {dateRange.from && dateRange.to 
              ? `${dateRange.from} - ${dateRange.to}` 
              : '6 tháng gần nhất'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">{growthPercentage}%</span>
          </div>
          <span className="text-gray-500">so với kỳ trước</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const value = minRevenue + ratio * revenueRange;
            const y = padding + innerHeight - ratio * innerHeight;
            return (
              <g key={index}>
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  ${(value / 1000).toFixed(0)}k
                </text>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {chartData.map((item, index) => {
            const x = padding + (index / (chartData.length - 1)) * innerWidth;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item.date}
              </text>
            );
          })}

          {/* Line chart */}
          <polyline
            fill="none"
            stroke="#FF5B00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data points */}
          {chartData.map((item, index) => {
            const x = padding + (index / (chartData.length - 1)) * innerWidth;
            const y = padding + innerHeight - ((item.revenue - minRevenue) / revenueRange) * innerHeight;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="white"
                  stroke="#FF5B00"
                  strokeWidth="3"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#FF5B00"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/20 rounded-[32px] px-3 py-1.5 border border-white/30">
            <div className="w-3 h-3 rounded-full bg-[#FF5B00]"></div>
            <span className="text-sm text-gray-600">Doanh thu</span>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Tổng doanh thu</p>
          <p className="text-xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Doanh thu trung bình</p>
          <p className="text-xl font-bold text-gray-900">${averageRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Doanh thu cao nhất</p>
          <p className="text-xl font-bold text-gray-900">${maxRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;