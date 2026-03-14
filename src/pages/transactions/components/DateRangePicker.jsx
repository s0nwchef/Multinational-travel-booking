import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const DateRangePicker = () => {
  return (
    <div className="flex gap-4 mb-4 text-black">
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          placeholder="Start Date"
          className="border border-gray-300 rounded-lg px-3 py-2 pl-10"
        />
      </div>
        <span> _ </span>
      <div className="relative">
        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="date"
          placeholder="End Date"
          className="border border-gray-300 rounded-lg px-3 py-2 pl-10"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
