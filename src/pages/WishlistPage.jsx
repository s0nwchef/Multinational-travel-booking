import React, { useState } from "react";
import Sidebar from "../layouts/Sidebar.jsx";
import {
  Search,
  Heart,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WISHLIST_DATA = [
  {
    id: 1,
    image: "https://picsum.photos/seed/1/800/600",
    location: "Kyoto, Japan",
    title: "Kyoto Cherry Blossom Tour",
    rating: 4.8,
    reviews: 124,
    price: 1299,
    originalPrice: 1650,
    badge: "20% OFF",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/2/800/600",
    location: "Paris, France",
    title: "Eiffel Tower Dinner Experience",
    rating: 4.9,
    reviews: 850,
    price: 245,
    badge: "LUXE",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/3/800/600",
    location: "Bali, Indonesia",
    title: "Uluwatu Temple Sunset Tour",
    rating: 4.7,
    reviews: 2100,
    price: 45,
    originalPrice: 60,
    badge: "BEST SELLER",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/4/800/600",
    location: "Rome, Italy",
    title: "Colosseum Underground Tour",
    rating: 4.9,
    reviews: 3400,
    price: 89,
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/5/800/600",
    location: "New York, USA",
    title: "Manhattan Helicopter Sightseeing",
    rating: 4.8,
    reviews: 560,
    price: 210,
    originalPrice: 250,
    badge: "POPULAR",
  },
  {
    id: 6,
    image: "https://picsum.photos/seed/6/800/600",
    location: "Seoul, Korea",
    title: "Gyeongbokgung Palace Photo Trip",
    rating: 4.6,
    reviews: 920,
    price: 75,
  },
  {
    id: 7,
    image: "https://picsum.photos/seed/7/800/600",
    location: "Sydney, Australia",
    title: "Opera House Guided Backstage Tour",
    rating: 4.7,
    reviews: 310,
    price: 120,
  },
  {
    id: 8,
    image: "https://picsum.photos/seed/8/800/600",
    location: "Hanoi, Vietnam",
    title: "Ha Long Bay 5-Star Cruise",
    rating: 4.9,
    reviews: 4500,
    price: 95,
    originalPrice: 130,
    badge: "PROMO",
  },
  {
    id: 9,
    image: "https://picsum.photos/seed/9/800/600",
    location: "Cairo, Egypt",
    title: "Great Pyramids & Sphinx Private Tour",
    rating: 4.8,
    reviews: 1800,
    price: 55,
  },
  {
    id: 10,
    image: "https://picsum.photos/seed/10/800/600",
    location: "London, UK",
    title: "Warner Bros. Studio Tour London",
    rating: 4.9,
    reviews: 12000,
    price: 65,
    badge: "MUST SEE",
  },
];

const WishlistCard = ({ item }) => (
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
        <span className="absolute top-5 left-5 bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-wider">
          {item.badge}
        </span>
      )}
      <button className="absolute top-5 right-5 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md text-red-500 hover:scale-110 transition-all">
        <Heart size={18} fill="currentColor" />
      </button>
    </div>

    <div className="p-7 flex flex-col flex-1">
      <div className="flex items-center gap-1.5 mb-3">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-gray-900">{item.rating}</span>
        <span className="text-[11px] text-gray-400 font-medium">
          ({item.reviews} reviews)
        </span>
      </div>

      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1.5">
        {item.location}
      </span>
      <h3 className="text-[17px] font-black text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2 leading-tight">
        {item.title}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex flex-col">
          {item.originalPrice && (
            <span className="text-[10px] text-gray-300 font-bold uppercase line-through mb-0.5">
              ${item.originalPrice}
            </span>
          )}
          <span className="text-xl font-black text-gray-900">
            ${item.price}
          </span>
        </div>
        <button className="text-[13px] font-black text-orange-500 flex items-center gap-1 hover:gap-2 transition-all">
          Detail <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function WishlistPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(WISHLIST_DATA.length / itemsPerPage);

  const currentItems = WISHLIST_DATA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* SIDEBAR FIXED w-64 */}
      <div className="w-64 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </div>

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-[1400px] mx-auto">
          <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3">
                My Wishlist
              </h1>
              <p className="text-gray-400 font-medium text-lg">
                Have {WISHLIST_DATA.length} adventures saved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
              <div className="relative flex-1 md:w-80 min-w-[280px]">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Find your saved trips..."
                  className="w-full bg-white border border-transparent rounded-[1.25rem] py-4 pl-14 pr-6 shadow-sm focus:bg-white focus:border-orange-200 transition-all outline-none text-sm font-medium"
                />
              </div>

              <button className="flex items-center gap-3 bg-white border border-gray-100 rounded-[1.25rem] px-6 py-4 shadow-sm font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={16} className="text-orange-500" />
                Sort by: Recently Added
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {currentItems.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16 mb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
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
        </div>
      </main>
    </div>
  );
}
