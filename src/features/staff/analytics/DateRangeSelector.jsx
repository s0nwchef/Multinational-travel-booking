import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';

const DateRangeSelector = ({ onDateRangeChange, initialRange = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState(
    initialRange || { 
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0], 
      to: new Date().toISOString().split('T')[0] 
    }
  );
  const [quickRange, setQuickRange] = useState('30days');

  const quickRanges = [
    { id: '7days', label: '7 ngày qua', days: 7 },
    { id: '30days', label: '30 ngày qua', days: 30 },
    { id: '90days', label: '90 ngày qua', days: 90 },
    { id: 'year', label: '1 năm qua', days: 365 },
    { id: 'custom', label: 'Tùy chỉnh', days: null },
  ];

  const handleQuickRangeSelect = (rangeId) => {
    setQuickRange(rangeId);
    
    if (rangeId !== 'custom') {
      const selectedRange = quickRanges.find(r => r.id === rangeId);
      if (selectedRange && selectedRange.days) {
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - selectedRange.days);
        
        const newRange = {
          from: fromDate.toISOString().split('T')[0],
          to: toDate.toISOString().split('T')[0]
        };
        
        setDateRange(newRange);
        if (onDateRangeChange) {
          onDateRangeChange(newRange);
        }
        setIsOpen(false);
      }
    }
  };

  const handleCustomDateChange = (e, field) => {
    const newRange = {
      ...dateRange,
      [field]: e.target.value
    };
    setDateRange(newRange);
    setQuickRange('custom');
  };

  const handleApplyCustomRange = () => {
    if (dateRange.from && dateRange.to) {
      if (onDateRangeChange) {
        onDateRangeChange(dateRange);
      }
      setIsOpen(false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDisplayText = () => {
    if (quickRange === 'custom') {
      return `${formatDateDisplay(dateRange.from)} - ${formatDateDisplay(dateRange.to)}`;
    }
    
    const selected = quickRanges.find(r => r.id === quickRange);
    return selected ? selected.label : 'Chọn khoảng thời gian';
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{getDisplayText()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-500" />
              <h4 className="font-semibold text-gray-900">Lọc theo thời gian</h4>
            </div>

            {/* Quick Range Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng thời gian nhanh
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => handleQuickRangeSelect(range.id)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${quickRange === range.id 
                        ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoảng thời gian tùy chỉnh
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => handleCustomDateChange(e, 'from')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => handleCustomDateChange(e, 'to')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Date Validation */}
              {dateRange.from && dateRange.to && new Date(dateRange.from) > new Date(dateRange.to) && (
                <p className="mt-2 text-xs text-red-600">
                  Ngày bắt đầu không thể lớn hơn ngày kết thúc
                </p>
              )}
            </div>

            {/* Selected Range Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Khoảng thời gian đã chọn</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDateDisplay(dateRange.from)} - {formatDateDisplay(dateRange.to)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dateRange.from && dateRange.to 
                      ? `${Math.ceil((new Date(dateRange.to) - new Date(dateRange.from)) / (1000 * 60 * 60 * 24))} ngày`
                      : 'Chưa chọn ngày'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Định dạng</p>
                  <p className="text-sm font-medium text-gray-900">DD/MM/YYYY</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyCustomRange}
                disabled={!dateRange.from || !dateRange.to || new Date(dateRange.from) > new Date(dateRange.to)}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${(!dateRange.from || !dateRange.to || new Date(dateRange.from) > new Date(dateRange.to))
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                  }
                `}
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-2xl">
            <p className="text-xs text-gray-600">
              Lọc sẽ được áp dụng cho tất cả biểu đồ và báo cáo trên trang này.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;