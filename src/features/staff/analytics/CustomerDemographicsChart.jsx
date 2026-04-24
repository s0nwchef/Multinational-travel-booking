import React from 'react';
import { Users } from 'lucide-react';

const CustomerDemographicsChart = ({ data = [] }) => {
  // Sample data if none provided
  const chartData = data.length > 0 ? data : [
    { ageGroup: "18-25", percentage: 25 },
    { ageGroup: "26-35", percentage: 40 },
    { ageGroup: "36-45", percentage: 20 },
    { ageGroup: "46+", percentage: 15 },
  ];

  // Calculate total for validation
  const totalPercentage = chartData.reduce((sum, item) => sum + item.percentage, 0);
  
  // Normalize if total is not 100
  const normalizedData = totalPercentage !== 100 
    ? chartData.map(item => ({
        ...item,
        percentage: Math.round((item.percentage / totalPercentage) * 100)
      }))
    : chartData;

  // Pie chart dimensions
  const size = 200;
  const radius = size / 2;
  const center = radius;
  const strokeWidth = 1;

  // Colors for pie segments
  const colors = [
    '#FF5B00', // Orange
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
  ];

  // Calculate pie segments
  const segments = [];
  let cumulativeAngle = 0;
  
  normalizedData.forEach((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = startAngle + angle;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    // Calculate arc coordinates
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // Large arc flag
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Create path data
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    // Calculate label position (midpoint of arc)
    const midAngle = startAngle + angle / 2;
    const midRad = (midAngle - 90) * (Math.PI / 180);
    const labelRadius = radius * 0.7;
    const labelX = center + labelRadius * Math.cos(midRad);
    const labelY = center + labelRadius * Math.sin(midRad);

    segments.push({
      ...item,
      index,
      pathData,
      labelX,
      labelY,
      color: colors[index % colors.length],
      startAngle,
      endAngle,
      angle
    });
    
    cumulativeAngle = endAngle;
  });

  // Calculate total customers (estimated)
  const totalCustomers = 1000; // This would come from actual data

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Nhân khẩu học khách hàng</h3>
          <p className="text-gray-500">Phân bổ theo độ tuổi</p>
        </div>
        <Users className="w-5 h-5 text-orange-500" />
      </div>

      {/* Chart Container */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg width={size} height={size} className="w-full max-w-[200px] mx-auto">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="#f9fafb"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />

            {/* Pie segments */}
            {segments.map((segment) => (
              <g key={segment.index}>
                <path
                  d={segment.pathData}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-90 transition-opacity"
                />
                
                {/* Percentage label */}
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-white"
                >
                  {segment.percentage}%
                </text>
              </g>
            ))}

            {/* Center circle */}
            <circle
              cx={center}
              cy={center}
              r={radius * 0.3}
              fill="white"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />

            {/* Center text */}
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-semibold fill-gray-700"
            >
              {totalCustomers.toLocaleString()}
            </text>
            <text
              x={center}
              y={center + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-500"
            >
              khách hàng
            </text>
          </svg>
        </div>

        {/* Legend and Details */}
        <div className="flex-1">
          <div className="space-y-4">
            {segments.map((segment) => (
              <div key={segment.index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{segment.ageGroup}</p>
                    <p className="text-sm text-gray-500">Độ tuổi</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{segment.percentage}%</p>
                  <p className="text-sm text-gray-500">
                    ~{Math.round((segment.percentage / 100) * totalCustomers).toLocaleString()} khách
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Tổng quan</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nhóm tuổi phổ biến</p>
                <p className="font-semibold text-gray-900">
                  {segments.reduce((max, item) => item.percentage > max.percentage ? item : max, segments[0]).ageGroup}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nhóm tuổi ít phổ biến</p>
                <p className="font-semibold text-gray-900">
                  {segments.reduce((min, item) => item.percentage < min.percentage ? item : min, segments[0]).ageGroup}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional insights */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm text-orange-700 font-medium">Khách hàng trẻ (18-35)</p>
          <p className="text-2xl font-bold text-orange-900">
            {segments.filter(s => ['18-25', '26-35'].includes(s.ageGroup))
              .reduce((sum, item) => sum + item.percentage, 0)}%
          </p>
          <p className="text-sm text-orange-600">Chiếm đa số khách hàng</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700 font-medium">Khách hàng trung niên (36+)</p>
          <p className="text-2xl font-bold text-blue-900">
            {segments.filter(s => ['36-45', '46+'].includes(s.ageGroup))
              .reduce((sum, item) => sum + item.percentage, 0)}%
          </p>
          <p className="text-sm text-blue-600">Chi tiêu cao hơn trung bình</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDemographicsChart;