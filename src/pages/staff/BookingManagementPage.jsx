import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Download,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Loader2
} from 'lucide-react';
import BookingListTable from '../../features/staff/bookings/BookingListTable';
import BookingFilters from '../../features/staff/bookings/BookingFilters';
import staffService from '../../services/staffService.js';

const BookingManagementPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, searchQuery, pagination.page, sortBy]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        sort: sortBy,
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const response = await staffService.getBookings(params);
      setBookings(response.bookings || []);
      setPagination(prev => ({
        ...prev,
        ...response.pagination
      }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Không thể tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await staffService.updateBookingStatus(bookingId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      fetchBookings();
    } catch (err) {
      alert('Cập nhật thất bại: ' + err.message);
    }
  };

  const handleExport = async () => {
    try {
      await staffService.exportData('bookings');
      alert('Xuất dữ liệu booking thành công!');
    } catch (err) {
      alert('Xuất dữ liệu thất bại');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

  const averageBookingValue = bookings.length > 0 
    ? totalRevenue / bookings.filter(b => b.status !== 'cancelled').length 
    : 0;

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: pagination.total },
    { value: 'confirmed', label: 'Đã xác nhận', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'pending', label: 'Chờ xác nhận', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'cancelled', label: 'Đã hủy', count: bookings.filter(b => b.status === 'cancelled').length },
    { value: 'completed', label: 'Hoàn thành', count: bookings.filter(b => b.status === 'completed').length }
  ];

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Booking</h1>
          <p className="text-gray-500 mt-2">Theo dõi và quản lý các đặt tour</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchBookings} className="mt-2 text-orange-600 hover:underline">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng booking</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(bookings.map(b => b.userId?.email)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tour khác nhau</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(bookings.map(b => b.tourId?.title)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá trị TB</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageBookingValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">{status.label}</span>
                <span className={`text-sm px-2 py-0.5 rounded-full ${
                  selectedStatus === status.value
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm booking theo tên khách, tour hoặc mã booking..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    showFilters 
                      ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6">
                <BookingFilters 
                  onFilterChange={(filters) => console.log('Filters:', filters)}
                />
              </div>
            )}

            {/* Booking List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 font-medium">
                    Hiển thị {bookings.length} booking
                    {searchQuery && ` cho "${searchQuery}"`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Sắp xếp theo:</span>
                  <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border-none bg-transparent font-medium text-gray-900 focus:outline-none"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="amount-high">Giá cao đến thấp</option>
                    <option value="amount-low">Giá thấp đến cao</option>
                  </select>
                </div>
              </div>

              <BookingListTable 
                bookings={bookings} 
                onUpdateStatus={handleUpdateStatus}
              />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2">
                    Trang {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
                <p className="text-gray-600">Xử lý booking hiệu quả với các công cụ</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Gửi email xác nhận
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-xl font-medium transition-colors">
                  Tạo báo cáo
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingManagementPage;