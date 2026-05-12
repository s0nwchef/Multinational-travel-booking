import React, { useState, useEffect } from "react";
import tourService from "../../services/Tours/tourService";
import { useNavigate } from "react-router-dom";
import VerticalTourCard from "../../components/ui/VerticalTourCard.jsx";

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
