import React, { useState } from 'react';
import { X } from 'lucide-react';

const TourFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    duration: '',
    destination: '',
    rating: 0,
    dateRange: {
      from: '',
      to: ''
    }
  });

  const destinations = [
    'Đà Nẵng', 'Hội An', 'Sapa', 'Phú Quốc', 'Nha Trang', 
    'Đà Lạt', 'Hạ Long', 'Huế', 'Mũi Né', 'Cần Thơ'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 1000],
      duration: '',
      destination: '',
      rating: 0,
      dateRange: { from: '', to: '' }
    };
    setFilters(resetFilters);
    onFilterChange && onFilterChange(resetFilters);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá (USD)
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>$0</span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </span>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời lượng (ngày)
          </label>
          <select
            value={filters.duration}
            onChange={(e) => handleFilterChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          >
            <option value="">Tất cả</option>
            <option value="1">1 ngày</option>
            <option value="2">2 ngày</option>
            <option value="3">3 ngày</option>
            <option value="4">4 ngày</option>
            <option value="5">5+ ngày</option>
          </select>
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Điểm đến
          </label>
          <select
            value={filters.destination}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          >
            <option value="">Tất cả</option>
            {destinations.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá tối thiểu
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleFilterChange('rating', star)}
                className={`text-2xl ${
                  star <= filters.rating 
                    ? 'text-yellow-500' 
                    : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {filters.rating > 0 ? `${filters.rating}+ sao` : 'Tất cả'}
            </span>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.dateRange.from}
            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, from: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.dateRange.to}
            onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {filters.priceRange[1] < 1000 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm">
              Giá: ${filters.priceRange[0]}-${filters.priceRange[1]}
              <button
                onClick={() => handleFilterChange('priceRange', [0, 1000])}
                className="ml-1 hover:text-orange-700"
              >
                ×
              </button>
            </span>
          )}
          {filters.duration && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm">
              Thời lượng: {filters.duration} ngày
              <button
                onClick={() => handleFilterChange('duration', '')}
                className="ml-1 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          )}
          {filters.destination && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm">
              Điểm đến: {filters.destination}
              <button
                onClick={() => handleFilterChange('destination', '')}
                className="ml-1 hover:text-green-700"
              >
                ×
              </button>
            </span>
          )}
          {filters.rating > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-sm">
              Đánh giá: {filters.rating}+ sao
              <button
                onClick={() => handleFilterChange('rating', 0)}
                className="ml-1 hover:text-yellow-700"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourFilters;