import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, Menu, Search, Heart, Bell, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ onOpenAuth, onOpenWishlist, onOpenNotifications }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('auth-change'));
  };

  const navLinkClass = ({ isActive }) =>
      `px-6 py-2.5 rounded-full text-sm font-bold text-primary transition-all ${
          isActive ? 'bg-orange-50/50 shadow-inner' : 'hover:bg-orange-50'
      }`;

  return (
      <nav className="w-full bg-[#E5E5E5] dark:bg-surface-dark rounded-full shadow-sm px-6 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <PlaneTakeoff className="text-primary w-8 h-8" />
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Logo</span>
          </Link>
        </div>

        {/* Nav Links - Center Pill (Locked in center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-white dark:bg-gray-800/50 p-1 rounded-full shadow-sm z-10">
          <NavLink to="/destinations" className={navLinkClass}>Destination</NavLink>
          <NavLink to="/tours" className={navLinkClass}>Tours</NavLink>
          <NavLink to="/hotels" className={navLinkClass}>Hotels</NavLink>
          <NavLink to="/help" className={navLinkClass}>Help</NavLink>
          <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-2 text-primary hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </button>
            <button
                onClick={onOpenWishlist}
                className="p-2 text-primary hover:scale-110 transition-transform relative"
            >
              <Heart className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
            </button>
            <button
                onClick={onOpenNotifications}
                className="p-2 text-primary hover:scale-110 transition-transform relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          {user ? (
              <div className="flex items-center gap-3 bg-primary text-white pl-6 pr-1.5 py-1.5 rounded-full shadow-lg group relative cursor-pointer">
                <div className="flex flex-col items-start -space-y-0.5">
                  <span className="text-sm font-black leading-tight">{user.name}</span>
                  <span className="text-[10px] font-medium opacity-90">{user.membership}</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white/20">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>

                {/* Logout Tooltip/Dropdown - Overlapping homepage content */}
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                  <button
                      onClick={handleLogout}
                      className="bg-white text-primary text-xs font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-orange-100 hover:bg-orange-50 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Account
                  </button>
                </div>
              </div>
          ) : (
              <button
                  onClick={onOpenAuth}
                  className="bg-primary text-white px-8 py-3 rounded-full text-sm font-black shadow-lg hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
              >
                Sign In
              </button>
          )}

          <button className="md:hidden p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-800">
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>
      </nav>
  );
}
