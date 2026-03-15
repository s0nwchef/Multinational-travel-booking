import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { toursData } from "../tours/TourList";

function VerticalCard({ tour }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-[13px] font-bold flex items-center gap-1 shadow-sm">
          {tour.rating}
          <Star size={12} className="fill-gray-900 text-gray-900" />
        </div>
      </div>

      <div className="flex justify-between items-start px-1">
        <div>
          <h4 className="text-[17px] font-bold text-gray-900 mb-1">
            {tour.title}
          </h4>
          <p className="text-[13px] text-gray-500 font-medium">
            {tour.duration} • {tour.guests}
          </p>
        </div>
        <div className="text-right">
          {tour.originalPrice && (
            <p className="text-[13px] text-gray-400 line-through mb-0.5">
              ${tour.originalPrice}
            </p>
          )}
          <p className="text-[18px] font-bold text-[#FF7029]">${tour.price}</p>
        </div>
      </div>
    </div>
  );
}

export default function SuggestedTours() {
  const displayTours = toursData.filter((tour) => tour.id >= 4 && tour.id <= 7);

  return (
    <div className="w-full mt-16 px-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Or Explore Top Destinations
        </h3>
        <button className="flex items-center gap-1 text-[#FF7029] font-semibold text-sm hover:underline">
          View all <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTours.map((tour) => (
          <VerticalCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
}
