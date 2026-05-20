import React from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  User,
  CreditCard,
  Star,
} from 'lucide-react';
import CustomerBadge from './CustomerBadge';
import { formatUsd } from '../../../utils/currency.js';

const CustomerDetailModal = ({ customer, onClose }) => {
  if (!customer) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const bookingHistory = [
    {
      id: 'BK001',
      tourName: 'Tour Đà Nẵng - Hội An',
      bookingDate: '2024-03-15',
      travelDate: '2024-04-10',
      amount: 450,
      status: 'completed',
    },
    {
      id: 'BK002',
      tourName: 'Tour Sapa Mùa Lúa Chín',
      bookingDate: '2024-02-20',
      travelDate: '2024-03-15',
      amount: 320,
      status: 'completed',
    },
    {
      id: 'BK003',
      tourName: 'Tour Phú Quốc 4N3Đ',
      bookingDate: '2024-01-10',
      travelDate: '2024-02-05',
      amount: 680,
      status: 'completed',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết khách hàng</h2>
            <p className="text-gray-500">Thông tin đầy đủ và lịch sử booking</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-2xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CustomerBadge customerType={customer.customerType} />
                        <span className="text-sm text-gray-500">Tham gia: {formatDate(customer.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-900">{customer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử booking</h4>
                <div className="space-y-3">
                  {bookingHistory.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{booking.tourName}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Đặt: {formatDate(booking.bookingDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Đi: {formatDate(booking.travelDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatUsd(booking.amount, '$0')}</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}
                          >
                            {booking.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tổng booking</p>
                        <p className="text-xl font-bold text-gray-900">{customer.totalBookings}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatUsd(customer.totalSpent, '$0')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking cuối</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(customer.lastBookingDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h4>
                <textarea
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Thêm ghi chú về khách hàng..."
                  defaultValue="Khách hàng thích các tour về văn hóa và lịch sử. Đã hỏi về tour Đà Nẵng - Huế cho tháng tới."
                />
                <button className="mt-4 w-full bg-orange-500 text-white py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                  Lưu ghi chú
                </button>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Gửi email
                </button>
                {customer.phone && (
                  <button className="w-full bg-green-500 text-white py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Gọi điện
                  </button>
                )}
                <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Tạo booking mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
