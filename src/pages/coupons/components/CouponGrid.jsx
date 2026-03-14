import React from 'react';
import CouponCard from './CouponCard';

const CouponGrid = ({ coupons }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {coupons.map(coupon => (
        <CouponCard key={coupon.id} {...coupon} />
      ))}
    </div>
  );
};

export default CouponGrid;
