import React, { useState, useEffect } from "react";
import { Star, Heart, MapPin } from "lucide-react";
import tourService from "../../services/Tours/tourService";
import { useNavigate } from "react-router-dom";
import VerticalTourCard from "../../components/ui/VerticalTourCard.jsx";

export default function SuggestedTours() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTours();
        setSuggestions(data.slice(3, 7));
      } catch (error) {
        console.error("Error fetching suggested tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleNavigateAllTours = () => {
    navigate("/tours");
    window.scrollTo(0, 0);
  };

  if (loading)
    return (
      <div className="p-20 text-center text-gray-400 animate-pulse font-bold">
        Finding suggestions for you...
      </div>
    );

  if (suggestions.length === 0) return null;

  return (
    <section className="bg-gray-100/80 p-8 rounded-[3rem] mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Suggested Tours
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Handpicked destinations just for your next trip
          </p>
        </div>

        <button
          onClick={handleNavigateAllTours}
          className="text-orange-500 font-bold text-sm hover:underline"
        >
          See more →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestions.map((tour) => (
          <VerticalTourCard key={tour.id || tour._id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
