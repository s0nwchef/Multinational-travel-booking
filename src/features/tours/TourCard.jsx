import React, { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Languages,
  Headphones,
  Utensils,
  Bus,
  Zap,
  CheckCircle2,
  Heart,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const IconComponent = ({ name }) => {
  const icons = {
    Languages: <Languages size={14} />,
    Headphones: <Headphones size={14} />,
    Utensils: <Utensils size={14} />,
    Bus: <Bus size={14} />,
  };
  return icons[name] || null;
};

export default function TourCard({ tour }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop";

  // Hàm xử lý màu Badge trái trên ảnh
  const getBadgeColor = (type) => {
    const colors = {
      orange: "bg-orange-500/90",
      blue: "bg-blue-600/90",
      purple: "bg-purple-600/90",
    };
    return colors[type] || "bg-gray-500/90";
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-[2.5rem] p-4 flex flex-col md:flex-row gap-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 mb-5"
    >
      {/* KHỐI TRÁI*/}
      <div className="w-full md:w-1/3 min-w-[260px] h-52 relative overflow-hidden rounded-[2rem] bg-gray-100">
        <img
          src={tour.image || FALLBACK_IMAGE}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {tour.badge && (
          <div
            className={`absolute top-4 left-4 ${getBadgeColor(tour.badgeType)} backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg`}
          >
            {tour.badge}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all hover:scale-110 active:scale-90"
        >
          <Heart
            size={18}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* KHỐI PHẢI: NỘI DUNG */}
      <div className="flex-1 flex flex-col py-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <MapPin size={14} className="text-orange-500" />
            <span>{tour.location}</span>
            <span className="text-gray-200">•</span>
            <span>{tour.type}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
            {tour.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-gray-900">
              {tour.rating}
            </span>
            <span className="text-xs text-gray-400">({tour.reviews})</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock size={16} className="text-gray-400" />
              <span>{tour.duration}</span>
            </div>

            {tour.infoItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 border-l border-gray-200 pl-4 first:border-0 first:pl-0"
              >
                <IconComponent name={item.icon} />
                <span>{item.text}</span>
              </div>
            ))}

            {tour.highlight && (
              <div
                className={`flex items-center gap-1 font-bold ${
                  tour.highlight.type === "instant"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {tour.highlight.type === "instant" ? (
                  <Zap size={14} fill="currentColor" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                <span className="text-[11px] uppercase tracking-wide">
                  {tour.highlight.text}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
              Price from
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">
                ${tour.price}
              </span>
              {tour.originalPrice && (
                <span className="text-sm text-gray-300 line-through font-medium">
                  ${tour.originalPrice}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/tour/${tour.id}`)}
            className="bg-orange-500 text-white px-8 py-3.5 rounded-[1.2rem] font-black text-sm flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            View Details
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
