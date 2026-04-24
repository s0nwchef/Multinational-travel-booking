import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Download,
  Calendar,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';
import BookingListTable from '../../features/staff/bookings/BookingListTable';
import BookingFilters from '../../features/staff/bookings/BookingFilters';

const BookingManagementPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const sampleBookings = [
    {
      id: "BK001",
      bookingNumber: "TRV-2024-001",
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@email.com",
      tourName: "Tour Đà Nẵng - Hội An",
      bookingDate: "2024-03-15",
      travelDate: "2024-04-10",
      status: "confirmed",
      totalAmount: 450,
      numberOfTravelers: 2,
      paymentMethod: "Credit Card"
    },
    {
      id: "BK002",
      bookingNumber: "TRV-2024-002",
      customerName: "Trần Thị B",
      customerEmail: "tranthib@email.com",
      tourName: "Tour Sapa Mùa Lúa Chín",
      bookingDate: "2024-03-14",
      travelDate: "2024-04-05",
      status: "pending",
      totalAmount: 320,
      numberOfTravelers: 1,
      paymentMethod: "Bank Transfer"
    },
    {
      id: "BK003",
      bookingNumber: "TRV-2024-003",
      customerName: "Lê Văn C",
      customerEmail: "levanc@email.com",
      tourName: "Tour Phú Quốc 4N3Đ",
      bookingDate: "2024-03-13",
      travelDate: "2024-04-15",
      status: "completed",
      totalAmount: 680,
      numberOfTravelers: 3,
      paymentMethod: "Credit Card"
    },
    {
      id: "BK004",
      bookingNumber: "TRV-2024-004",
      customerName: "Phạm Thị D",
      customerEmail: "phamthid@email.com",
      tourName: "Tour Nha Trang - Đà Lạt",
      bookingDate: "2024-03-12",
      travelDate: "2024-04-20",
      status: "confirmed",
      totalAmount: 520,
      numberOfTravelers: 2,
      paymentMethod: "PayPal"
    },
    {
      id: "BK005",
      bookingNumber: "TRV-2024-005",
      customerName: "Hoàng Văn E",
      customerEmail: "hoangvane@email.com",
      tourName: "Tour Hạ Long - Cát Bà",
      bookingDate: "2024-03-11",
      travelDate: "2024-04-08",
      status: "cancelled",
      totalAmount: 380,
      numberOfTravelers: 4,
      paymentMethod: "Credit Card"
    },
    {
      id: "BK006",
      bookingNumber: "TRV-2024-006",
      customerName: "Vũ Thị F",
      customerEmail: "vuthif@email.com",
      tourName: "Tour Huế - Đông Hà",
      bookingDate: "2024-03-10",
      travelDate: "2024-04-12",
      status: "confirmed",
      totalAmount: 290,
      numberOfTravelers: 1,
      paymentMethod: "Bank Transfer"
    },
    {
      id: "BK007",
      bookingNumber: "TRV-2024-007",
      customerName: "Đặng Văn G",
      customerEmail: "dangvang@email.com",
      tourName: "Tour Mũi Né - Phan Thiết",
      bookingDate: "2024-03-09",
      travelDate: "2024-04-18",
      status: "pending",
      totalAmount: 410,
      numberOfTravelers: 2,
      paymentMethod: "Credit Card"
    },
    {
      id: "BK008",
      bookingNumber: "TRV-2024-008",
      customerName: "Bùi Thị H",
      customerEmail: "buithih@email.com",
      tourName: "Tour Cần Thơ - Mekong",
      bookingDate: "2024-03-08",
      travelDate: "2024-04-22",
      status: "confirmed",
      totalAmount: 350,
      numberOfTravelers: 3,
      paymentMethod: "PayPal"
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: sampleBookings.length },
    { value: 'confirmed', label: 'Đã xác nhận', count: sampleBookings.filter(b => b.status === 'confirmed').length },
    { value: 'pending', label: 'Chờ xác nhận', count: sampleBookings.filter(b => b.status === 'pending').length },
    { value: 'cancelled', label: 'Đã hủy', count: sampleBookings.filter(b => b.status === 'cancelled').length },
    { value: 'completed', label: 'Hoàn thành', count: sampleBookings.filter(b => b.status === 'completed').length }
  ];

  const filteredBookings = sampleBookings.filter(booking => {
    if (selectedStatus !== 'all' && booking.status !== selectedStatus) return false;
    if (searchQuery && 
        !booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    console.log('Export booking data');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount * 1000);
  };

  const totalRevenue = sampleBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const averageBookingValue = sampleBookings.length > 0 
    ? totalRevenue / sampleBookings.filter(b => b.status !== 'cancelled').length 
    : 0;

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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng booking</p>
              <p className="text-2xl font-bold text-gray-900">{sampleBookings.length}</p>
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
                {new Set(sampleBookings.map(b => b.customerEmail)).size}
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
                {new Set(sampleBookings.map(b => b.tourName)).size}
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
                Hiển thị {filteredBookings.length} booking
                {searchQuery && ` cho "${searchQuery}"`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sắp xếp theo:</span>
              <select className="border-none bg-transparent font-medium text-gray-900 focus:outline-none">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="amount-high">Giá cao đến thấp</option>
                <option value="amount-low">Giá thấp đến cao</option>
              </select>
            </div>
          </div>

          <BookingListTable bookings={filteredBookings} />
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
    </div>
  );
};

export default BookingManagementPage;