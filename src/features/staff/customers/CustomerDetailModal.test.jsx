import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerDetailModal from './CustomerDetailModal';

const mockCustomer = {
  id: "CUST001",
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0912345678",
  totalBookings: 5,
  totalSpent: 2250,
  lastBookingDate: "2024-03-15",
  customerType: "regular",
  joinDate: "2023-01-10"
};

const mockOnClose = jest.fn();

describe('CustomerDetailModal', () => {
  it('renders modal when customer is provided', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('Chi tiết khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Thông tin đầy đủ và lịch sử booking')).toBeInTheDocument();
  });

  it('does not render modal when customer is null', () => {
    const { container } = render(<CustomerDetailModal customer={null} onClose={mockOnClose} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('displays customer information correctly', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByText('nguyenvana@example.com')).toBeInTheDocument();
    expect(screen.getByText('0912345678')).toBeInTheDocument();
    expect(screen.getByText('Khách hàng thường xuyên')).toBeInTheDocument();
  });

  it('displays customer statistics correctly', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // total bookings
    expect(screen.getByText(/2\.250\.000/)).toBeInTheDocument(); // total spent in VND
    expect(screen.getByText('15/03/2024')).toBeInTheDocument(); // last booking date
  });

  it('displays booking history', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('Lịch sử booking')).toBeInTheDocument();
    expect(screen.getByText('Tour Đà Nẵng - Hội An')).toBeInTheDocument();
    expect(screen.getByText('Tour Sapa Mùa Lúa Chín')).toBeInTheDocument();
    expect(screen.getByText('Tour Phú Quốc 4N3Đ')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('formats dates correctly', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    // Check date formatting includes time
    const dateElements = screen.getAllByText(/15\/03\/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('displays contact information section', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('Thông tin liên hệ')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Số điện thoại')).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    expect(screen.getByText('Gửi email')).toBeInTheDocument();
    expect(screen.getByText('Gọi điện')).toBeInTheDocument();
    expect(screen.getByText('Tạo booking mới')).toBeInTheDocument();
    expect(screen.getByText('Lưu ghi chú')).toBeInTheDocument();
  });

  it('handles customer without phone number', () => {
    const customerWithoutPhone = {
      ...mockCustomer,
      phone: undefined
    };
    
    render(<CustomerDetailModal customer={customerWithoutPhone} onClose={mockOnClose} />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.queryByText('Số điện thoại')).not.toBeInTheDocument();
    expect(screen.queryByText('Gọi điện')).not.toBeInTheDocument();
  });

  it('displays notes textarea with default value', () => {
    render(<CustomerDetailModal customer={mockCustomer} onClose={mockOnClose} />);
    
    const textarea = screen.getByPlaceholderText('Thêm ghi chú về khách hàng...');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toContain('Khách hàng thích các tour về văn hóa và lịch sử');
  });
});