import React, { useState, useEffect } from "react";
import TourCard from "./TourCard";
import TourFilters from "./TourFilters";
import {
  List,
  LayoutGrid,
  Map as MapIcon,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmptyResultsPage from "../../pages/EmptyResultPage";
import { useLocation } from "react-router-dom";

export const toursData = [
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
    infoItems: [{ icon: "Headphones", text: "Audio Guide" }],
    highlight: { text: "Free Cancellation", type: "free" },
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
    infoItems: [
      { icon: "Utensils", text: "Lunch Included" },
      { icon: "Bus", text: "Transport" },
    ],
    highlight: null,
    price: 89.0,
    originalPrice: 110.0,
    guests: "Max 15 people",
  },
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
  {
    id: 8,
    badge: "TRENDING",
    badgeType: "blue",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
    title: "Santorini Sunset Cruise with Dinner and Greek Wine",
    location: "SANTORINI",
    type: "WATER ACTIVITY",
    rating: 4.9,
    reviews: "3,200",
    duration: "5 hours",
    infoItems: [
      { icon: "Utensils", text: "Buffet Dinner" },
      { icon: "Languages", text: "English, Greek" },
    ],
    highlight: { text: "Best Sunset View", type: "instant" },
    price: 125.0,
    originalPrice: 160.0,
    guests: "Couple Friendly",
  },
  {
    id: 9,
    badge: "CULTURAL",
    badgeType: "purple",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    title: "Kyoto Private Tour: Fushimi Inari and Arashiyama Bamboo Grove",
    location: "KYOTO",
    type: "DISCOVERY",
    rating: 4.7,
    reviews: "6,850",
    duration: "8 hours",
    infoItems: [
      { icon: "Bus", text: "Private Transport" },
      { icon: "Camera", text: "Photo Spots" },
    ],
    highlight: null,
    price: 98.0,
    originalPrice: 130.0,
    guests: "Small Group",
  },
  {
    id: 10,
    badge: "TOP PICK",
    badgeType: "orange",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7a56?auto=format&fit=crop&q=80&w=800",
    title: "Statue of Liberty & Ellis Island Guided Tour with Ferry",
    location: "NEW YORK",
    type: "LANDMARK",
    rating: 4.6,
    reviews: "21,000",
    duration: "4 hours",
    infoItems: [
      { icon: "Ticket", text: "Ferry Ticket Included" },
      { icon: "Headphones", text: "Audio Guide" },
    ],
    highlight: { text: "Free Cancellation", type: "free" },
    price: 79.0,
    originalPrice: 95.0,
    guests: "All Ages",
  },
];

export default function TourList() {
  const location = useLocation();
  const searchQuery = location.state?.query || "";
  const [showMap, setShowMap] = useState(false);
  const [viewMode, setViewMode] = useState("list");

  const [filters, setFilters] = useState({
    price: 1200,
    category: "",
    duration: [],
    startDate: "",
    endDate: "",
    ratings: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handleResetFilters = () => {
    setFilters({
      price: 1200,
      category: "",
      duration: [],
      startDate: "",
      endDate: "",
      ratings: 0,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredTours = toursData.filter((tour) => {
    const matchesSearch =
      searchQuery === "" ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = tour.price <= filters.price;
    const matchesCategory =
      !filters.category ||
      tour.type.toLowerCase().includes(filters.category.toLowerCase());
    const matchesRatings = !filters.ratings || tour.rating >= filters.ratings;

    return matchesSearch && matchesPrice && matchesCategory && matchesRatings;
  });

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTours = filteredTours.slice(indexOfFirstItem, indexOfLastItem);

  if (filteredTours.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <EmptyResultsPage
          searchTerm={searchQuery || "your filters"}
          onReset={handleResetFilters}
          suggestedData={toursData}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 md:px-10 py-8">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-3">
          <span>Tours</span> <span className="text-[10px]">/</span>
          <span>Europe</span> <span className="text-[10px]">/</span>
          <span className="text-gray-900 font-semibold">Italy</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A202C] tracking-tight">
              Discover Italy
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Experience La Dolce Vita with our curated selection of{" "}
              <span className="font-bold text-gray-900">
                {filteredTours.length} tours.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm flex items-center gap-8 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                  Sort by:
                </span>
                <span className="text-[13px] font-bold text-gray-700">
                  Recommended
                </span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-orange-50 text-orange-600" : "text-gray-300"}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-orange-50 text-orange-600" : "text-gray-300"}`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            <button
              onClick={() => setShowMap(true)}
              className="bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-sm flex items-center gap-2 text-[13px] font-black text-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-orange-50"
            >
              <MapIcon
                size={18}
                className="text-orange-500"
                strokeWidth={2.5}
              />
              Map View
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 w-full items-start">
        <div className="w-full lg:w-[400px] shrink-0">
          <TourFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1 min-w-0">
          {searchQuery && (
            <div className="mb-6 text-xl text-gray-700 font-medium">
              Results for:{" "}
              <span className="font-black text-orange-500">
                "{searchQuery}"
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "All Tours",
              "Historical",
              "Water Activity",
              "Day Trip",
              "City Tour",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  handleFilterChange("category", cat === "All Tours" ? "" : cat)
                }
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  filters.category === cat ||
                  (cat === "All Tours" && !filters.category)
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "grid grid-cols-1 gap-6"
            }
          >
            {currentTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 mb-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-bold border ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`p-2 rounded-lg border border-gray-200 ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/*  MODAL BẢN ĐỒ*/}
      {showMap && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/90 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
            <iframe
              title="Italy Tour Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509364!2d144.9537353153403!3d-37.816279742021234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1a32f9b1b0!2sMelbourne!5e0!3m2!1sen!2sau!4v1531814675542"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
