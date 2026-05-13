import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  return (
    <div className="flex gap-4 mb-4 text-black items-center">
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <span className="text-gray-400">→</span>
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
