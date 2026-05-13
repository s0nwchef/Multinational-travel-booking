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
  const loyalty = getLoyaltyStatus(user?.diem ?? user?.loyaltyPoints ?? 1);

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
    <aside className="w-64 bg-white flex flex-col border-r border-gray-200 sticky top-[80px] h-[calc(100vh-80px)] self-start overflow-y-auto">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-2 overflow-hidden flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h3 className="text-lg font-semibold text-center text-gray-900 line-clamp-1">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500">
            {createdAt ? `Member since ${memberSince}` : memberSince}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.name}</span>
              </NavLink>
            </li>
          ))}
          {/* Logout Item */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="flex-1">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom Card - Loyalty Status */}
      <div className="p-4 border-t border-gray-100 shrink-0">
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
    </aside>
  );
};

export default Sidebar;
