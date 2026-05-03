import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Moon,
  Plane,
  FileText,
  Download,
  Repeat,
  CheckCircle,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
    <Icon size={14} className="text-orange-500" />
    <span>{text}</span>
  </div>
);

const BookingCard = ({ item }) => {
  const navigate = useNavigate();
  const isCompleted = item.category === "completed";
  const isCancelled = item.category === "cancelled";
  const tourId = item.tourId || item.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col xl:flex-row shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative xl:w-72 h-52 xl:h-auto shrink-0 overflow-hidden">
        <img
          src={item.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={item.title}
        />
        <span className="absolute top-5 left-5 bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          {item.type === "Stay" && <Moon size={10} />}
          {item.type === "Flight" && <Plane size={10} />}
          {item.type === "Tour" && <MapPin size={10} />}
          {item.type}
        </span>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${
                  isCompleted
                    ? "bg-gray-100 text-gray-500"
                    : isCancelled
                      ? "bg-red-50 text-red-500"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {item.status}
              </span>
              <span className="text-[9px] text-gray-400 font-bold tracking-wider">
                ID: {item.id}
              </span>
            </div>
            <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">
              {item.title}
            </h3>
            <p className="text-[12px] text-gray-400 font-medium line-clamp-1">
              {item.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-gray-900">
              ${item.price}
            </span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              {item.priceNote}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 py-6 border-y border-gray-50 my-2">
          <InfoRow
            icon={Calendar}
            text={`${item.startDate}${item.nights > 0 ? ` - ${item.endDate}` : ""}`}
          />
          {item.location && <InfoRow icon={MapPin} text={item.location} />}
          {item.airline && <InfoRow icon={Plane} text={item.airline} />}
          {item.nights > 0 && (
            <InfoRow icon={Moon} text={`${item.nights} Nights`} />
          )}
          {item.type === "Tour" && (
            <InfoRow icon={CheckCircle} text={`${item.adults} Adults`} />
          )}
          {item.time && item.type === "Tour" && (
            <InfoRow icon={Clock} text={item.time} />
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-6">
            {isCompleted ? (
              <button
                onClick={() => navigate(`/review/${tourId}`)}
                className="text-[11px] font-black text-orange-500 hover:underline flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Star size={14} className="fill-orange-500" /> Rate Experience
              </button>
            ) : (
              !isCancelled && (
                <button className="text-[11px] font-black text-orange-500 hover:underline flex items-center gap-1.5 uppercase tracking-wider">
                  <Download size={14} /> Itinerary
                </button>
              )
            )}

            <button
              onClick={() => navigate("/help")}
              className="text-[11px] font-black text-gray-400 hover:text-gray-900 flex items-center gap-1.5 uppercase tracking-wider"
            >
              Support
            </button>
          </div>

          <div className="flex gap-3">
            {isCompleted ? (
              <button
                onClick={() => navigate(`/checkout/${tourId}`)}
                className="bg-orange-500 text-white text-[10px] font-black px-7 py-3.5 rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-95"
              >
                <Repeat size={14} /> REBOOK
              </button>
            ) : isCancelled ? (
              <button className="bg-gray-900 text-white text-[10px] font-black px-7 py-3.5 rounded-2xl hover:bg-black transition-all active:scale-95">
                FIND ALTERNATIVE
              </button>
            ) : (
              <button className="bg-orange-500 text-white text-[10px] font-black px-7 py-3.5 rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-95">
                <FileText size={14} /> VIEW VOUCHER
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
