import React from 'react';
import SummaryCard from '../components/SummaryCard';
import HelpCard from '../components/HelpCard';

const RightSidebar = () => {
  return (
    <div className="space-y-6">
      <SummaryCard />
      <HelpCard />
    </div>
  );
};

export default RightSidebar;
