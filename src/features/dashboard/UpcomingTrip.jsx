import React from "react";
import { WishlistData } from "./WishlistWidget.jsx";

const UpcomingTrip = () => {
  const featuredTrip = WishlistData[0];

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex-1 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">Upcoming Trip</h3>
        <button className="text-orange-500 text-xs font-bold hover:underline">
          View all bookings
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-5 bg-gray-50 rounded-[2.5rem] items-center border border-transparent hover:border-orange-100 transition-all">
        <div className="w-full md:w-32 h-32 bg-orange-100 rounded-[1.8rem] overflow-hidden shrink-0 shadow-sm">
          <img
            src={featuredTrip.image}
            className="w-full h-full object-cover"
            alt={featuredTrip.title}
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-black text-gray-900 text-base md:text-lg leading-tight line-clamp-2">
              {featuredTrip.title}
            </h4>
            <span
              className={`text-[10px] font-black px-3 py-1.5 rounded-xl shrink-0 ${
                featuredTrip.status === "CONFIRMED"
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {featuredTrip.status}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">
            {featuredTrip.startDate} - {featuredTrip.endDate} •{" "}
            {featuredTrip.adults} Adults
          </p>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 md:flex-none bg-orange-500 text-white text-[11px] font-black px-6 py-3 rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95">
              View Voucher
            </button>
            <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-600 text-[11px] font-black px-6 py-3 rounded-xl hover:bg-gray-50 transition-all">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTrip;
