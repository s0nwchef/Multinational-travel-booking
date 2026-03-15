import React from "react";
import Sidebar from "../layouts/Sidebar.jsx";
import UpcomingTrip from "../features/dashboard/UpcomingTrip.jsx";
import WishlistWidget from "../features/dashboard/WishlistWidget.jsx";
import RecommendSection from "../features/dashboard/RecommendSection.jsx";
import FavoriteChoices from "../features/home/FavoriteChoices.jsx";
import { Search, Bell, Award } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-10">
          <div className="flex bg-white rounded-2xl px-5 py-3 shadow-sm w-[400px] border border-gray-100">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Search your next destination..."
              className="bg-transparent outline-none text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center">
            <div className="flex items-center bg-white border border-gray-100 rounded-[1.5rem] shadow-md overflow-hidden h-16 transition-all hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-full bg-blue-50 border-r border-gray-100">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100">
                  <Award size={20} className="text-blue-500 fill-blue-500" />
                </div>
              </div>

              <div className="px-6 flex flex-col justify-center border-r border-gray-100 h-full">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  Traveler Level
                </span>
                <span className="text-base font-black text-gray-900">
                  Platinum Member
                </span>
              </div>

              <div className="px-8 flex flex-col justify-center h-full bg-gray-50/30">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  Points
                </span>
                <span className="text-xl font-black text-orange-500">
                  2,450
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Hello, Alex!
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Welcome back to your travel hub. Here's what's happening.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-[2]">
            <UpcomingTrip />
          </div>
          <div className="flex-1">
            <WishlistWidget />
          </div>
        </div>

        {/* <div className="mt-8">
          <FavoriteChoices />
        </div> */}
        <div className="flex-1">
          <RecommendSection />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
