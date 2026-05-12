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
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile.js";
import { formatPoints, getLoyaltyStatus } from "../utils/loyalty.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUserProfile();
  const displayName = user?.ho_ten || user?.fullName || user?.name || "Traveler";
  const avatarUrl =
    user?.anh_dai_dien ||
    user?.avatarUrl ||
    user?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
  const createdAt = user?.ngay_tao || user?.createdAt;
  const memberSince = createdAt
    ? new Date(createdAt).getFullYear()
    : "New member";
  const loyalty = getLoyaltyStatus(user?.diem || user?.loyaltyPoints || 0);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("travel_session");
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
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold text-center line-clamp-1">
          {displayName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {createdAt ? `Member since ${memberSince}` : memberSince}
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
      <div
        className={`${loyalty.currentTier.cardClass} p-4 rounded-lg border shadow-sm`}
      >
        <h4 className="text-sm font-semibold">{loyalty.currentTierName}</h4>
        <p className="text-2xl font-bold">{formatPoints(loyalty.points)} pts</p>
        <div className="mt-2 h-1.5 rounded-full bg-white/70 overflow-hidden">
          <div
            className={`h-full rounded-full ${loyalty.currentTier.progressClass}`}
            style={{ width: `${loyalty.progressPercent}%` }}
          />
        </div>
        <p className="text-xs mt-2 opacity-75">
          {loyalty.nextTier
            ? `${formatPoints(loyalty.pointsToNextTier)} pts to ${loyalty.nextTierName}`
            : "Top reward tier reached"}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
