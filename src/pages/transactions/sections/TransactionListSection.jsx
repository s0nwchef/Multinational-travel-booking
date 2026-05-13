import React from 'react';
import TransactionTable from '../components/TransactionTable';
import TablePagination from '../components/TablePagination';
import bed from '../img/bed.png';

const TransactionListSection = ({ transactions, loading, pagination, onPageChange }) => {
  // Map database transactions to display format
  const mappedTransactions = transactions.map(t => {
    // Map payment status
    const statusMap = {
      'paid': 'Successful',
      'unpaid': 'Processing',
      'refunded': 'Refunded'
    };

    // Format date
    const date = t.ngay_tao ? new Date(t.ngay_tao).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }) : 'N/A';

    // Format amount
    const amount = t.tong_tien_cuoi ? 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.tong_tien_cuoi) : 
      '$0.00';

    return {
      id: t._id,
      date,
      orderId: t.ma_dat_tour || `#${t._id?.slice(-6)}`,
      service: 'Tour',
      serviceImage: bed,
      paymentMethod: 'Mastercard',
      amount,
      status: statusMap[t.trang_thai_thanh_toan] || 'Processing',
      rawStatus: t.trang_thai_thanh_toan
    };
  });

  return (
    <div>
      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          Đang tải dữ liệu...
        </div>
      ) : mappedTransactions.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          Không có giao dịch nào
        </div>
      ) : (
        <TransactionTable transactions={mappedTransactions} />
      )}
      <TablePagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default TransactionListSection;
