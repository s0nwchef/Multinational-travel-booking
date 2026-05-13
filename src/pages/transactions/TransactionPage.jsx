import React, { useState, useEffect } from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import PageHeader from './components/PageHeader';
import TransactionFilters from './sections/TransactionFilters';
import TransactionListSection from './sections/TransactionListSection';
import RightSidebar from './sections/RightSidebar';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile.js';
import authService from '../../services/authService.js';

const TransactionPage = () => {
  const { user } = useCurrentUserProfile();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5
  });

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const session = authService.getSession();
      if (!session?.sessionId) return;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`http://localhost:3000/api/bookings/user?${params}`, {
        headers: {
          'Authorization': session.sessionId
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.bookings || []);
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
          itemsPerPage: 5
        });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    fetchTransactions(page);
  };

  const handleExportCSV = async () => {
    try {
      const session = authService.getSession();
      if (!session?.sessionId) return;

      const params = new URLSearchParams({
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`http://localhost:3000/api/bookings/user/export?${params}`, {
        headers: {
          'Authorization': session.sessionId
        }
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-8 pt-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <PageHeader onExportCSV={handleExportCSV} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />
              <TransactionListSection 
                transactions={transactions} 
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="md:col-span-1">
              <RightSidebar user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionPage;
