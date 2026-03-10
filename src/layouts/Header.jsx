import React from 'react';
import { PlaneTakeoff, Menu, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="w-full bg-[#FFF0E5] dark:bg-surface-dark rounded-3xl shadow-sm px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex-shrink-0 flex items-center gap-2">
        <PlaneTakeoff className="text-primary w-8 h-8" />
        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Logo</span>
      </Link>
      <div className="hidden md:flex items-center gap-2 bg-white dark:bg-gray-800/50 p-1.5 rounded-full shadow-sm">
        <a className="px-5 py-2 rounded-full text-sm font-medium text-primary hover:bg-orange-50 transition-all" href="#">Destination</a>
        <a className="px-5 py-2 rounded-full text-sm font-medium text-primary hover:bg-orange-50 transition-all" href="#">Tours</a>
        <a className="px-5 py-2 rounded-full text-sm font-medium text-primary hover:bg-orange-50 transition-all" href="#">Hotels</a>
        <a className="px-5 py-2 rounded-full text-sm font-medium text-primary hover:bg-orange-50 transition-all" href="#">Help</a>
        <a className="px-5 py-2 rounded-full text-sm font-medium text-primary hover:bg-orange-50 transition-all" href="#">Blog</a>
      </div>
      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-800">
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <div className="hidden sm:flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-orange-100 dark:hover:bg-gray-800 text-primary">
            <Search className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-primary-dark transition-colors">
            <User className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
