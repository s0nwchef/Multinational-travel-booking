import React, { useState, useEffect } from "react";
import { Star, Heart, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import wishlistService from "../../services/wishlists/wishlistService.js";

const VerticalTourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFav = async () => {
      try {
        const raw = localStorage.getItem("travel_session");
        if (!raw) return;
        const inWishlist = await wishlistService.checkWishlist(tour.id);
        setIsFavorite(inWishlist);
      } catch {
        // Ignore — không crash card
      }
    };
    if (tour?.id) checkFav();
  }, [tour?.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    // Chưa login → redirect hoặc chỉ toggle local
    const raw = localStorage.getItem("travel_session");
    if (!raw) {
      setIsFavorite((prev) => !prev);
      return;
    }

    const prev = isFavorite;
    setIsFavorite(!prev);
    setLoadingFav(true);

    try {
      await wishlistService.toggleWishlist(tour.id, prev);
    } catch (err) {
      setIsFavorite(prev);
      console.error("Wishlist toggle error:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleGoToDetail = () => {
    navigate(`/tour/${tour.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={handleGoToDetail}
      className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full transition-all duration-300"
    >
      {/* ── ẢNH & BADGE & HEART ── */}
      <div className="relative h-48">
        <img
          src={tour.image}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={tour.title}
        />

        {tour.badge && (
          <span
            className={`absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase shadow-lg ${
              tour.badgeType === "orange"
                ? "bg-orange-500"
                : tour.badgeType === "purple"
                  ? "bg-purple-600"
                  : "bg-blue-500"
            }`}
          >
            {tour.badge}
          </span>
        )}

        <button
          onClick={handleToggleFavorite}
          disabled={loadingFav}
          className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 disabled:opacity-70 ${
            isFavorite
              ? "bg-red-50 text-red-500"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
        >
          {loadingFav ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
          )}
        </button>
      </div>

      {/* ── NỘI DUNG ── */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
          <MapPin size={14} className="text-orange-500" />
          <span>{tour.location || "Global"}</span>
        </div>

        <h3 className="text-lg font-extrabold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
          {tour.title}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{tour.rating || "5.0"}</span>
          <span className="text-[10px] text-gray-400">
            ({tour.totalReviews || 0} reviews)
          </span>
        </div>

        {/* ── GIÁ & DETAIL ── */}
        <div className="mt-auto flex justify-between items-end">
          <div className="flex flex-col">
            {tour.originalPrice && (
              <span className="text-[10px] text-gray-400 font-bold uppercase line-through">
                $ {tour.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-gray-900">
              $ {(tour.basePrice || tour.price)?.toLocaleString() || "0"}
            </span>
          </div>

          <button
            className="text-[14px] font-black text-orange-500 hover:underline flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              handleGoToDetail();
            }}
          >
            Detail →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerticalTourCard;
