import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerManagementPage from './CustomerManagementPage';

describe('CustomerManagementPage', () => {
  it('renders page title and description', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Quản lý khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Quản lý thông tin và lịch sử booking của khách hàng')).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Xuất dữ liệu')).toBeInTheDocument();
    expect(screen.getByText('Thêm khách hàng')).toBeInTheDocument();
  });

  it('displays customer statistics cards', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Tổng khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Khách hàng thường xuyên')).toBeInTheDocument();
    expect(screen.getByText('Khách hàng tiềm năng')).toBeInTheDocument();
    expect(screen.getByText('Tổng doanh thu')).toBeInTheDocument();
  });

  it('calculates and displays correct statistics', () => {
    render(<CustomerManagementPage />);
    
    // Total customers should be 10 (from sample data)
    expect(screen.getByText('10')).toBeInTheDocument(); // total customers
    
    // Regular customers count
    const regularCount = screen.getAllByText('4'); // 4 regular customers in sample data
    expect(regularCount.length).toBeGreaterThan(0);
    
    // Prospect customers count  
    const prospectCount = screen.getAllByText('3'); // 3 prospect customers in sample data
    expect(prospectCount.length).toBeGreaterThan(0);
  });

  it('displays customer list table', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Danh sách khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Quản lý và tìm kiếm thông tin khách hàng')).toBeInTheDocument();
    
    // Check for some customer names from sample data
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
    expect(screen.getByText('Lê Văn C')).toBeInTheDocument();
  });

  it('handles export customers action', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CustomerManagementPage />);
    
    const exportButton = screen.getByText('Xuất dữ liệu');
    fireEvent.click(exportButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Xuất dữ liệu khách hàng thành công!');
    
    alertSpy.mockRestore();
  });

  it('handles add customer action', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CustomerManagementPage />);
    
    const addButton = screen.getByText('Thêm khách hàng');
    fireEvent.click(addButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Thêm khách hàng mới - tính năng đang phát triển');
    
    alertSpy.mockRestore();
  });

  it('displays sorting dropdown', () => {
    render(<CustomerManagementPage />);
    
    const sortDropdown = screen.getByDisplayValue('Sắp xếp theo: Mới nhất');
    expect(sortDropdown).toBeInTheDocument();
  });

  it('displays customer insights section', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Insights về khách hàng')).toBeInTheDocument();
    expect(screen.getByText('Khách hàng có giá trị cao nhất')).toBeInTheDocument();
    expect(screen.getByText('Tỷ lệ chuyển đổi tiềm năng')).toBeInTheDocument();
    expect(screen.getByText('Tour yêu thích nhất')).toBeInTheDocument();
  });

  it('shows correct customer insights data', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getByText('Phạm Thị D')).toBeInTheDocument(); // highest value customer
    expect(screen.getByText('25%')).toBeInTheDocument(); // conversion rate
    expect(screen.getByText('Đà Nẵng - Hội An')).toBeInTheDocument(); // favorite tour
  });

  it('formats currency in total revenue card', () => {
    render(<CustomerManagementPage />);
    
    // Total revenue should be sum of all customer totalSpent * 1000
    // In sample data: 2250 + 0 + 850 + 3200 + 450 + 0 + 1200 + 0 + 1800 + 500 = 10250
    // 10250 * 1000 = 10,250,000 VND
    expect(screen.getByText(/10\.250\.000/)).toBeInTheDocument();
  });

  it('displays growth percentages in stats cards', () => {
    render(<CustomerManagementPage />);
    
    expect(screen.getAllByText('+12%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+8%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+15%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+18%').length).toBeGreaterThan(0);
  });
});