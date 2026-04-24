import React from 'react';
import { Eye, Mail, Phone, Calendar, User, MapPin } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingListTable = ({ bookings }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount * 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = (bookingId) => {
    console.log('View booking details:', bookingId);
  };

  const handleContactCustomer = (customerEmail) => {
    console.log('Contact customer:', customerEmail);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Mã Booking</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Khách hàng</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tour</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ngày đặt</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ngày đi</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Trạng thái</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tổng tiền</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr 
              key={booking.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">BK</span>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">{booking.bookingNumber}</p>
                    <p className="text-xs text-gray-500">{booking.numberOfTravelers} người</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{booking.customerEmail}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{booking.tourName}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{formatDate(booking.bookingDate)}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-600">{formatDate(booking.travelDate)}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                  <p className="text-xs text-gray-500">{booking.paymentMethod}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleViewDetails(booking.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleContactCustomer(booking.customerEmail)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Liên hệ khách hàng"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Gọi điện"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {bookings.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy booking</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
};

export default BookingListTable;