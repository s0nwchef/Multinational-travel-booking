import React from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import HelpCard from '../components/HelpCard';

const RightSidebar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SummaryCard 
        points={user?.diem ?? user?.loyaltyPoints ?? 1} 
        onViewRewards={() => navigate('/coupons')}
      />
      <HelpCard onContactSupport={() => navigate('/help')} />
    </div>
  );
};

export default RightSidebar;
