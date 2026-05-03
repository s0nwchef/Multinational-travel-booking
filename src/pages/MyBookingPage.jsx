import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layouts/Sidebar.jsx";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import BookingCard from "../features/booking/BookingCard.jsx";
import { AnimatePresence, motion } from "framer-motion";
import bookingService from "../services/bookingService.js";
import authService from "../services/authService.js";

const categorizeBooking = (status = "") => {
  const normalized = String(status).toLowerCase();

  if (["completed", "ticketed"].includes(normalized)) {
    return "completed";
  }

  if (["cancelled", "canceled", "refunded", "refund_pending"].includes(normalized)) {
    return "cancelled";
  }

  return "upcoming";
};

const normalizeBooking = (booking) => {
  const item = booking.itemId || booking.tourId || {};
  const isTour = booking.bookingType === "tour" || item.title || booking.tourId;

  return {
    id: booking.bookingCode || booking._id,
    bookingId: booking._id,
    bookingCode: booking.bookingCode,
    tourId: booking.tourId?._id || booking.tourId || item._id || item.id,
    category: categorizeBooking(booking.status),
    type: isTour ? "Tour" : "Flight",
    image:
      item.images?.[0] ||
      item.image ||
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
    status: booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Confirmed",
    title: item.title || booking.customerName || "Booking",
    description: item.description || booking.bookingReference || "Travel booking",
    location: item.destinationId?.name || item.location || "",
    startDate: booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    endDate: booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    time: "",
    adults: booking.travelers?.length || 1,
    airline: booking.bookingType === "flight" ? item.airline || "" : "",
    nights: Number(item.duration || 0),
    price: booking.grandTotal ?? booking.totalAmount ?? booking.baseFare ?? 0,
    priceNote: booking.paymentStatus ? booking.paymentStatus.replace(/_/g, " ") : "Paid",
    searchText: [
      booking.bookingCode,
      booking.bookingReference,
      item.title,
      item.location,
      item.destinationId?.name,
      booking.customerName,
      booking.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
};

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 3;

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        if (!authService.isAuthenticated()) {
          if (mounted) {
            setBookings([]);
            setError("Please sign in to view your bookings.");
          }
          return;
        }

        const data = await bookingService.getBookings();
        const currentUserId = authService.getCurrentUser()?._id || authService.getCurrentUser()?.id;

        const normalized = (Array.isArray(data) ? data : [])
          .filter((booking) => {
            const bookingUserId = booking.userId?._id || booking.userId?.id || booking.userId;
            return !currentUserId || String(bookingUserId) === String(currentUserId);
          })
          .map(normalizeBooking);

        if (mounted) {
          setBookings(normalized);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || "Không thể tải danh sách booking");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    return bookings.filter((item) => {
      const matchesTab = item.category === activeTab;
      const matchesSearch =
        searchTerm.trim() === "" || item.searchText.includes(searchTerm.toLowerCase().trim());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, bookings, searchTerm]);

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

  const tabCounts = useMemo(() => {
    return tabs.reduce((accumulator, tab) => {
      accumulator[tab.id] = bookings.filter((booking) => booking.category === tab.id).length;
      return accumulator;
    }, {});
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-bold">Đang tải danh sách booking...</p>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 text-center">
        <div className="max-w-md bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <AlertCircle className="mx-auto mb-4 text-orange-500" size={40} />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Bookings unavailable</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all"
          >
            Explore Tours
          </button>
        </div>
      </div>
    );
  }

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
                      {tabCounts[tab.id] || 0}
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
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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
