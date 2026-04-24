import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter, Users } from 'lucide-react';
import {
  RevenueChart,
  BookingDistributionChart,
  CustomerDemographicsChart,
  TourPerformanceMetrics,
  DateRangeSelector,
  ExportButton
} from '../../features/staff/analytics';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Sample data matching the design document
  const revenueData = [
    { date: "2024-01", revenue: 12000 },
    { date: "2024-02", revenue: 15000 },
    { date: "2024-03", revenue: 18000 },
    { date: "2024-04", revenue: 24580 },
    { date: "2024-05", revenue: 21000 },
    { date: "2024-06", revenue: 19500 },
  ];

  const bookingDistribution = [
    { tourName: "Tour Đà Nẵng", bookings: 45 },
    { tourName: "Tour Sapa", bookings: 32 },
    { tourName: "Tour Phú Quốc", bookings: 28 },
    { tourName: "Tour Nha Trang", bookings: 24 },
    { tourName: "Tour Hạ Long", bookings: 18 },
    { tourName: "Tour Hội An", bookings: 15 },
  ];

  const customerDemographics = [
    { ageGroup: "18-25", percentage: 25 },
    { ageGroup: "26-35", percentage: 40 },
    { ageGroup: "36-45", percentage: 20 },
    { ageGroup: "46+", percentage: 15 },
  ];

  const tourPerformance = [
    { tourName: "Tour Đà Nẵng", revenue: 8500, bookings: 45, rating: 4.8 },
    { tourName: "Tour Sapa", revenue: 5200, bookings: 32, rating: 4.5 },
    { tourName: "Tour Phú Quốc", revenue: 4200, bookings: 28, rating: 4.2 },
    { tourName: "Tour Nha Trang", revenue: 3600, bookings: 24, rating: 4.0 },
    { tourName: "Tour Hạ Long", revenue: 3100, bookings: 20, rating: 3.8 },
    { tourName: "Tour Hội An", revenue: 2800, bookings: 18, rating: 3.2 },
  ];

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // In a real app, you would fetch new data based on the date range
    console.log('Date range changed:', newRange);
  };

  const handleExport = (exportOptions) => {
    console.log('Exporting with options:', exportOptions);
    // In a real app, you would trigger the export API call here
    alert(`Đang xuất báo cáo ${exportOptions.type} từ ${exportOptions.dateRange.from} đến ${exportOptions.dateRange.to}`);
  };

  // Calculate summary metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = bookingDistribution.reduce((sum, item) => sum + item.bookings, 0);
  const avgRating = tourPerformance.reduce((sum, item) => sum + item.rating, 0) / tourPerformance.length;
  const belowThresholdTours = tourPerformance.filter(tour => tour.rating < 3.5).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Phân tích dữ liệu và báo cáo hiệu suất tour</p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangeSelector 
            onDateRangeChange={handleDateRangeChange}
            initialRange={dateRange}
          />
          <ExportButton 
            onExport={handleExport}
            exportTypes={['CSV', 'PDF', 'Excel']}
            defaultDateRange={dateRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+15% so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng booking</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+8% so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}/5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+0.2 so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <Filter className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tour cần cải thiện</p>
              <p className="text-2xl font-bold text-gray-900">{belowThresholdTours}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Dưới ngưỡng 3.5 sao
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div>
          <RevenueChart 
            data={revenueData}
            dateRange={dateRange}
          />
        </div>

        {/* Booking Distribution Chart */}
        <div>
          <BookingDistributionChart 
            data={bookingDistribution}
          />
        </div>

        {/* Customer Demographics Chart */}
        <div>
          <CustomerDemographicsChart 
            data={customerDemographics}
          />
        </div>

        {/* Quick Stats Card */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tour phổ biến nhất</span>
              <span className="font-semibold text-gray-900">Tour Đà Nẵng</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tỷ lệ hủy tour</span>
              <span className="font-semibold text-gray-900">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Khách hàng mới</span>
              <span className="font-semibold text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tỷ lệ quay lại</span>
              <span className="font-semibold text-gray-900">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doanh thu/booking</span>
              <span className="font-semibold text-gray-900">$189</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Thời gian booking trung bình</span>
              <span className="font-semibold text-gray-900">14 ngày</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-orange-200">
            <p className="text-sm text-orange-700">
              Dữ liệu được cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Tour Performance Metrics */}
      <div>
        <TourPerformanceMetrics 
          data={tourPerformance}
          threshold={3.5}
        />
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Doanh thu tăng mạnh vào tháng 4</p>
                <p className="text-sm text-gray-500">Do chiến dịch marketing mùa hè hiệu quả</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Khách hàng 26-35 tuổi chiếm đa số</p>
                <p className="text-sm text-gray-500">Nhóm tuổi này có tỷ lệ booking cao nhất</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Tour Hội An cần cải thiện đánh giá</p>
                <p className="text-sm text-gray-500">Đánh giá thấp nhất trong danh sách</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Booking tập trung vào cuối tuần</p>
                <p className="text-sm text-gray-500">65% booking được thực hiện Thứ 6 - Chủ nhật</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Khuyến nghị hành động</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">Tối ưu hóa Tour Đà Nẵng</p>
              <p className="text-sm text-green-700">Tour phổ biến nhất, có thể tăng giá hoặc mở thêm slot</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium text-yellow-900">Cải thiện Tour Hội An</p>
              <p className="text-sm text-yellow-700">Xem xét cải thiện dịch vụ hoặc điều chỉnh marketing</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">Target khách hàng 26-35 tuổi</p>
              <p className="text-sm text-blue-700">Tập trung marketing vào nhóm tuổi chiếm 40% khách hàng</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-900">Mở rộng booking ngày thường</p>
              <p className="text-sm text-purple-700">Ưu đãi đặc biệt cho booking từ Thứ 2 - Thứ 5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>
          Dữ liệu được cập nhật theo thời gian thực. Các biểu đồ và báo cáo có thể được xuất ở định dạng CSV, PDF hoặc Excel.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;