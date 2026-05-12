import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  Heart,
  LogIn,
  Loader2,
  MapPin,
  Trash2,
  Compass,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import wishlistService from "../services/wishlists/wishlistService.js";
import tourService from "../services/Tours/tourService.js";

//  HELPER
function isLoggedIn() {
  const raw = localStorage.getItem("travel_session");
  if (!raw) return false;
  try {
    return !!JSON.parse(raw).sessionId;
  } catch {
    return false;
  }
}

//  WISHLIST ITEM
const WishlistItem = ({ item, isSelected, onToggle, onRemove, removing }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group items-center">
      <button
        onClick={() => onToggle(item.id)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
          isSelected
            ? "bg-orange-500 border-orange-500 text-white"
            : "border-gray-200 hover:border-orange-300"
        }`}
      >
        {isSelected && <Check size={14} strokeWidth={4} />}
      </button>

      <div
        onClick={() => navigate(`/tour/${item.id}`)}
        className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between min-w-0">
        <div>
          <h4
            onClick={() => navigate(`/tour/${item.id}`)}
            className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
          >
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
            <MapPin size={10} className="text-orange-400" />
            <span className="uppercase tracking-wider truncate">
              {item.location}
            </span>
            {item.duration && (
              <span className="bg-orange-50 text-blue-500 font-bold px-2 py-0.5 rounded-lg text-[9px] border border-orange-100">
                ⏱ {item.duration}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-black text-orange-600">
            ${item.basePrice?.toLocaleString() || "0"}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            disabled={removing}
            className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
          >
            {removing ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

//  RECOMMENDATION CARD
const RecommendationCard = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/tour/${item.id}`)}
      className="min-w-[160px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-50 group cursor-pointer"
    >
      <div className="h-24 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="p-2">
        <h5 className="text-[10px] font-bold text-gray-900 line-clamp-1">
          {item.title}
        </h5>
        <p className="text-[9px] text-gray-500 mt-0.5">
          From ${item.basePrice?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
  );
};

//  NOT LOGGED IN
const NotLoggedIn = ({ onClose, navigate }) => (
  <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
      <Heart size={36} className="text-orange-300" />
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-2">
      Save your favorites
    </h3>
    <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
      Sign in to save tours you love and access your wishlist from anywhere.
    </p>
    <button
      onClick={() => {
        onClose();
        navigate("/login");
      }}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-95"
    >
      <LogIn size={18} /> Sign In to View Wishlist
    </button>
    <button
      onClick={() => {
        onClose();
        navigate("/tours");
      }}
      className="mt-3 text-sm font-bold text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1"
    >
      <Compass size={14} /> Browse Tours First
    </button>
  </div>
);

//  EMPTY WISHLIST
const EmptyWishlist = ({ onClose, navigate }) => (
  <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
      <Heart size={36} className="text-orange-200" />
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-2">No saved tours</h3>
    <p className="text-sm text-gray-400 font-medium mb-8">
      Tap the ❤️ on any tour to save it here.
    </p>
    <button
      onClick={() => {
        onClose();
        navigate("/tours");
      }}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-95"
    >
      <Compass size={18} /> Explore Tours
    </button>
  </div>
);

//  SKELETON
const SkeletonItem = () => (
  <div className="flex gap-4 py-4 border-b border-gray-100 animate-pulse items-center">
    <div className="w-5 h-5 rounded-md bg-gray-200 shrink-0" />
    <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
    </div>
  </div>
);

//  MAIN DRAWER
export default function WishlistDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [items, setItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setItems([]);
      setSelectedIds([]);
      setRecommendations([]);
      return;
    }

    // Mở drawer → check login ngay, fetch nếu đã login
    if (!isLoggedIn()) {
      setItems([]);
      setSelectedIds([]);
      setRecommendations([]);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [wishlistData, toursData] = await Promise.all([
          wishlistService.getWishlist(),
          tourService.getTours().catch(() => []),
        ]);
        setItems(wishlistData.items);
        setSelectedIds(wishlistData.items.map((i) => i.id));
        const wishlistIds = new Set(wishlistData.items.map((i) => i.id));
        setRecommendations(
          toursData.filter((t) => !wishlistIds.has(t.id)).slice(0, 5),
        );
      } catch (err) {
        console.error("WishlistDrawer fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRemove = async (tourId) => {
    try {
      setRemovingId(tourId);
      await wishlistService.removeFromWishlist(tourId);
      setItems((prev) => prev.filter((item) => item.id !== tourId));
      setSelectedIds((prev) => prev.filter((id) => id !== tourId));
    } catch (err) {
      console.error("Remove error:", err);
    } finally {
      setRemovingId(null);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [recommendations]);

  const subtotal = items
    .filter((item) => selectedIds.includes(item.id))
    .reduce((acc, item) => acc + (item.basePrice || 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900">
                  Your Wishlist
                </h2>
                {isLoggedIn() && !loading && items.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto flex flex-col custom-scrollbar">
              {!isLoggedIn() && (
                <NotLoggedIn onClose={onClose} navigate={navigate} />
              )}

              {isLoggedIn() && loading && (
                <div className="p-6">
                  {[...Array(3)].map((_, i) => (
                    <SkeletonItem key={i} />
                  ))}
                </div>
              )}

              {isLoggedIn() && !loading && items.length === 0 && (
                <EmptyWishlist onClose={onClose} navigate={navigate} />
              )}

              {isLoggedIn() && !loading && items.length > 0 && (
                <div className="p-6">
                  {/* Items */}
                  <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                    {items.map((item) => (
                      <WishlistItem
                        key={item.id}
                        item={item}
                        isSelected={selectedIds.includes(item.id)}
                        onToggle={handleToggle}
                        onRemove={handleRemove}
                        removing={removingId === item.id}
                      />
                    ))}
                  </div>

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        You might also like
                      </h3>
                      <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar cursor-grab active:cursor-grabbing"
                      >
                        {recommendations.map((item) => (
                          <RecommendationCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer subtotal */}
            {isLoggedIn() && !loading && items.length > 0 && (
              <div className="p-6 bg-gray-50/50 border-t border-gray-100 shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500">
                      Subtotal
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {selectedIds.length} item
                      {selectedIds.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <span className="text-xl font-black text-gray-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/wishlist");
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                  View All Saved Tours
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
