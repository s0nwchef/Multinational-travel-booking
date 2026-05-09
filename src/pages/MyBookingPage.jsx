import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../layouts/Sidebar.jsx";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import bookingService from "../services/bookings/bookingService.js";
import BookingCard from "../features/booking/BookingCard.jsx";
import { AnimatePresence, motion } from "framer-motion";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;

  // Tách hàm fetch ra để có thể gọi lại sau khi hủy booking
  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);

      // Lấy ID từ travel_session theo ảnh Application bạn gửi
      const sessionStr = localStorage.getItem("travel_session");
      if (!sessionStr) return;

      const sessionData = JSON.parse(sessionStr);
      const userId = sessionData.user?.id;

      if (userId) {
        const data = await bookingService.getMyBookings(userId);
        // Đảm bảo set mảng, tránh lỗi render
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // --- HÀM XỬ LÝ HỦY BOOKING ---
  const handleCancel = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt chỗ này?")) {
      try {
        await bookingService.cancelBooking(bookingId);
        alert("Hủy đơn thành công!");
        // Gọi lại hàm fetch để cập nhật danh sách mới nhất từ server
        fetchMyBookings();
      } catch (error) {
        console.error("Lỗi khi hủy:", error);
        alert("Không thể hủy đơn, vui lòng thử lại sau.");
      }
    }
  };

  const filteredData = useMemo(() => {
    return bookings.filter((item) => {
      const matchesTab = item.tabGroup === activeTab;
      const matchesSearch =
        item.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, searchTerm]);

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

  const getCountByTab = (tabId) =>
    bookings.filter((b) => b.tabGroup === tabId).length;
  console.log("1. Current Active Tab:", activeTab);
  console.log("2. Bookings State (Tổng số data):", bookings);
  console.log("3. Filtered Data (Data sau khi lọc theo Tab):", filteredData);

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
                    <span className="text-[10px] opacity-60 ml-1">
                      ({getCountByTab(tab.id)})
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-[1.5rem] shadow-sm text-sm font-bold outline-none border border-transparent focus:border-orange-200 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 min-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-gray-400 font-bold">
                  Đang tải hành trình của bạn...
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <BookingCard
                      key={item.id}
                      item={item}
                      onCancel={handleCancel} // TRUYỀN PROP VÀO ĐÂY
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200"
                  >
                    <p className="text-gray-400 font-black text-xl italic uppercase tracking-widest">
                      {searchTerm
                        ? "No search results"
                        : `No ${activeTab} bookings`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {!loading && totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-orange-500 shadow-sm disabled:opacity-30 border border-gray-50"
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
                        : "bg-white text-gray-400 border border-gray-50"
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
                disabled={currentPage === totalPages}
                className="p-4 bg-white rounded-2xl text-gray-400 hover:text-orange-500 shadow-sm disabled:opacity-30 border border-gray-50"
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
