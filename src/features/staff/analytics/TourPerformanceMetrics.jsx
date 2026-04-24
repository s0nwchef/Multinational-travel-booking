import React from 'react';
import { TrendingUp, TrendingDown, Star, Users, DollarSign, AlertCircle } from 'lucide-react';

const TourPerformanceMetrics = ({ data = [], threshold = 3.5 }) => {
  // Sample data if none provided
  const tourData = data.length > 0 ? data : [
    { tourName: "Tour Đà Nẵng", revenue: 8500, bookings: 45, rating: 4.8 },
    { tourName: "Tour Sapa", revenue: 5200, bookings: 32, rating: 4.5 },
    { tourName: "Tour Phú Quốc", revenue: 4200, bookings: 28, rating: 4.2 },
    { tourName: "Tour Nha Trang", revenue: 3600, bookings: 24, rating: 4.0 },
    { tourName: "Tour Hạ Long", revenue: 3100, bookings: 20, rating: 3.8 },
    { tourName: "Tour Hội An", revenue: 2800, bookings: 18, rating: 3.2 },
  ];

  // Calculate averages
  const avgRevenue = tourData.reduce((sum, item) => sum + item.revenue, 0) / tourData.length;
  const avgBookings = tourData.reduce((sum, item) => sum + item.bookings, 0) / tourData.length;
  const avgRating = tourData.reduce((sum, item) => sum + item.rating, 0) / tourData.length;

  // Find best and worst performing tours
  const bestRevenueTour = tourData.reduce((best, item) => item.revenue > best.revenue ? item : best, tourData[0]);
  const bestRatingTour = tourData.reduce((best, item) => item.rating > best.rating ? item : best, tourData[0]);

  // Identify tours below threshold
  const belowThresholdTours = tourData.filter(tour => tour.rating < threshold);

  // Calculate performance score (weighted average)
  const calculatePerformanceScore = (tour) => {
    const revenueScore = (tour.revenue / avgRevenue) * 0.4;
    const bookingScore = (tour.bookings / avgBookings) * 0.3;
    const ratingScore = (tour.rating / avgRating) * 0.3;
    return (revenueScore + bookingScore + ratingScore) * 100;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hiệu suất Tour</h3>
          <p className="text-gray-500">Phân tích doanh thu, booking và đánh giá</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-gray-900">{avgRating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500">đánh giá trung bình</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Doanh thu trung bình</p>
              <p className="text-xl font-bold text-gray-900">${avgRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+12% so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking trung bình</p>
              <p className="text-xl font-bold text-gray-900">{avgBookings.toFixed(0)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+8% so với kỳ trước</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đánh giá trung bình</p>
              <p className="text-xl font-bold text-gray-900">{avgRating.toFixed(1)}/5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+0.2 so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Tour Performance Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hiệu suất
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tourData.map((tour, index) => {
              const performanceScore = calculatePerformanceScore(tour);
              const isBelowThreshold = tour.rating < threshold;
              
              return (
                <tr 
                  key={index} 
                  className={isBelowThreshold ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-700">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tour.tourName}</div>
                        {isBelowThreshold && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600">Cần cải thiện</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${tour.revenue.toLocaleString()}</div>
                    <div className={`text-xs ${tour.revenue >= avgRevenue ? 'text-green-600' : 'text-red-600'}`}>
                      {tour.revenue >= avgRevenue ? 'Trên trung bình' : 'Dưới trung bình'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tour.bookings}</div>
                    <div className={`text-xs ${tour.bookings >= avgBookings ? 'text-green-600' : 'text-red-600'}`}>
                      {tour.bookings >= avgBookings ? 'Trên trung bình' : 'Dưới trung bình'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-900">{tour.rating.toFixed(1)}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(tour.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`text-xs ${tour.rating >= avgRating ? 'text-green-600' : 'text-red-600'}`}>
                      {tour.rating >= avgRating ? 'Trên trung bình' : 'Dưới trung bình'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            performanceScore >= 120 ? 'bg-green-500' :
                            performanceScore >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(performanceScore, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{performanceScore.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isBelowThreshold ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Cần cải thiện
                      </span>
                    ) : performanceScore >= 120 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Xuất sắc
                      </span>
                    ) : performanceScore >= 80 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Tốt
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Trung bình
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key Insights */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <h4 className="font-medium text-green-900 mb-2">Tour tốt nhất</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-900">{bestRevenueTour.tourName}</p>
              <p className="text-sm text-green-700">Doanh thu cao nhất: ${bestRevenueTour.revenue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-900">{bestRatingTour.rating.toFixed(1)}</p>
              <p className="text-sm text-green-700">Đánh giá cao nhất</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <h4 className="font-medium text-red-900 mb-2">Cần chú ý</h4>
          {belowThresholdTours.length > 0 ? (
            <div>
              <p className="text-lg font-bold text-red-900">{belowThresholdTours.length} tour dưới ngưỡng</p>
              <p className="text-sm text-red-700">
                {belowThresholdTours.map(tour => tour.tourName).join(', ')}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-green-900">Tất cả tour đều đạt chuẩn</p>
              <p className="text-sm text-green-700">Không có tour nào dưới ngưỡng {threshold}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {belowThresholdTours.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Khuyến nghị cải thiện</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Xem xét cải thiện chất lượng dịch vụ cho các tour có đánh giá thấp</li>
                <li>• Phân tích phản hồi khách hàng để tìm điểm cần cải thiện</li>
                <li>• Xem xét điều chỉnh giá hoặc cung cấp ưu đãi cho các tour kém hiệu quả</li>
                <li>• Tăng cường marketing cho các tour có tiềm năng nhưng booking thấp</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourPerformanceMetrics;