import React from 'react';
import SecurityTipsCard from '../components/SecurityTipsCard';
import ActivityCard from '../components/ActivityCard';

const RightSidebar = () => {
  return (
    <div className="space-y-6">
      <SecurityTipsCard />
      <ActivityCard />
    </div>
  );
};

export default RightSidebar;
