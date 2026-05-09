import React, { useState } from "react";
import { Star, MapPin, Clock, Heart, ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TourCard({ tour, filters }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop";

  const formatDateRange = (start, end) => {
    if (!start) return "Flexible dates";

    try {
      const options = { month: "short", day: "numeric" };

      const startDate = new Date(start);
      const endDate = end ? new Date(end) : null;

      if (isNaN(startDate.getTime())) return "Flexible dates";

      const startStr = startDate.toLocaleDateString("en-US", options);

      if (!endDate || isNaN(endDate.getTime())) return startStr;

      const endStr = endDate.toLocaleDateString("en-US", options);

      return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
    } catch (error) {
      return "Flexible dates";
    }
  };

  const uid = tour.id || tour._id;
  const nextDeparture =
    tour.nextDeparture ||
    (tour.lich_khoi_hanh && tour.lich_khoi_hanh.length > 0
      ? tour.lich_khoi_hanh[0]
      : null);

  const displayDate = tour.departures?.find((d) => {
    if (!filters?.startDate || !filters?.endDate) return false;

    const tourStart = new Date(d.ngayKhoiHanh).getTime();
    const tourEnd = new Date(d.ngayVe).getTime();

    const userStart = new Date(filters.startDate).setHours(0, 0, 0, 0);
    const userEnd = new Date(filters.endDate).setHours(23, 59, 59, 999);

    return tourStart >= userStart && tourEnd <= userEnd;
  });

  const dateToDisplay = displayDate || nextDeparture;

  console.log("Check nextDeparture:", nextDeparture);

  const badgeColors = {
    orange: "bg-orange-500/90",
    purple: "bg-purple-600/90",
    blue: "bg-blue-600/90",
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-[2rem] p-4 flex flex-col md:flex-row gap-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 mb-4"
    >
      <div className="w-full md:w-[280px] h-48 relative overflow-hidden rounded-[1.5rem] bg-gray-100 flex-shrink-0">
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
            className={`absolute top-3 left-3 ${badgeColors[tour.badgeType] || "bg-blue-600/90"} backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg`}
          >
            {tour.badge}
          </div>
        )}
      </div>

      {/* KHỐI PHẢI: NỘI DUNG */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          {/* ĐỊA ĐIỂM */}
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
            <MapPin size={14} className="text-orange-500" />
            <span>{tour.location}</span>
          </div>

          <h3 className="text-lg font-extrabold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
            {tour.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Ngày tháng */}
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100">
              <Calendar size={13} strokeWidth={2.5} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase">
                {formatDateRange(
                  dateToDisplay?.ngayKhoiHanh || dateToDisplay?.ngay_khoi_hanh,
                  dateToDisplay?.ngayVe || dateToDisplay?.ngay_ve,
                )}
              </span>
            </div>

            {/* Thời lượng */}
            <div className="flex items-center gap-1.5 bg-teal-50 text-teal-600 px-2.5 py-1 rounded-lg border border-teal-100">
              <Clock size={13} strokeWidth={2.5} className="text-teal-500" />
              <span className="text-[10px] font-semibold tracking-wide">
                {tour.duration}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full border border-purple-100">
              <span className="text-[10px] font-black uppercase tracking-tight">
                {tour.category || "General"}
              </span>
            </div>
          </div>

          {/* ĐÁNH GIÁ */}
          <div className="flex items-center gap-1.5 mb-2">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-gray-900">
              {tour.rating}
            </span>
            <span className="text-[10px] text-gray-400">
              ({tour.totalReviews})
            </span>
          </div>
        </div>

        {/* GIÁ VÀ NÚT ACTION */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
              Price from
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900">
                {formatPrice(tour.basePrice)}
              </span>
              {tour.originalPrice && (
                <span className="text-xs text-gray-300 line-through font-medium">
                  {formatPrice(tour.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/tour/${uid}`)}
            className="bg-orange-500 text-white px-8 py-3.5 rounded-[1.2rem] font-black text-sm flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            View Details
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
