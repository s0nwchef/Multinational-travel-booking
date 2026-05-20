import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Loader2 } from 'lucide-react';
import CustomerListTable from '../../features/staff/customers/CustomerListTable';
import CustomerDetailModal from '../../features/staff/customers/CustomerDetailModal';
import staffService from '../../services/staffService.js';
import { formatUsd } from '../../utils/currency.js';

const CustomerManagementPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, pagination.page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...(searchQuery && { search: searchQuery }),
      };

      const response = await staffService.getCustomers(params);
      setCustomers(response.customers || []);
      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomerDetails = (customerId) => {
    const customer = customers.find((c) => c._id === customerId || c.id === customerId);
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleExportCustomers = async () => {
    try {
      await staffService.exportData('customers');
      alert('Xuất dữ liệu khách hàng thành công!');
    } catch {
      alert('Xuất dữ liệu thất bại');
    }
  };

  const handleAddCustomer = () => {
    alert('Thêm khách hàng mới - tính năng đang phát triển');
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const totalSpent = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);
  const topCustomer =
    customers.length > 0
      ? [...customers].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))[0]
      : null;

  return (
    <div className="space-y-8">
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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchCustomers} className="mt-2 text-orange-600 hover:underline">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-gray-500">so với tháng trước</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng thường xuyên</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.customerType === 'regular').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500">tỷ lệ giữ chân</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng tiềm năng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.customerType === 'prospect').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-gray-500">tăng trưởng</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{formatUsd(totalSpent, '$0')}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">+18%</span>
                <span className="text-gray-500">so với tháng trước</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <CustomerListTable
              customers={customers.map((customer) => ({
                ...customer,
                onViewDetails: () => handleViewCustomerDetails(customer._id || customer.id),
              }))}
            />

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

          {showDetailModal && (
            <CustomerDetailModal customer={selectedCustomer} onClose={() => setShowDetailModal(false)} />
          )}

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights về khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500">Khách hàng có giá trị cao nhất</p>
                <p className="font-semibold text-gray-900">{topCustomer?.fullName || 'N/A'}</p>
                <p className="text-sm text-gray-600">{formatUsd(topCustomer?.totalSpent || 0, '$0')}</p>
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
        </>
      )}
    </div>
  );
};

export default CustomerManagementPage;
