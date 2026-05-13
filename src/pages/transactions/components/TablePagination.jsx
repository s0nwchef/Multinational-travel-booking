import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const startItem = (currentPage - 1) * 5 + 1;
  const endItem = Math.min(currentPage * 5, totalPages * 5);

  return (
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-gray-600">
        Trang {currentPage} / {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft />
        </button>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
