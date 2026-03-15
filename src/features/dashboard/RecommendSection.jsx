import React from "react";
import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toursData } from "../tours/TourList";

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
  const recommendations = toursData.slice(0, 3);

  return (
    <section className="bg-gray-100/50 rounded-[2.5rem] p-8 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Recommend for you</h2>
        <button className="text-orange-500 font-bold text-sm hover:underline">
          See more →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((tour) => (
          <VerticalTourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
