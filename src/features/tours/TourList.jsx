import React, { useState } from "react";
import TourCard from "./TourCard";
import TourFilters from "./TourFilters";
import { ChevronLeft, ChevronRight } from "lucide-react";

const toursData = [
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
    infoItems: [{ icon: "Languages", text: "English, Spanish +3" }],
    highlight: { text: "Instant Confirmation", type: "instant" },
    price: 55.0,
    originalPrice: 65.0,
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
    infoItems: [{ icon: "Headphones", text: "Audio Guide" }],
    highlight: { text: "Free Cancellation", type: "free" },
    price: 32.5,
  },
  {
    id: 3,
    badge: "SMALL GROUP",
    badgeType: "purple",
    image:
      "https://images.unsplash.com/photo-1531012278483-fa597e70f22f?auto=format&fit=crop&q=80&w=800",
    title: "Tuscany Day Trip from Florence with Chianti Wine Tasting",
    location: "FLORENCE",
    type: "DAY TRIP",
    rating: 4.9,
    reviews: "2,100",
    duration: "10 hours",
    infoItems: [
      { icon: "Utensils", text: "Lunch Included" },
      { icon: "Bus", text: "Transport" },
    ],
    highlight: null,
    price: 89.0,
  },
];

export default function TourList() {
  const [filters, setFilters] = useState({
    price: 1200,
    category: "",
    duration: [],
    rating: [],
    startDate: "",
    endDate: "",
    ratings: [],
  });

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredTours = toursData.filter((tour) => {
    const matchesPrice = tour.price <= filters.price;

    const matchesCategory =
      !filters.category ||
      tour.type.toLowerCase().includes(filters.category.toLowerCase());

    const matchesRatings =
      !filters.ratings ||
      (filters.ratings === 5
        ? tour.rating === 5
        : tour.rating >= filters.ratings);

    return matchesPrice && matchesCategory && matchesRatings;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
      {/* Bộ lọc bên trái */}
      <TourFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Nội dung bên phải */}
      <div className="w-full lg:w-3/4">
        {/* --- 1. PHẦN NAV TRÊN CARD (Category Tabs) --- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "All Tours",
            "Attractions",
            "Day Trips",
            "Food & Drink",
            "Transportation",
          ].map((cat, index) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                index === 0
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- 2. DANH SÁCH CARD --- */}
        <div className="grid grid-cols-1 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* --- 3. PHẦN TRANG DƯỚI CARD (Pagination) --- */}
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
          <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronLeft size={20} />
          </button>

          {[1, 2, 3, "...", 8].map((page, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg font-bold transition-all border ${
                page === 1
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {page}
            </button>
          ))}

          <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
