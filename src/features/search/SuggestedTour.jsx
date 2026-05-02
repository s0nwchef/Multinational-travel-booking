import React from "react";
import { ArrowRight, Star } from "lucide-react";

// Fallback mock data for suggested tours
const defaultTours = [
  {
    id: 4,
    title: "Paris, France",
    location: "PARIS",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviews: "8,500",
    duration: "5 nights",
    guests: "2 Adults",
    originalPrice: 580,
    price: 450,
    badge: "POPULAR",
    badgeType: "orange",
    type: "CITY TOUR",
  },
  {
    id: 5,
    title: "Bali, Indonesia",
    location: "BALI",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviews: "15,200",
    duration: "7 nights",
    guests: "All Inclusive",
    originalPrice: 750,
    price: 620,
    badge: "TOP RATED",
    badgeType: "blue",
    type: "BEACH HOLIDAY",
  },
  {
    id: 6,
    title: "Tokyo, Japan",
    location: "TOKYO",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviews: "10,100",
    duration: "4 nights",
    guests: "City Center",
    originalPrice: 890,
    price: 780,
    badge: "CULTURE",
    badgeType: "purple",
    type: "DISCOVERY",
  },
  {
    id: 7,
    title: "Rome, Italy",
    location: "ROME",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviews: "5,400",
    duration: "3 nights",
    guests: "Historic",
    originalPrice: 600,
    price: 510,
    badge: "HISTORY",
    badgeType: "orange",
    type: "LANDMARK",
  },
];

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
  // Use fallback mock data for suggested tours (id 4-7)
  const displayTours = defaultTours.filter((tour) => {
    const rawId = tour.id ?? tour._id;
    const n = Number(rawId);
    if (!Number.isNaN(n)) return n >= 4 && n <= 7;
    return false;
  });

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
        {displayTours.map((tour) => {
          const key = tour.id || tour._id;
          return <VerticalCard key={key} tour={tour} />;
        })}
      </div>
    </div>
  );
}
