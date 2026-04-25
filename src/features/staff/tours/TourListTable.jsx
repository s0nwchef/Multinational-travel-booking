import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import TourStatusBadge from './TourStatusBadge';

const TourListTable = ({ tours, onEdit, onDelete }) => {
  const formatCurrency = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price * 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  // Map API data to table format
  const mappedTours = tours.map(tour => ({
    id: tour._id || tour.id,
    name: tour.title || tour.name,
    status: tour.status,
    price: tour.basePrice || tour.price,
    bookings: tour.totalBookings || tour.bookings || 0,
    rating: tour.averageRating || tour.rating || 0,
    destination: tour.destinationId?.name || tour.destination || '-',
    duration: tour.duration || 1,
    createdAt: tour.createdAt
  }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tên Tour</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Trạng thái</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Giá</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Booking</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Đánh giá</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Điểm đến</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ngày tạo</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mappedTours.map((tour) => (
            <tr 
              key={tour.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{tour.name}</p>
                  <p className="text-sm text-gray-500">{tour.duration} ngày</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <TourStatusBadge status={tour.status} />
              </td>
              <td className="py-3 px-4">
                <p className="font-semibold text-gray-900">{formatCurrency(tour.price)}</p>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{tour.bookings}</span>
                  </div>
                  <span className="text-gray-600">booking</span>
                </div>
              </td>
              <td className="py-3 px-4">
                {tour.rating > 0 ? (
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${getRatingColor(tour.rating)}`}>
                    <span className="text-sm font-semibold">{tour.rating.toFixed(1)}</span>
                    <span className="text-xs">★</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Chưa có đánh giá</span>
                )}
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600">{tour.destination}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600">{formatDate(tour.createdAt)}</p>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit?.(tour.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(tour.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {mappedTours.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy tour</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
};

export default TourListTable;