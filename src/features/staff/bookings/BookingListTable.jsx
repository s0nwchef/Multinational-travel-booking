import React, { useState } from 'react';
import { Eye, Mail, Check } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingListTable = ({ bookings, onUpdateStatus }) => {
  const [showStatusModal, setShowStatusModal] = useState(null);

  const formatCurrency = (amount) => {
    if (!amount) return '0 $';
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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

  const handleViewDetails = (bookingId) => {
    console.log('View booking details:', bookingId);
  };

  const handleContactCustomer = (customerEmail) => {
    console.log('Contact customer:', customerEmail);
  };

  const handleStatusChange = (bookingId, newStatus) => {
    onUpdateStatus?.(bookingId, newStatus);
    setShowStatusModal(null);
  };

  // Map API data to table format - aligned with DatTour model
  const mappedBookings = bookings.map(booking => ({
    id: booking._id || booking.id,
    bookingNumber: booking.bookingCode || booking.bookingNumber || booking.ma_dat_tour || '-',
    customerName: booking.customerName || booking.thong_tin_lien_he?.ho_ten || 'Khách hàng',
    customerEmail: booking.customerEmail || booking.thong_tin_lien_he?.email || '-',
    customerPhone: booking.thong_tin_lien_he?.so_dien_thoai || '-',
    tourName: booking.tourName || booking.id_tour?.ten_tour || '-',
    bookingDate: booking.bookingDate || booking.createdAt || booking.ngay_tao,
    status: booking.status || booking.trang_thai,
    paymentStatus: booking.paymentStatus || booking.trang_thai_thanh_toan,
    totalAmount: booking.totalAmount || booking.tong_tien_cuoi || 0,
    numberOfTravelers: booking.numberOfTravelers || (booking.so_nguoi_lon || 0) + (booking.so_tre_em || 0),
    paymentMethod: booking.paymentMethod || booking.phuong_thuc_thanh_toan || '-'
  }));

  const getStatusLabel = (status) => {
    const labels = {
      confirmed: 'Đã xác nhận',
      pending: 'Chờ xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };
    return labels[status] || status;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Mã booking</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Khách hàng</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tour</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ngày đặt</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Số khách</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Trạng thái</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Thanh toán</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tổng tiền</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {mappedBookings.map((booking) => (
            <tr 
              key={booking.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <td className="py-3 px-4">
                <p className="font-mono text-sm font-semibold text-gray-900">{booking.bookingNumber}</p>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{booking.customerName}</p>
                  <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-900">{booking.tourName}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600">{formatDate(booking.bookingDate)}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-gray-600">{booking.numberOfTravelers} người</p>
              </td>
              <td className="py-3 px-4">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  booking.paymentStatus === 'paid' 
                    ? 'bg-green-50 text-green-600' 
                    : booking.paymentStatus === 'refunded'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                   booking.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Chưa thanh toán'}
                </span>
              </td>
              <td className="py-3 px-4">
                <p className="font-semibold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
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
                    title="Liên hệ"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowStatusModal(booking.id)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Cập nhật trạng thái"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h3>
            <div className="space-y-2">
              {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(showStatusModal, status)}
                  className="w-full p-3 text-left rounded-xl border hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(null)}
              className="mt-4 w-full p-3 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {mappedBookings.length === 0 && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy booking</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default BookingListTable;