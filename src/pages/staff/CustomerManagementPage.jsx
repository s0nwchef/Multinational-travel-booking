import React, { useState } from 'react';
import { Users, Plus, Download, Filter } from 'lucide-react';
import CustomerListTable from '../../features/staff/customers/CustomerListTable';
import CustomerDetailModal from '../../features/staff/customers/CustomerDetailModal';

const CustomerManagementPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sample customer data from design document
  const sampleCustomers = [
    {
      id: "CUST001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      totalBookings: 5,
      totalSpent: 2250,
      lastBookingDate: "2024-03-15",
      customerType: "regular",
      joinDate: "2023-01-10"
    },
    {
      id: "CUST002",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0923456789",
      totalBookings: 0,
      totalSpent: 0,
      lastBookingDate: null,
      customerType: "prospect",
      joinDate: "2024-02-20"
    },
    {
      id: "CUST003",
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0934567890",
      totalBookings: 2,
      totalSpent: 850,
      lastBookingDate: "2024-02-28",
      customerType: "new",
      joinDate: "2024-01-15"
    },
    {
      id: "CUST004",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0945678901",
      totalBookings: 8,
      totalSpent: 3200,
      lastBookingDate: "2024-03-10",
      customerType: "regular",
      joinDate: "2022-11-05"
    },
    {
      id: "CUST005",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      totalBookings: 1,
      totalSpent: 450,
      lastBookingDate: "2024-01-20",
      customerType: "new",
      joinDate: "2024-01-05"
    },
    {
      id: "CUST006",
      name: "Vũ Thị F",
      email: "vuthif@example.com",
      phone: "0956789012",
      totalBookings: 0,
      totalSpent: 0,
      lastBookingDate: null,
      customerType: "prospect",
      joinDate: "2024-03-01"
    },
    {
      id: "CUST007",
      name: "Đặng Văn G",
      email: "dangvang@example.com",
      phone: "0967890123",
      totalBookings: 3,
      totalSpent: 1200,
      lastBookingDate: "2024-02-15",
      customerType: "regular",
      joinDate: "2023-08-20"
    },
    {
      id: "CUST008",
      name: "Bùi Thị H",
      email: "buithih@example.com",
      totalBookings: 0,
      totalSpent: 0,
      lastBookingDate: null,
      customerType: "prospect",
      joinDate: "2024-02-25"
    },
    {
      id: "CUST009",
      name: "Ngô Văn I",
      email: "ngovani@example.com",
      phone: "0978901234",
      totalBookings: 4,
      totalSpent: 1800,
      lastBookingDate: "2024-03-05",
      customerType: "regular",
      joinDate: "2023-05-15"
    },
    {
      id: "CUST010",
      name: "Đỗ Thị K",
      email: "dothik@example.com",
      phone: "0989012345",
      totalBookings: 1,
      totalSpent: 500,
      lastBookingDate: "2024-02-10",
      customerType: "new",
      joinDate: "2024-01-30"
    }
  ];

  const handleViewCustomerDetails = (customerId) => {
    const customer = sampleCustomers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleExportCustomers = () => {
    console.log('Exporting customers data...');
    // In a real implementation, this would trigger a CSV/Excel download
    alert('Xuất dữ liệu khách hàng thành công!');
  };

  const handleAddCustomer = () => {
    console.log('Adding new customer...');
    // In a real implementation, this would open a customer creation form
    alert('Thêm khách hàng mới - tính năng đang phát triển');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin và lịch sử booking của khách hàng</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCustomers}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
          <button 
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">{sampleCustomers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500">so với tháng trước</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Khách hàng thường xuyên</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleCustomers.filter(c => c.customerType === 'regular').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500">tỷ lệ giữ chân</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Khách hàng tiềm năng</p>
              <p className="text-2xl font-bold text-gray-900">
                {sampleCustomers.filter(c => c.customerType === 'prospect').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-gray-500">tăng trưởng</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                  minimumFractionDigits: 0
                }).format(sampleCustomers.reduce((sum, c) => sum + c.totalSpent, 0) * 1000)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-medium">+18%</span>
              <span className="text-gray-500">so với tháng trước</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Danh sách khách hàng</h2>
            <p className="text-gray-500">Quản lý và tìm kiếm thông tin khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Sắp xếp theo: Mới nhất</option>
                <option>Sắp xếp theo: Tên A-Z</option>
                <option>Sắp xếp theo: Chi tiêu cao nhất</option>
                <option>Sắp xếp theo: Booking nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Pass the customers data and view details handler */}
        <CustomerListTable 
          customers={sampleCustomers.map(customer => ({
            ...customer,
            onViewDetails: () => handleViewCustomerDetails(customer.id)
          }))}
        />
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Insights Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights về khách hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Khách hàng có giá trị cao nhất</p>
            <p className="font-semibold text-gray-900">Phạm Thị D</p>
            <p className="text-sm text-gray-600">3.2 triệu VND chi tiêu</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tỷ lệ chuyển đổi tiềm năng</p>
            <p className="font-semibold text-gray-900">25%</p>
            <p className="text-sm text-gray-600">3/12 khách tiềm năng đã booking</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500">Tour yêu thích nhất</p>
            <p className="font-semibold text-gray-900">Đà Nẵng - Hội An</p>
            <p className="text-sm text-gray-600">Được 45% khách hàng đặt lại</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementPage;