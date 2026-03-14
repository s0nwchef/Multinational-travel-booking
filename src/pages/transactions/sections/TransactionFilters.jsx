import React from 'react';
import FilterTabs from '../components/FilterTabs';
import DateRangePicker from '../components/DateRangePicker';

const TransactionFilters = () => {
  return (
    <div>
      <FilterTabs />
      <DateRangePicker />
    </div>
  );
};

export default TransactionFilters;
