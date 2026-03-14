import React from 'react';
import PageHeader from './components/PageHeader';
import TransactionFilters from './sections/TransactionFilters';
import TransactionListSection from './sections/TransactionListSection';
import RightSidebar from './sections/RightSidebar';

const TransactionPage = () => {
  return (
    <div className="p-6 bg-[#F6F7F8]">
      <PageHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TransactionFilters />
          <TransactionListSection />
        </div>
        <div className="md:col-span-1">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
