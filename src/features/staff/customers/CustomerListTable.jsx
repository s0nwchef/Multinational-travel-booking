import React, { useState } from 'react';
import { Eye, Mail, Phone, Calendar, User, DollarSign, Search, Filter } from 'lucide-react';
import CustomerBadge from './CustomerBadge';

const CustomerListTable = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount * 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có booking';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = (customerId, customer) => {
    console.log('View customer details:', customerId);
    // If customer has onViewDetails prop, use it
    if (customer.onViewDetails) {
      customer.onViewDetails();
    }
  };

  const handleContactCustomer = (customerEmail) => {
    console.log('Contact customer:', customerEmail);
    // In a real implementation, this would open email client
  };

  // Filter customers based on search and filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'regular' && customer.customerType === 'regular') ||
      (selectedFilter === 'prospect' && customer.customerType === 'prospect') ||
      (selectedFilter === 'new' && customer.customerType === 'new');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2.5 rounded-2xl font-medium transition-colors ${selectedFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setSelectedFilter('regular')}
            className={`px-4 py-2.5 rounded-2xl font-medium transition-colors ${selectedFilter === 'regular' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Thường xuyên
          </button>
          <button 
            onClick={() => setSelectedFilter('prospect')}
            className={`px-4 py-2.5 rounded-2xl font-medium transition-colors ${selectedFilter === 'prospect' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Tiềm năng
          </button>
          <button 
            onClick={() => setSelectedFilter('new')}
            className={`px-4 py-2.5 rounded-2xl font-medium transition-colors ${selectedFilter === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Mới
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Khách hàng</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Loại</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tổng booking</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Tổng chi tiêu</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Booking cuối</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Ngày tham gia</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr 
                key={customer.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{customer.email}</p>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <CustomerBadge customerType={customer.customerType} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">{customer.totalBookings}</span>
                    </div>
                    <span className="text-gray-600">booking</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{formatDate(customer.lastBookingDate)}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-600">{formatDate(customer.joinDate)}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDetails(customer.id, customer)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleContactCustomer(customer.email)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Gửi email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    {customer.phone && (
                      <button 
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Gọi điện"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {filteredCustomers.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khách hàng</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Hiển thị {filteredCustomers.length} trên {customers.length} khách hàng
        </span>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-300 rounded-2xl hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 border border-gray-300 rounded-2xl hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerListTable;