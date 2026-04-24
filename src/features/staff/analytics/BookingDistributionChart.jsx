import React from 'react';
import { BarChart3 } from 'lucide-react';

const BookingDistributionChart = ({ data = [] }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { tourName: "Tour Đà Nẵng", bookings: 45 },
    { tourName: "Tour Sapa", bookings: 32 },
    { tourName: "Tour Phú Quốc", bookings: 28 },
    { tourName: "Tour Nha Trang", bookings: 24 },
    { tourName: "Tour Hạ Long", bookings: 18 },
    { tourName: "Tour Hội An", bookings: 15 },
  ];

  // Calculate chart dimensions
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = { top: 40, right: 20, bottom: 60, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Find max bookings for scaling
  const maxBookings = Math.max(...chartData.map(d => d.bookings));
  const barWidth = innerWidth / chartData.length * 0.6;
  const barSpacing = innerWidth / chartData.length * 0.4;

  // Calculate total bookings
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);

  // Colors for bars
  const colors = [
    '#FF5B00', // Orange
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Phân phối Booking theo Tour</h3>
          <p className="text-gray-500">Tổng số booking: {totalBookings}</p>
        </div>
        <BarChart3 className="w-5 h-5 text-orange-500" />
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid-bars" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-bars)" />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const value = Math.round(maxBookings * ratio);
            const y = padding.top + innerHeight - ratio * innerHeight;
            return (
              <g key={index}>
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {value}
                </text>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              </g>
            );
          })}

          {/* Bars */}
          {chartData.map((item, index) => {
            const barHeight = (item.bookings / maxBookings) * innerHeight;
            const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding.top + innerHeight - barHeight;
            const percentage = ((item.bookings / totalBookings) * 100).toFixed(1);
            
            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[index % colors.length]}
                  rx="4"
                  ry="4"
                  className="hover:opacity-90 transition-opacity"
                />
                
                {/* Booking count on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {item.bookings}
                </text>
                
                {/* Percentage inside bar */}
                <text
                  x={x + barWidth / 2}
                  y={y + barHeight / 2 + 4}
                  textAnchor="middle"
                  className="text-xs font-medium fill-white"
                >
                  {percentage}%
                </text>
                
                {/* Tour name label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  transform={`rotate(-45 ${x + barWidth / 2} ${chartHeight - 20})`}
                >
                  {item.tourName}
                </text>
              </g>
            );
          })}

          {/* X-axis line */}
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight}
            stroke="#d1d5db"
            strokeWidth="1"
          />

          {/* Y-axis line */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + innerHeight}
            stroke="#d1d5db"
            strokeWidth="1"
          />
        </svg>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-600">{item.tourName}</span>
              <span className="text-sm font-medium text-gray-900">{item.bookings}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Tour phổ biến nhất</p>
          <p className="text-lg font-bold text-gray-900">
            {chartData.reduce((max, item) => item.bookings > max.bookings ? item : max, chartData[0]).tourName}
          </p>
          <p className="text-sm text-gray-500">
            {chartData.reduce((max, item) => item.bookings > max.bookings ? item : max, chartData[0]).bookings} bookings
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Tour ít phổ biến nhất</p>
          <p className="text-lg font-bold text-gray-900">
            {chartData.reduce((min, item) => item.bookings < min.bookings ? item : min, chartData[0]).tourName}
          </p>
          <p className="text-sm text-gray-500">
            {chartData.reduce((min, item) => item.bookings < min.bookings ? item : min, chartData[0]).bookings} bookings
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingDistributionChart;