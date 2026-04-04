import React from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import PageHeader from './components/PageHeader';
import TransactionFilters from './sections/TransactionFilters';
import TransactionListSection from './sections/TransactionListSection';
import RightSidebar from './sections/RightSidebar';

const TransactionPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
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
      </main>
    </div>
  );
};

export default TransactionPage;
