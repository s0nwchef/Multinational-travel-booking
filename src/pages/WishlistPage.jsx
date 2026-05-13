import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../layouts/Sidebar.jsx";
import {
  Search,
  Heart,
  Star,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import wishlistService from "../services/wishlists/wishlistService.js";

//  EMPTY STATE
const EmptyWishlist = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <Heart size={40} className="text-orange-300" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">
        No saved adventures yet
      </h3>
      <p className="text-gray-400 font-medium mb-8 max-w-sm">
        Start exploring tours and save the ones you love by clicking the heart
        icon.
      </p>
      <button
        onClick={() => navigate("/tours")}
        className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-orange-200 flex items-center gap-2 transition-all active:scale-95"
      >
        Explore Tours <ArrowRight size={18} />
      </button>
    </motion.div>
  );
};

//  WISHLIST CARD
const WishlistCard = ({ item, onRemove, removing }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full transition-all hover:shadow-xl"
    >
      <div className="relative h-56">
        <img
          src={item.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={item.title}
        />
        {item.badge && (
          <span
            className={`absolute top-5 left-5 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider ${
              item.badgeType === "orange"
                ? "bg-orange-500"
                : item.badgeType === "purple"
                  ? "bg-purple-600"
                  : "bg-blue-500"
            }`}
          >
            {item.badge}
          </span>
        )}
        <button
          onClick={() => onRemove(item.id)}
          disabled={removing}
          className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md text-red-500 hover:scale-110 hover:bg-red-50 transition-all disabled:opacity-50"
          title="Remove from wishlist"
        >
          {removing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Heart size={18} fill="currentColor" />
          )}
        </button>
      </div>

      <div className="p-7 flex flex-col flex-1">
        {/* 1. Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
          <MapPin size={14} className="text-orange-500" />
          <span>{item.location}</span>
        </div>

        {/* 2. Title */}
        <h3 className="text-[17px] font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
          {item.title}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-900">
              {item.rating}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              ({item.totalReviews})
            </span>
          </div>
          {item.duration && (
            <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 text-[11px] font-bold text-blue-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M6 3.5V6l1.5 1.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              {item.duration}
            </span>
          )}
        </div>

        {/* 5. Price + Detail */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
              Price from
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-gray-900">
                ${item.basePrice?.toLocaleString() || "0"}
              </span>
              {item.originalPrice && (
                <span className="text-[11px] text-gray-300 font-bold line-through">
                  ${item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate(`/tour/${item.id}`)}
            className="text-[13px] font-black text-orange-500 flex items-center gap-1 hover:gap-2 transition-all"
          >
            Detail <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

//  SKELETON LOADER
const SkeletonCard = () => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-7 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-4/5" />
      <div className="pt-6 flex justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-1/5" />
      </div>
    </div>
  </div>
);

//  MAIN PAGE
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recently-added");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const itemsPerPage = 6;

  const sortOptions = [
    { value: "recently-added", label: "Recently Added" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await wishlistService.getWishlist();
      setWishlist(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Reset page on search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleRemove = async (tourId) => {
    try {
      setRemovingId(tourId);
      await wishlistService.removeFromWishlist(tourId);
      setWishlist((prev) => prev.filter((item) => item.id !== tourId));
    } catch (err) {
      console.error("Remove error:", err);
    } finally {
      setRemovingId(null);
    }
  };

  // ── FILTER (word-boundary search like TourList) ──
  const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const filteredTours = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return wishlist;
    const regex = new RegExp(`\\b${escapeRegex(searchTerm)}`, "i");
    return wishlist.filter(
      (item) =>
        regex.test(item.title) ||
        regex.test(item.location) ||
        regex.test(item.country || ""),
    );
  }, [wishlist, searchQuery]);

  // ── SORT ──
  const sortedTours = useMemo(() => {
    return [...filteredTours].sort((a, b) => {
      if (sortBy === "price-asc")
        return (a.basePrice || 0) - (b.basePrice || 0);
      if (sortBy === "price-desc")
        return (b.basePrice || 0) - (a.basePrice || 0);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filteredTours, sortBy]);

  const totalPages = Math.ceil(sortedTours.length / itemsPerPage);
  const currentItems = sortedTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="shrink-0">
        <Sidebar />
      </div>

      <main className="flex-1 p-10">
        <div className="max-w-[1400px] mx-auto">
          {/* HEADER */}
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3">
                My Wishlist
              </h1>
              <p className="text-gray-400 font-medium text-lg">
                {loading
                  ? "Loading..."
                  : `Have ${wishlist.length} adventure${wishlist.length !== 1 ? "s" : ""} saved.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              {/* SEARCH */}
              <div className="relative flex-1 md:w-80 min-w-[280px]">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Find your saved trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-transparent rounded-[1.25rem] py-4 pl-14 pr-10 shadow-sm focus:bg-white focus:border-orange-200 transition-all outline-none text-sm font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* SORT */}
              <div className="relative min-w-[200px]">
                <div
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-200 transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">
                      Sort by:
                    </span>
                    <span className="text-[13px] font-bold text-gray-800">
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-orange-500 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[60]"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-white border border-gray-50 rounded-2xl shadow-xl z-[70] overflow-hidden py-1">
                      {sortOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`px-4 py-3 text-[13px] font-bold cursor-pointer transition-all ${
                            sortBy === option.value
                              ? "bg-orange-50 text-orange-600"
                              : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-500"
                          }`}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 mb-8 text-red-500 font-medium text-sm flex items-center justify-between">
              <span>Failed to load wishlist: {error}</span>
              <button
                onClick={fetchWishlist}
                className="text-xs font-bold underline hover:text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div>
              {/* Results count */}
              <p className="text-sm text-gray-500 font-medium mb-6">
                Showing{" "}
                <span className="font-black text-gray-900">
                  {sortedTours.length}
                </span>{" "}
                saved tour{sortedTours.length !== 1 ? "s" : ""}
                {searchQuery && (
                  <span>
                    {" "}
                    for "<span className="text-orange-500">{searchQuery}</span>"
                  </span>
                )}
              </p>

              {sortedTours.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                  <Heart size={40} className="mx-auto mb-4 text-gray-200" />
                  <p>No tours match your search.</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-orange-500 font-bold text-sm hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {currentItems.map((item) => (
                        <WishlistCard
                          key={item.id}
                          item={item}
                          onRemove={handleRemove}
                          removing={removingId === item.id}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-16 mb-10">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`p-3 rounded-2xl border border-gray-200 transition-all bg-white shadow-sm ${
                          currentPage === 1
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:border-orange-300 hover:text-orange-500 active:scale-90"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                              currentPage === i + 1
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                : "bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-500"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className={`p-3 rounded-2xl border border-gray-200 transition-all bg-white shadow-sm ${
                          currentPage === totalPages
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:border-orange-300 hover:text-orange-500 active:scale-90"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
