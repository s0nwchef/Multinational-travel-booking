import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

const ActivityItem = ({ merchant, amount, icon }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/*<FiCreditCard className="mr-2 text-gray-600" />*/}
          <img src={icon} alt="icon" className="mr-2" />

        <span>{merchant}</span>
      </div>
      <span className="font-semibold">{amount}</span>
    </div>
  );
};

export default ActivityItem;
