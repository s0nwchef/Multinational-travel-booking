import React from 'react';

const CouponStatusBadge = ({ status }) => {
  let classes = 'px-3 py-1 rounded-full text-xs font-medium';
  if (status === 'ACTIVE') {
    classes += ' bg-green-100 text-green-600';
  } else if (status === 'USED') {
    classes += ' bg-gray-200 text-gray-500';
  } else if (status === 'EXPIRED') {
    classes += ' bg-gray-200 text-gray-400';
  }
  return <span className={classes}>{status}</span>;
};

export default CouponStatusBadge;
