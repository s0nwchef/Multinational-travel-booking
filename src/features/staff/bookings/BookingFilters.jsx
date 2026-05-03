import React, { useState } from 'react';
import { X } from 'lucide-react';

const BookingFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: {
      from: '',
      to: ''
    },
    tour: '',
    customer: '',
    minAmount: '',
    maxAmount: ''
  });

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
    { value: 'paid', label: 'Paid' },
    { value: 'refund_pending', label: 'Refund Pending' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = { ...filters.dateRange, [key]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      dateRange: { from: '', to: '' },
      tour: '',
      customer: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(resetFilters);
    onFilterChange && onFilterChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return filters.status !== '' || 
           filters.dateRange.from !== '' || 
           filters.dateRange.to !== '' || 
           filters.tour !== '' || 
           filters.customer !== '' || 
           filters.minAmount !== '' || 
           filters.maxAmount !== '';
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Booking Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tour Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tour
          </label>
          <input
            type="text"
            placeholder="Search tour name..."
            value={filters.tour}
            onChange={(e) => handleFilterChange('tour', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          />
        </div>

        {/* Customer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer
          </label>
          <input
            type="text"
            placeholder="Search by customer name..."
            value={filters.customer}
            onChange={(e) => handleFilterChange('customer', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="date"
                placeholder="From"
                value={filters.dateRange.from}
                onChange={(e) => handleDateRangeChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="To"
                value={filters.dateRange.to}
                onChange={(e) => handleDateRangeChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (USD)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm">
                Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.tour && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm">
                Tour: {filters.tour}
                <button
                  onClick={() => handleFilterChange('tour', '')}
                  className="ml-1 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.customer && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-sm">
                Customer: {filters.customer}
                <button
                  onClick={() => handleFilterChange('customer', '')}
                  className="ml-1 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm">
                Date: {filters.dateRange.from || '...'} to {filters.dateRange.to || '...'}
                <button
                  onClick={() => handleDateRangeChange('from', '')}
                  className="ml-1 hover:text-purple-700"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minAmount || filters.maxAmount) && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-sm">
                Price: ${filters.minAmount || '0'} - ${filters.maxAmount || '∞'}
                <button
                  onClick={() => {
                    handleFilterChange('minAmount', '');
                    handleFilterChange('maxAmount', '');
                  }}
                  className="ml-1 hover:text-yellow-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;