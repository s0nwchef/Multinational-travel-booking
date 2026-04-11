import React from "react";
import {
  FiGrid,
  FiBookOpen,
  FiHeart,
  FiTag,
  FiFileText,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
    { name: "My Bookings", icon: FiBookOpen, path: "/my-bookings" },
    { name: "Wishlist", icon: FiHeart, path: "/wishlist" },
    { name: "Coupons & Rewards", icon: FiTag, path: "/coupons" },
    { name: "Transactions", icon: FiFileText, path: "/transactions" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  return (
    <div className="w-64 fixed top-[94px] left-0 h-[calc(100vh-500px)] ml-4  bg-white flex flex-col justify-between p-4 border-r border-gray-100 overflow-y-auto">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gray-300 rounded-full mb-2 overflow-hidden">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold">Alex Johnson</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Member since 2021
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center p-3 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-[#FFF7ED] text-orange-600 dark:text-orange-400 border-l-4 border-orange-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <item.icon className="mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
          {/* Logout Item */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
            >
              <FiLogOut className="mr-3" />
              Logout
            </button>
          </li>
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
