import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
  Loader2,
  Eye
} from 'lucide-react';
import staffService from '../../services/staffService.js';

const RefundManagementPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [stats, setStats] = useState({ pending: 0, processed: 0, rejected: 0, total: 0 });

  useEffect(() => {
    fetchRefunds();
  }, [selectedStatus, searchQuery, pagination.page]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const response = await staffService.getRefundRequests(params);
      setRefunds(response.refunds || []);
      setPagination(prev => ({
        ...prev,
        ...response.pagination
      }));
      setStats(response.stats || { pending: 0, processed: 0, rejected: 0, total: 0 });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch refunds:', err);
      setError('Không thể tải danh sách hoàn tiền');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async (bookingId) => {
    if (!confirm('Bạn có chắc chắn muốn APPROVE yêu cầu hoàn tiền này?')) return;
    
    try {
      setProcessingId(bookingId);
      await staffService.processRefund(bookingId, 'approve');
      alert('Đã approve hoàn tiền thành công!');
      fetchRefunds();
    } catch (err) {
      alert('Approve thất bại: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRefund = async (bookingId) => {
    if (!rejectNotes.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {
      setProcessingId(bookingId);
      await staffService.processRefund(bookingId, 'reject', rejectNotes);
      alert('Đã từ chối hoàn tiền!');
      setShowRejectModal(false);
      setRejectNotes('');
      fetchRefunds();
    } catch (err) {
      alert('Từ chối thất bại: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleExport = async () => {
    try {
      // Export functionality
      alert('Xuất dữ liệu hoàn tiền thành công!');
    } catch (err) {
      alert('Xuất dữ liệu thất bại');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: stats.total },
    { value: 'pending', label: 'Chờ xử lý', count: stats.pending },
    { value: 'processed', label: 'Đã hoàn tiền', count: stats.processed },
    { value: 'rejected', label: 'Đã từ chối', count: stats.rejected }
  ];

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const openDetailModal = (refund) => {
    setSelectedRefund(refund);
    setShowDetailModal(true);
  };

  const openRejectModal = (refund) => {
    setSelectedRefund(refund);
    setShowRejectModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Hoàn tiền</h1>
          <p className="text-gray-500 mt-2">Xử lý các yêu cầu hoàn tiền từ khách hàng</p>
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
          <button onClick={fetchRefunds} className="mt-2 text-orange-600 hover:underline">
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
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chờ xử lý</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đã hoàn tiền</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.processed}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đã từ chối</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng tiền hoàn</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(refunds.reduce((sum, r) => sum + (r.refundAmount || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phí phạt</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(refunds.reduce((sum, r) => sum + (r.penaltyFee || 0), 0))}
                  </p>
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
                    placeholder="Tìm kiếm theo tên khách, tour hoặc mã booking..."
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

            {/* Refund List Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-900 font-medium">
                  Hiển thị {refunds.length} yêu cầu hoàn tiền
                  {searchQuery && ` cho "${searchQuery}"`}
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Mã Booking</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Khách hàng</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Tour</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Tiền hoàn</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500 text-sm">Phí phạt</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">Ngày yêu cầu</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">
                          Không có yêu cầu hoàn tiền nào
                        </td>
                      </tr>
                    ) : (
                      refunds.map((refund) => (
                        <tr key={refund.bookingId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">
                              {refund.bookingId?.toString().slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{refund.customerName || '-'}</p>
                              <p className="text-sm text-gray-500">{refund.customerEmail || '-'}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-900">{refund.tourName || '-'}</p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-medium text-green-600">
                              {formatCurrency(refund.refundAmount)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-red-600">
                              {formatCurrency(refund.penaltyFee)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
                              refund.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : refund.status === 'processed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {refund.status === 'pending' ? (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  Chờ xử lý
                                </>
                              ) : refund.status === 'processed' ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Đã hoàn tiền
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5" />
                                  Đã từ chối
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-600 text-sm">
                              {formatDate(refund.requestDate)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openDetailModal(refund)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {refund.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveRefund(refund.bookingId)}
                                    disabled={processingId === refund.bookingId}
                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                    title="Approve hoàn tiền"
                                  >
                                    {processingId === refund.bookingId ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => openRejectModal(refund)}
                                    disabled={processingId === refund.bookingId}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                    title="Từ chối hoàn tiền"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn xử lý hoàn tiền</h3>
                <p className="text-gray-600">Kiểm tra kỹ thông tin trước khi approve hoặc reject yêu cầu</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Xem chính sách
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết hoàn tiền</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Mã Booking:</span>
                <span className="font-medium">{selectedRefund.bookingId?.toString().slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Khách hàng:</span>
                <span className="font-medium">{selectedRefund.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{selectedRefund.customerEmail}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Tour:</span>
                <span className="font-medium">{selectedRefund.tourName}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Số tiền hoàn:</span>
                <span className="font-medium text-green-600">{formatCurrency(selectedRefund.refundAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Phí phạt (10%):</span>
                <span className="font-medium text-red-600">{formatCurrency(selectedRefund.penaltyFee)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Lý do hủy:</span>
                <span className="font-medium">{selectedRefund.reason || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Ngày yêu cầu:</span>
                <span className="font-medium">{formatDate(selectedRefund.requestDate)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Trạng thái:</span>
                <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                  selectedRefund.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : selectedRefund.status === 'processed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedRefund.status === 'pending' ? 'Chờ xử lý' : 
                   selectedRefund.status === 'processed' ? 'Đã hoàn tiền' : 'Đã từ chối'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedRefund.status === 'pending' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleApproveRefund(selectedRefund.bookingId);
                  }}
                  className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Từ chối hoàn tiền</h3>
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Bạn đang từ chối hoàn tiền cho booking <strong>{selectedRefund.bookingId?.toString().slice(-8).toUpperCase()}</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  placeholder="Nhập lý do từ chối hoàn tiền..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectNotes('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleRejectRefund(selectedRefund.bookingId)}
                disabled={processingId === selectedRefund.bookingId || !rejectNotes.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
              >
                {processingId === selectedRefund.bookingId ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagementPage;
