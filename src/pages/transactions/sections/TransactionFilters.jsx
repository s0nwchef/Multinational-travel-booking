import React from 'react';
import FilterTabs from '../components/FilterTabs';
import DateRangePicker from '../components/DateRangePicker';

const TransactionFilters = ({ filters, onFilterChange }) => {
  return (
    <div>
      <FilterTabs activeStatus={filters.status} onStatusChange={(status) => onFilterChange({ ...filters, status })} />
      <DateRangePicker 
        startDate={filters.startDate} 
        endDate={filters.endDate}
        onDateChange={(startDate, endDate) => onFilterChange({ ...filters, startDate, endDate })}
      />
    </div>
  );
};

export default TransactionFilters;
