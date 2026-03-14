import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TablePagination = () => {
  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-600">Showing 1–5 of 24</span>
      <div className="flex gap-2">
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
          <FiChevronLeft />
        </button>
        <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
