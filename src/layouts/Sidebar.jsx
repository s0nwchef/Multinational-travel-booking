import React from 'react';
import { FiGrid, FiBookOpen, FiHeart, FiTag, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: FiGrid },
    { name: 'My Bookings', icon: FiBookOpen },
    { name: 'Wishlist', icon: FiHeart },
    { name: 'Coupons & Rewards', icon: FiTag, active: true },
    { name: 'Transactions', icon: FiFileText },
    { name: 'Settings', icon: FiSettings },
    { name: 'Logout', icon: FiLogOut },
  ];

  return (
    <div className="w-64 h-screen bg-white text-gray-900 dark:text-white flex flex-col justify-between p-4">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
        <h3 className="text-lg font-semibold">Alex Johnson</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2021</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className={`flex items-center p-3 rounded-lg ${
                  item.active
                    ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Card */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-4 rounded-lg">
        <h4 className="text-sm font-semibold">Travel Points</h4>
        <p className="text-2xl font-bold">2,450 pts</p>
        <p className="text-xs">Next reward at 3,000 pts</p>
      </div>
    </div>
  );
};

export default Sidebar;
