import React from 'react';

const CouponStatusBadge = ({ status }) => {
  let classes = 'px-3 py-1 rounded-full text-xs font-medium';
  if (status === 'ACTIVE') {
    classes += ' bg-green-100 text-green-600';
  } else if (status === 'INACTIVE') {
    classes += ' bg-gray-200 text-gray-500';
  } else if (status === 'EXPIRED') {
    classes += ' bg-gray-200 text-gray-500';
  } else if (status === 'Bronze') {
    classes += ' bg-orange-100 text-orange-700';
  } else if (status === 'Silver') {
    classes += ' bg-slate-100 text-slate-600';
  } else if (status === 'Gold') {
    classes += ' bg-yellow-100 text-amber-700';
  } else if (status === 'Platium') {
    classes += ' bg-cyan-100 text-sky-700';
  } else if (status === 'Diamond') {
    classes += ' bg-violet-100 text-violet-700';
  }
  return <span className={classes}>{status}</span>;
};

export default CouponStatusBadge;
