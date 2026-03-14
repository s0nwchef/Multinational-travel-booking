import React from 'react';

const ProgressBar = ({ value, max }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;
