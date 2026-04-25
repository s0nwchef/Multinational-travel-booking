import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';
import TourListTable from '../../features/staff/tours/TourListTable';
import TourFilters from '../../features/staff/tours/TourFilters';
import TourStatusBadge from '../../features/staff/tours/TourStatusBadge';
import staffService from '../../services/staffService.js';

const TourManagementPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchTours();
  }, [selectedStatus, searchQuery, pagination.page, sortBy]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10,
        sort: sortBy,
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        ...(searchQuery && { search: searchQuery })
      };
      
      const response = await staffService.getTours(params);
      setTours(response.tours || []);
      setPagination(prev => ({
        ...prev,
        ...response.pagination
      }));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tours:', err);
      setError('Không thể tải danh sách tour');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = () => {
    navigate('/staff/tours/new');
  };

  const handleExport = async () => {
    try {
      await staffService.exportData('tours');
      alert('Xuất dữ liệu tour thành công!');
    } catch (err) {
      alert('Xuất dữ liệu thất bại');
    }
  };

  const handleEditTour = (tourId) => {
    navigate(`/staff/tours/${tourId}/edit`);
  };

  const handleDeleteTour = async (tourId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tour này?')) return;
    
    try {
      await staffService.deleteTour(tourId);
      alert('Xóa tour thành công!');
      fetchTours();
    } catch (err) {
      alert('Xóa tour thất bại: ' + err.message);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: pagination.total },
    { value: 'active', label: 'Đang hoạt động', count: tours.filter(t => t.status === 'active').length },
    { value: 'draft', label: 'Bản nháp', count: tours.filter(t => t.status === 'draft').length },
    { value: 'archived', label: 'Đã lưu trữ', count: tours.filter(t => t.status === 'archived').length }
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tour</h1>
          <p className="text-gray-500 mt-2">Quản lý và tổ chức các tour du lịch</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
          <button 
            onClick={handleCreateTour}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo tour mới
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
          <button onClick={fetchTours} className="mt-2 text-orange-600 hover:underline">
            Thử lại
          </button>
        </div>
      )}

      {/* Stats Summary */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusOptions.map((status) => (
              <div 
                key={status.value}
                className={`p-4 rounded-2xl border ${
                  selectedStatus === status.value 
                    ? 'border-orange-300 bg-orange-50' 
                    : 'border-gray-200 bg-white'
                } cursor-pointer hover:border-orange-300 transition-colors`}
                onClick={() => setSelectedStatus(status.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{status.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{status.count}</p>
                  </div>
                  {selectedStatus === status.value && (
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  )}
                </div>
              </div>
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
                    placeholder="Tìm kiếm tour theo tên hoặc điểm đến..."
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
                <TourFilters 
                  onFilterChange={(filters) => console.log('Filters:', filters)}
                />
              </div>
            )}

            {/* Tour List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 font-medium">
                    Hiển thị {tours.length} tour
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
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="popular">Phổ biến nhất</option>
                  </select>
                </div>
              </div>

              <TourListTable 
                tours={tours} 
                onEdit={handleEditTour}
                onDelete={handleDeleteTour}
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
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
                <p className="text-gray-600">Quản lý tour hiệu quả với các công cụ</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                  Xem báo cáo
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium transition-colors">
                  Phân tích hiệu suất
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TourManagementPage;