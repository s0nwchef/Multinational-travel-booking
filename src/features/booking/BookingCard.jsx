import React from "react";
import {
  Calendar,
  MapPin,
  FileText,
  Repeat,
  Star,
  Users,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
    <Icon size={14} className="text-orange-500" />
    <span>{text}</span>
  </div>
);

const BookingCard = ({ item, onCancel }) => {
  const navigate = useNavigate();

  // Logic dựa trên tabGroup từ service trả về
  const isCompleted = item.tabGroup === "completed";
  const isCancelled = item.tabGroup === "cancelled";
  const isUpcoming = item.tabGroup === "upcoming";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 flex flex-col xl:flex-row shadow-sm hover:shadow-xl transition-all group"
    >
      {/* IMAGE SECTION */}
      <div className="relative xl:w-72 h-52 xl:h-auto shrink-0 overflow-hidden">
        <img
          src={item.tourImage}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={item.tourTitle}
        />
        <span className="absolute top-5 left-5 bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          <MapPin size={10} />
          TOUR
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
                CODE: {item.bookingCode}
              </span>
            </div>

            <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">
              {item.tourTitle}
            </h3>
            <p className="text-[12px] text-gray-400 font-medium line-clamp-1">
              Customer: {item.customerName}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-gray-900">
              {item.totalPrice?.toLocaleString("vi-VN")} VND
            </span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              {item.paymentStatus}
            </p>
          </div>
        </div>

        {/* INFO ROWS */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 py-6 border-y border-gray-50 my-2">
          <InfoRow icon={Calendar} text={`Booked on: ${item.bookingDate}`} />
          <InfoRow
            icon={Users}
            text={`${item.travelers?.length || 0} Travelers`}
          />
          {item.travelers?.[0]?.seatNumber && (
            <InfoRow
              icon={Clock}
              text={`Seat: ${item.travelers[0].seatNumber}`}
            />
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-6">
            {isCompleted ? (
              <button
                onClick={() => navigate(`/review/${item.id}`)}
                className="text-[11px] font-black text-orange-500 hover:underline flex items-center gap-1.5 uppercase tracking-wider"
              >
                <Star size={14} className="fill-orange-500" /> Rate Experience
              </button>
            ) : isUpcoming ? (
              <button
                onClick={() => onCancel(item.id)}
                className="text-[11px] font-black text-red-400 hover:text-red-600 flex items-center gap-1.5 uppercase tracking-wider transition-colors"
              >
                <AlertCircle size={14} /> Cancel Booking
              </button>
            ) : (
              <button className="text-[11px] font-black text-gray-400 hover:text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                Support Details
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {isCompleted ? (
              <button className="bg-orange-500 text-white text-[10px] font-black px-7 py-3.5 rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-95">
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
