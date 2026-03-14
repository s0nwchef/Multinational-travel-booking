import React from 'react';
import LoyaltyStatus from './components/LoyaltyStatus';
import CouponTabs from './components/CouponTabs';
import CouponGrid from './components/CouponGrid';
import ReferFriendBanner from './components/ReferFriendBanner';
import  bed  from './img/bed.png'
import plane  from './img/plane.png'
import car from './img/car.png'
import ticket from './img/ticket.png'

const CouponsPage = () => {
  const coupons = [
    { id: 1, title: '15% OFF', subtitle: 'International Flights', description: 'Save on your next adventure to Europe or Asia. Min spend\n' +
            '$500.', expires: '2026-12-31', code: 'FLY15', status: 'ACTIVE', icon: plane },
    { id: 2, title: '$50 OFF', subtitle: 'Luxury Hotel Stays', description: 'Enjoy a discount on 5-star hotel bookings worldwide.', expires: '2026-11-30', code: 'HOTEL50', status: 'ACTIVE', icon: bed },
    { id: 3, title: '20% OFF', subtitle: 'Car Rentals', description: 'Used on rental booking #TR-8892.', expires: '2026-10-15', code: 'CAR20', status: 'USED', icon: car },
    { id: 4, title: 'Free Tkt', subtitle: 'Museum Pass', description: 'Free entry to museums', expires: '2026-09-01', code: 'MUSEUMFREE', status: 'EXPIRED', icon: ticket },
  ];

  return (
    <div className="container mx-auto p-6 bg-[#F6F7F8]">
      <LoyaltyStatus />
      <CouponTabs />
      <CouponGrid coupons={coupons} />
      <ReferFriendBanner />
    </div>
  );
};

export default CouponsPage;
