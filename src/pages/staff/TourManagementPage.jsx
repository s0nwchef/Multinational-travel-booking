import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Filter, 
  Search, 
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import TourListTable from '../../features/staff/tours/TourListTable';
import TourFilters from '../../features/staff/tours/TourFilters';
import TourStatusBadge from '../../features/staff/tours/TourStatusBadge';

const TourManagementPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const sampleTours = [
    {
      id: "TOUR001",
      name: "Tour Đà Nẵng - Hội An 3N2Đ",
      status: "active",
      price: 450,
      bookings: 24,
      rating: 4.8,
      destination: "Đà Nẵng, Hội An",
      duration: 3,
      createdAt: "2024-01-15"
    },
    {
      id: "TOUR002",
      name: "Tour Sapa Mùa Lúa Chín",
      status: "draft",
      price: 320,
      bookings: 0,
      rating: 0,
      destination: "Sapa",
      duration: 2,
      createdAt: "2024-02-20"
    },
    {
      id: "TOUR003",
      name: "Tour Phú Quốc 4N3Đ",
      status: "active",
      price: 680,
      bookings: 18,
      rating: 4.5,
      destination: "Phú Quốc",
      duration: 4,
      createdAt: "2024-01-10"
    },
    {
      id: "TOUR004",
      name: "Tour Nha Trang - Đà Lạt",
      status: "archived",
      price: 520,
      bookings: 32,
      rating: 4.2,
      destination: "Nha Trang, Đà Lạt",
      duration: 5,
      createdAt: "2023-12-05"
    },
    {
      id: "TOUR005",
      name: "Tour Hạ Long - Cát Bà",
      status: "active",
      price: 380,
      bookings: 15,
      rating: 4.7,
      destination: "Hạ Long, Cát Bà",
      duration: 2,
      createdAt: "2024-02-28"
    },
    {
      id: "TOUR006",
      name: "Tour Huế - Đông Hà",
      status: "draft",
      price: 290,
      bookings: 0,
      rating: 0,
      destination: "Huế, Đông Hà",
      duration: 3,
      createdAt: "2024-03-10"
    },
    {
      id: "TOUR007",
      name: "Tour Mũi Né - Phan Thiết",
      status: "active",
      price: 410,
      bookings: 22,
      rating: 4.6,
      destination: "Mũi Né, Phan Thiết",
      duration: 3,
      createdAt: "2024-01-25"
    },
    {
      id: "TOUR008",
      name: "Tour Cần Thơ - Mekong",
      status: "active",
      price: 350,
      bookings: 19,
      rating: 4.4,
      destination: "Cần Thơ, Mekong",
      duration: 2,
      createdAt: "2024-02-15"
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: sampleTours.length },
    { value: 'active', label: 'Đang hoạt động', count: sampleTours.filter(t => t.status === 'active').length },
    { value: 'draft', label: 'Bản nháp', count: sampleTours.filter(t => t.status === 'draft').length },
    { value: 'archived', label: 'Đã lưu trữ', count: sampleTours.filter(t => t.status === 'archived').length }
  ];

  const filteredTours = sampleTours.filter(tour => {
    if (selectedStatus !== 'all' && tour.status !== selectedStatus) return false;
    if (searchQuery && !tour.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tour.destination.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateTour = () => {
    navigate('/staff/tours/new');
  };

  const handleExport = () => {
    console.log('Export tour data');
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

      {/* Stats Summary */}
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
                Hiển thị {filteredTours.length} tour
                {searchQuery && ` cho "${searchQuery}"`}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sắp xếp theo:</span>
              <select className="border-none bg-transparent font-medium text-gray-900 focus:outline-none">
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          <TourListTable tours={filteredTours} />
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
    </div>
  );
};

export default TourManagementPage;