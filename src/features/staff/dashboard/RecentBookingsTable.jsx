import React from 'react';
import { CheckCircle, Clock, XCircle, CheckCheck } from 'lucide-react';

const RecentBookingsTable = ({ bookings }) => {
  const statusConfig = {
    confirmed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      text: 'Đã xác nhận'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      text: 'Chờ xác nhận'
    },
    cancelled: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      text: 'Đã hủy'
    },
    completed: {
      icon: CheckCheck,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      text: 'Hoàn thành'
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount * 1000);
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
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Trạng thái</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tổng tiền</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = statusConfig[booking.status];
            const StatusIcon = status.icon;
            
            return (
              <tr 
                key={booking.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {booking.id}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-900">{booking.tourName}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-600">{formatDate(booking.bookingDate)}</p>
                </td>
                <td className="py-3 px-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className={`text-xs font-semibold ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <span className="text-sm font-medium">Xem</span>
                    </button>
                    {booking.status === 'pending' && (
                      <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                        <span className="text-sm font-medium">Xác nhận</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBookingsTable;