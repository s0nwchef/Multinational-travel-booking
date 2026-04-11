import React, {useState} from 'react';
import Sidebar from "../../layouts/Sidebar.jsx";
import LoyaltyStatus from './components/LoyaltyStatus';
import CouponTabs from './components/CouponTabs';
import CouponGrid from './components/CouponGrid';
import ReferFriendBanner from './components/ReferFriendBanner';
import  bed  from './img/bed.png'
import plane  from './img/plane.png'
import car from './img/car.png'
import ticket from './img/ticket.png'

const CouponsPage = () => {

    const [activeTab, setActiveTab] = useState('All');

  const coupons = [
    { id: 1, title: '15% OFF', subtitle: 'International Flights', description: 'Save on your next adventure to Europe or Asia. Min spend\n' +
            '$500.', expires: '2026-12-31', code: 'FLY15', status: 'ACTIVE', icon: plane, type: 'Flights' },
    { id: 2, title: '$50 OFF', subtitle: 'Luxury Tour Packages', description: 'Enjoy a discount on premium tour bookings worldwide.', expires: '2026-11-30', code: 'TOUR50', status: 'ACTIVE', icon: bed, type: 'Hotels' },
    { id: 3, title: '20% OFF', subtitle: 'Car Rentals', description: 'Used on rental booking #TR-8892.', expires: '2026-10-15', code: 'CAR20', status: 'USED', icon: car, type: 'Cars' },
    { id: 4, title: 'Free Tkt', subtitle: 'Museum Pass', description: 'Free entry to museums', expires: '2026-09-01', code: 'MUSEUMFREE', status: 'EXPIRED', icon: ticket, type: 'Tickets' },
  ];
    const user1 = {
        id: 1,
        loyaltyStatus: 'Platinum',
        currentPoint: 2000,
        nextLevel: 'Diamond',
        pointsToNextLevel: 3000
    };
    const filteredCoupons =
        activeTab === "All"
            ? coupons
            : coupons.filter(c => c.type === activeTab);
  return (
      <div className="flex bg-[#F8F9FA]">
      {/*<div className="fixed inset-y-0 left-0 z-50">*/}
        <Sidebar />
      {/*</div>*/}
          <main className="flex-1 ml-64 p-8 pt-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <LoyaltyStatus user={user1}/>
          <CouponTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <CouponGrid coupons={filteredCoupons} />
          <ReferFriendBanner />
        </div>
      </main>
    </div>
  );
};

export default CouponsPage;
