import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Check } from 'lucide-react';

const ExportButton = ({ 
  onExport, 
  exportTypes = ['CSV', 'PDF', 'Excel'],
  defaultDateRange = { from: '', to: '' }
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('CSV');
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      
      // Call the onExport callback with selected options
      if (onExport) {
        onExport({
          type: selectedType,
          dateRange,
          timestamp: new Date().toISOString()
        });
      }

      // Reset exported state after 3 seconds
      setTimeout(() => {
        setExported(false);
        setIsOpen(false);
      }, 3000);
    }, 1500);
  };

  const handleDateChange = (e, field) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'CSV':
        return <FileText className="w-4 h-4" />;
      case 'PDF':
        return <FileText className="w-4 h-4" />;
      case 'Excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-medium
          transition-all duration-200
          ${exported 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
          }
        `}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-orange-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang xuất...</span>
          </>
        ) : exported ? (
          <>
            <Check className="w-4 h-4" />
            <span>Đã xuất thành công!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && !exported && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            {/* Header */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">Xuất báo cáo</h4>
              <p className="text-sm text-gray-500">Chọn định dạng và phạm vi thời gian</p>
            </div>

            {/* Export Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Định dạng
              </label>
              <div className="flex gap-2">
                {exportTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                      transition-all duration-200
                      ${selectedType === type 
                        ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {getIconForType(type)}
                    <span className="text-sm font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phạm vi thời gian
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => handleDateChange(e, 'from')}
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
                      onChange={(e) => handleDateChange(e, 'to')}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const lastWeek = new Date();
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    const lastWeekStr = lastWeek.toISOString().split('T')[0];
                    setDateRange({ from: lastWeekStr, to: today });
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700"
                >
                  7 ngày qua
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const lastMonth = new Date();
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    const lastMonthStr = lastMonth.toISOString().split('T')[0];
                    setDateRange({ from: lastMonthStr, to: today });
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700"
                >
                  30 ngày qua
                </button>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const lastYear = new Date();
                    lastYear.setFullYear(lastYear.getFullYear() - 1);
                    const lastYearStr = lastYear.toISOString().split('T')[0];
                    setDateRange({ from: lastYearStr, to: today });
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700"
                >
                  1 năm qua
                </button>
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
                onClick={handleExport}
                disabled={isExporting || (!dateRange.from || !dateRange.to)}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${(!dateRange.from || !dateRange.to) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                  }
                `}
              >
                {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
              </button>
            </div>
          </div>

          {/* Export Info */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
            <p className="text-xs text-gray-600">
              Báo cáo sẽ được tải xuống ở định dạng {selectedType}. 
              {selectedType === 'CSV' && ' Có thể mở bằng Excel hoặc Google Sheets.'}
              {selectedType === 'PDF' && ' Có thể in hoặc chia sẻ dễ dàng.'}
              {selectedType === 'Excel' && ' Bao gồm các sheet phân tích chi tiết.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;