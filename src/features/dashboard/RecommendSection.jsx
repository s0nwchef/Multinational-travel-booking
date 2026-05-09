import React, { useState, useEffect } from "react";
import { Star, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import tourService from "../../services/Tours/tourService";
import { useNavigate } from "react-router-dom";

const VerticalTourCard = ({ tour }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/tour/${tour.id}`)}
      className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
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

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
          <MapPin size={14} className="text-orange-500" />
          <span>{tour.location}</span>
        </div>

        <h3 className="text-lg font-extrabold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
          {tour.title}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{tour.rating}</span>
          <span className="text-[10px] text-gray-400">
            ({tour.totalReviews || 0})
          </span>
        </div>

        <div className="mt-auto flex justify-between items-end">
          <div className="flex flex-col">
            {tour.originalPrice && (
              <span className="text-[9px] text-gray-400 font-bold uppercase line-through">
                $ {Number(tour.originalPrice).toLocaleString()}
              </span>
            )}
            <span className="text-lg font-black text-gray-900">
              $ {tour.basePrice?.toLocaleString() || "0"}
            </span>
          </div>

          <button className="text-[15px] font-black text-orange-500 hover:underline">
            Detail →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function RecommendSection() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTours();
        setRecommendations(data.slice(0, 3));
      } catch (error) {
        console.error("Error recommend tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleSeeMore = () => {
    navigate("/tours");
    window.scrollTo(0, 0);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading recommendations...
      </div>
    );
  if (recommendations.length === 0) return null;

  return (
    <section className="bg-gray-100/50 rounded-[2.5rem] p-8 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-900">Recommend for you</h2>
        <button
          onClick={handleSeeMore}
          className="text-orange-500 font-bold text-sm hover:underline"
        >
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
