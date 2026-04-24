import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerBadge from './CustomerBadge';

describe('CustomerBadge', () => {
  it('displays correct text and styling for regular customer', () => {
    render(<CustomerBadge customerType="regular" />);
    
    const badge = screen.getByText('Khách hàng thường xuyên');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-green-600');
    expect(badge).toHaveClass('bg-green-50');
  });

  it('displays correct text and styling for prospect customer', () => {
    render(<CustomerBadge customerType="prospect" />);
    
    const badge = screen.getByText('Khách hàng tiềm năng');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-yellow-600');
    expect(badge).toHaveClass('bg-yellow-50');
  });

  it('displays correct text and styling for new customer', () => {
    render(<CustomerBadge customerType="new" />);
    
    const badge = screen.getByText('Khách hàng mới');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-blue-600');
    expect(badge).toHaveClass('bg-blue-50');
  });

  it('uses default styling for unknown customer type', () => {
    render(<CustomerBadge customerType="unknown" />);
    
    const badge = screen.getByText('Khách hàng mới');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-blue-600');
    expect(badge).toHaveClass('bg-blue-50');
  });

  it('has correct border radius and font styling', () => {
    render(<CustomerBadge customerType="regular" />);
    
    const badgeContainer = screen.getByText('Khách hàng thường xuyên').closest('div');
    expect(badgeContainer).toHaveClass('rounded-[0.75rem]');
    expect(badgeContainer).toHaveClass('text-[9px]');
    expect(badgeContainer).toHaveClass('font-black');
  });
});