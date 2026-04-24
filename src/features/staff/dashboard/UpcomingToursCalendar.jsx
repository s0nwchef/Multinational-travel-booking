import React from 'react';
import { Calendar, Users, MapPin, ChevronRight } from 'lucide-react';

const UpcomingToursCalendar = ({ tours }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const getSeatPercentage = (seats, totalSeats) => {
    return Math.round((seats / totalSeats) * 100);
  };

  const getSeatColor = (percentage) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tour sắp tới</h3>
            <p className="text-sm text-gray-500">Lịch trình trong 30 ngày tới</p>
          </div>
        </div>
        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
          Xem lịch
        </button>
      </div>

      <div className="space-y-4">
        {tours.map((tour) => {
          const seatPercentage = getSeatPercentage(tour.seats, tour.totalSeats);
          const seatColor = getSeatColor(seatPercentage);
          
          return (
            <div 
              key={tour.id}
              className="group p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <h4 className="font-medium text-gray-900">{tour.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(tour.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tour.seats}/{tour.totalSeats} chỗ</span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Tỷ lệ đặt chỗ</span>
                  <span>{seatPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${seatColor} rounded-full transition-all duration-500`}
                    style={{ width: `${seatPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new tour button */}
      <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/30 rounded-xl text-gray-500 hover:text-orange-600 transition-all duration-300 flex items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center">
          <span className="text-lg">+</span>
        </div>
        <span className="font-medium">Thêm tour mới</span>
      </button>
    </div>
  );
};

export default UpcomingToursCalendar;