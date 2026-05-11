import React, { useState, useEffect, useMemo } from "react";
import TourCard from "./TourCard";
import TourFilters from "./TourFilters";
import EmptyResultsPage from "../../pages/EmptyResultPage";
import { useLocation, useNavigate } from "react-router-dom";
import tourService from "../../services/Tours/tourService";
import MapModal from "../../components/MapModal";
import {
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function TourList() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = location.state?.query || "";
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    price: 10000,
    category: "All Tours",
    duration: [],
    startDate: "",
    endDate: "",
    ratings: 0,
    location: "",
  });

  const [sortBy, setSortBy] = useState("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const data = await tourService.getTours();
        setTours(data);
      } catch (error) {
        console.error("Error fetching API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [searchQuery]);

  useEffect(() => {
    const prefill = location.state?.prefillFilters;
    if (prefill && !loading) {
      setFilters((prev) => ({ ...prev, ...prefill }));
    }
  }, [location.state?.prefillFilters, loading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setFilters({
      price: 10000,
      category: "All Tours",
      duration: [],
      startDate: "",
      endDate: "",
      ratings: 0,
    });
    setSortBy("recommended");

    navigate("/tours", { replace: true, state: {} });

    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const dynamicCategories = [
    "All Tours",
    ...new Set(tours.map((tour) => tour.city).filter(Boolean)),
  ];

  // 1. FILTER DATA
  const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filteredTours = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase().trim();

    const safeSearch = escapeRegex(searchTerm);

    const regex = new RegExp(`\\b${safeSearch}`, "i");

    return tours.filter((tour) => {
      const matchesSearch =
        searchTerm === "" ||
        regex.test(tour.title) ||
        regex.test(tour.location) ||
        regex.test(tour.country);

      const matchesPrice = tour.departures?.length
        ? tour.departures.some((d) => (d.giaNguoiLon || 0) <= filters.price)
        : (tour.basePrice || 0) <= filters.price;

      const matchesCategory =
        filters.category === "All Tours" ||
        tour.city?.toLowerCase() === filters.category?.toLowerCase() ||
        tour.country?.toLowerCase() === filters.category?.toLowerCase();

      const matchesDuration =
        filters.duration.length === 0 ||
        filters.duration.some((d) => {
          const days = tour.soNgay || 0;

          if (d === "Less than 1 day") return days < 1;
          if (d === "1 day") return days === 1;
          if (d === "2-3 days") return days >= 2 && days <= 3;
          if (d === "4+ days") return days >= 4;

          return true;
        });

      const matchesDate = (() => {
        if (!filters.startDate || !filters.endDate) return true;
        const userStart = new Date(filters.startDate).setHours(0, 0, 0, 0);
        const userEnd = new Date(filters.endDate).setHours(23, 59, 59, 999);

        return tour.departures?.some((d) => {
          const s = new Date(d.ngayKhoiHanh).getTime();
          const e = new Date(d.ngayVe).getTime();
          return s >= userStart && e <= userEnd;
        });
      })();
      const matchesRating =
        filters.ratings === 0 || tour.rating >= filters.ratings;

      const matchesLocation = filters.location
        ? tour.location
            .toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          tour.title.toLowerCase().includes(filters.location.toLowerCase())
        : true;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesCategory &&
        matchesDuration &&
        matchesDate &&
        matchesRating &&
        matchesLocation
      );
    });
  }, [tours, searchQuery, filters]);

  const durationCounts = useMemo(() => {
    const counts = {
      "Less than 1 day": 0,
      "1 day": 0,
      "2-3 days": 0,
      "4+ days": 0,
    };

    filteredTours.forEach((tour) => {
      const days = tour.soNgay;

      if (days < 1) counts["Less than 1 day"]++;
      else if (days === 1) counts["1 day"]++;
      else if (days >= 2 && days <= 3) counts["2-3 days"]++;
      else if (days >= 4) counts["4+ days"]++;
    });

    return counts;
  }, [filteredTours]);

  // 2. SORT DATA
  const getMinPrice = (tour) => tour.basePrice || 0;

  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === "price-asc") {
      return getMinPrice(a) - getMinPrice(b);
    }

    if (sortBy === "price-desc") {
      return getMinPrice(b) - getMinPrice(a);
    }

    if (sortBy === "rating") return b.rating - a.rating;

    return 0;
  });

  const totalPages = Math.ceil(sortedTours.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTours = sortedTours.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="text-center py-20 font-bold text-gray-500">
        Loading Tour...
      </div>
    );
  }

  if (sortedTours.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <EmptyResultsPage
          searchTerm={searchQuery || "your filters"}
          onReset={handleResetFilters}
          suggestedData={tours}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-4 md:px-10 py-8">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-3">
          <span>Tours</span> <span className="text-[10px]">/</span>
          <span className="text-gray-900 font-semibold">
            {searchQuery ? "Search Results" : "All Destinations"}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A202C] tracking-tight">
              {searchQuery
                ? `Searching: "${searchQuery}"`
                : "Explore All Tours"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              We found{" "}
              <span className="font-bold text-gray-900">
                {sortedTours.length} tours
              </span>{" "}
              matching your criteria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SORT BY */}
            <div className="relative min-w-[200px]">
              <div
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:border-orange-200 transition-all group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">
                    Sort by:
                  </span>
                  <span className="text-[13px] font-bold text-gray-800">
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-orange-500 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[60]"
                    onClick={() => setIsSortOpen(false)}
                  />

                  <div className="absolute top-[calc(100%+8px)] right-0 w-full bg-white border border-gray-50 rounded-2xl shadow-xl z-[70] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`px-4 py-3 text-[13px] font-bold cursor-pointer transition-all ${
                          sortBy === option.value
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-500"
                        }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* BUTTON MAP */}
            <button
              onClick={() => setIsMapOpen(true)}
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
          <TourFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            durationCounts={durationCounts}
            categories={dynamicCategories}
            tours={tours}
            isMapOpen={isMapOpen}
            setIsMapOpen={setIsMapOpen}
          />{" "}
        </div>

        <div className="flex-1 min-w-0">
          {/* CATEGORY */}
          <div className="flex flex-wrap gap-2 mb-8">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange("category", cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  filters.category === cat
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                    : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {currentTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} filters={filters} />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 mb-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`p-2 rounded-lg border border-gray-200 ${
                  currentPage === 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
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
                className={`p-2 rounded-lg border border-gray-200 ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        tours={sortedTours}
      />
    </div>
  );
}
