import React, { useState, useEffect } from "react";
import { Star, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import tourService from "../../services/Tours/tourService";
import { useNavigate } from "react-router-dom";

const VerticalTourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

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
      {/* PHẦN ẢNH & BADGE & HEART */}
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
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 ${
            isFavorite
              ? "bg-red-50 text-red-500"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={16} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      {/* PHẦN NỘI DUNG */}
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

        {/* PHẦN GIÁ & DETAIL */}
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

export default function SuggestedTours() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTours();
        setSuggestions(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching suggested tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleNavigateAllTours = () => {
    navigate("/tours");
    window.scrollTo(0, 0);
  };

  if (loading)
    return (
      <div className="p-20 text-center text-gray-400 animate-pulse font-bold">
        Finding suggestions for you...
      </div>
    );

  if (suggestions.length === 0) return null;

  return (
    <section className="bg-gray-100/80 p-8 rounded-[3rem] mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Suggested Tours
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Handpicked destinations just for your next trip
          </p>
        </div>

        <button
          onClick={handleNavigateAllTours}
          className="text-orange-500 font-bold text-sm hover:underline"
        >
          See more →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestions.map((tour) => (
          <VerticalTourCard key={tour.id || tour._id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
