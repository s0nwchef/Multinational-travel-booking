import React, { useState } from "react";
import Sidebar from "../layouts/Sidebar.jsx";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { BOOKING_DATA } from "../data/bookingData.js";
import BookingCard from "../features/booking/BookingCard.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredData = BOOKING_DATA.filter(
    (item) => item.category === activeTab,
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: Clock3 },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
    { id: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
              My Bookings
            </h1>
            <p className="text-gray-400 font-bold italic tracking-wide">
              Manage your travels and history
            </p>
          </header>

          <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 border-b border-gray-100 pb-2">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all relative flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-white text-orange-500 shadow-sm"
                        : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <TabIcon size={18} />
                    {tab.label}
                    <span className="text-[10px] opacity-60">
                      (
                      {BOOKING_DATA.filter((b) => b.category === tab.id).length}
                      )
                    </span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tabLine"
                        className="absolute bottom-0 left-8 right-8 h-1 bg-orange-500 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Find a booking..."
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-[1.5rem] shadow-sm text-sm font-bold outline-none border border-transparent focus:border-orange-200 transition-all"
                />
              </div>
              <button className="p-4 bg-white rounded-[1.5rem] shadow-sm text-orange-500 hover:bg-orange-50 transition-colors border border-gray-50">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <BookingCard key={item.id} item={item} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200"
                >
                  <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">
                    No results found
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-orange-500 shadow-sm disabled:opacity-30 border border-gray-50"
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white shadow-xl shadow-orange-100 scale-110"
                        : "bg-white text-gray-400 hover:border-orange-200 border border-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-orange-500 shadow-sm disabled:opacity-30 border border-gray-50"
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
