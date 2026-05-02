import React from "react";
import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

// Fallback mock data for recommendations
const defaultTours = [
  {
    id: 1,
    badge: "BEST SELLER",
    badgeType: "orange",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800",
    title: "Colosseum, Roman Forum & Palatine Hill Priority Access Guide",
    location: "ROME",
    type: "HISTORICAL TOUR",
    rating: 4.8,
    reviews: "12,403",
    duration: "3 hours",
    price: 55.0,
    originalPrice: 65.0,
    guests: "Group Tour",
  },
  {
    id: 2,
    badge: "KLOOK EXCLUSIVE",
    badgeType: "blue",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=800",
    title: "Venice Gondola Ride with Audio Guide",
    location: "VENICE",
    type: "WATER ACTIVITY",
    rating: 4.5,
    reviews: "4,800",
    duration: "30 mins",
    price: 32.5,
    originalPrice: 40.0,
    guests: "Private Tour",
  },
  {
    id: 3,
    badge: "SMALL GROUP",
    badgeType: "purple",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
    title: "Tuscany Day Trip from Florence with Chianti Wine Tasting",
    location: "FLORENCE",
    type: "DAY TRIP",
    rating: 4.9,
    reviews: "2,100",
    duration: "10 hours",
    price: 89.0,
    originalPrice: 110.0,
    guests: "Max 15 people",
  },
];

const VerticalTourCard = ({ tour }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
  >
    <div className="relative h-48">
      <img
        src={tour.image}
        className="w-full h-full object-cover"
        alt={tour.title}
      />
      {tour.badge && (
        <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg uppercase">
          {tour.badge}
        </span>
      )}
      <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
        <Heart size={16} />
      </button>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        {tour.location}
      </span>
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
        {tour.title}
      </h3>

      <div className="flex items-center gap-1 mb-4">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold">{tour.rating}</span>
        <span className="text-[10px] text-gray-400">({tour.reviews})</span>
      </div>

      <div className="mt-auto flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-400 font-bold uppercase line-through">
            US$ {tour.originalPrice}
          </span>
          <span className="text-lg font-black text-gray-900">
            US$ {tour.price}
          </span>
        </div>

        <button className="text-[15px] font-black text-orange-500 hover:underline">
          Detail →
        </button>
      </div>
    </div>
  </motion.div>
);

export default function RecommendSection() {
  // Use fallback mock data for recommendations (first 3 tours)
  const recommendations = (defaultTours || []).slice(0, 3);

  return (
    <section className="bg-gray-100/50 rounded-[2.5rem] p-8 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Recommend for you</h2>
        <button className="text-orange-500 font-bold text-sm hover:underline">
          See more →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((tour) => {
          const key = tour.id || tour._id;
          return <VerticalTourCard key={key} tour={tour} />;
        })}
      </div>
    </section>
  );
}
