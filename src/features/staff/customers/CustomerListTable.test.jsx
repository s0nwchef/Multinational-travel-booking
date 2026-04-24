import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerListTable from './CustomerListTable';

const mockCustomers = [
  {
    id: "CUST001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    totalBookings: 5,
    totalSpent: 2250,
    lastBookingDate: "2024-03-15",
    customerType: "regular",
    joinDate: "2023-01-10"
  },
  {
    id: "CUST002",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    totalBookings: 0,
    totalSpent: 0,
    lastBookingDate: null,
    customerType: "prospect",
    joinDate: "2024-02-20"
  }
];

describe('CustomerListTable', () => {
  it('displays all customer columns correctly', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    // Check table headers
    expect(screen.getByText('Khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Loại')).toBeInTheDocument();
    expect(screen.getByText('Tổng booking')).toBeInTheDocument();
    expect(screen.getByText('Tổng chi tiêu')).toBeInTheDocument();
    expect(screen.getByText('Booking cuối')).toBeInTheDocument();
    expect(screen.getByText('Ngày tham gia')).toBeInTheDocument();
    expect(screen.getByText('Hành động')).toBeInTheDocument();
  });

  it('displays customer data correctly', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    // Check first customer data
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByText('nguyenvana@example.com')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // total bookings
    expect(screen.getByText('0912345678')).toBeInTheDocument();
    
    // Check second customer data
    expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
    expect(screen.getByText('tranthib@example.com')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // total bookings
  });

  it('formats currency correctly', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    // Check currency formatting (VND format)
    expect(screen.getByText(/2\.250\.000/)).toBeInTheDocument(); // 2,250,000 VND
  });

  it('formats dates correctly', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    // Check date formatting (Vietnamese format)
    expect(screen.getByText('15/03/2024')).toBeInTheDocument(); // last booking date
    expect(screen.getByText('10/01/2023')).toBeInTheDocument(); // join date
    expect(screen.getByText('Chưa có booking')).toBeInTheDocument(); // null date
  });

  it('filters customers by search term', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên hoặc email...');
    fireEvent.change(searchInput, { target: { value: 'Nguyễn' } });
    
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.queryByText('Trần Thị B')).not.toBeInTheDocument();
  });

  it('filters customers by type', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    const regularButton = screen.getByText('Thường xuyên');
    fireEvent.click(regularButton);
    
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.queryByText('Trần Thị B')).not.toBeInTheDocument();
  });

  it('shows empty state when no customers match filter', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    const searchInput = screen.getByPlaceholderText('Tìm kiếm theo tên hoặc email...');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Customer' } });
    
    expect(screen.getByText('Không tìm thấy khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Thử thay đổi bộ lọc hoặc tìm kiếm khác')).toBeInTheDocument();
  });

  it('displays correct pagination info', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    expect(screen.getByText('Hiển thị 2 trên 2 khách hàng')).toBeInTheDocument();
  });

  it('handles customer type badges correctly', () => {
    render(<CustomerListTable customers={mockCustomers} />);
    
    expect(screen.getByText('Khách hàng thường xuyên')).toBeInTheDocument();
    expect(screen.getByText('Khách hàng tiềm năng')).toBeInTheDocument();
  });
});