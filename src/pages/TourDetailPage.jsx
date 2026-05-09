import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TourHeader from "../features/tour-detail/TourHeader";
import TourGallery from "../features/tour-detail/TourGallery";
import TourInfo from "../features/tour-detail/TourInfo";
import FavoriteChoices from "../features/home/FavoriteChoices";
import ReviewsSection from "../features/tour-detail/ReviewsSection";
import tourService from "../services/tourService.js";
// import { toursData as mockToursData } from '../features/tours/TourList';

// Mock data - fallback if API fails
const mockTours = {
  "best-of-italy": {
    id: "best-of-italy",
    title: "Best of Italy: Rome, Florence & Venice",
    description:
      "Experience the magic of Italy with this comprehensive 10-day tour covering the country's most iconic destinations. From the ancient ruins of Rome to the Renaissance art of Florence and the romantic canals of Venice, this journey showcases the best of Italian culture, history, and cuisine.",
    rating: 4.9,
    reviewCount: 1204,
    locations: ["Rome", "Florence", "Venice"],
    duration: 10,
    season: "Spring & Fall",
    price: 2499,
    bestTime: "Apr - May, Sep - Oct",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OvRASFO31ZZGOgf3h0d2AMRJCzVlXD.png",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpvrVJLhq4tKX7Z3q4U5X9Z7Y8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKw6ZaDdbakvTBsEA6OxVwPPIqIaxpaXdyt8f2lucxJZFXPZTlSSKiPrrhlx3Jy0JKhD5S0ioMQB4kdgdM1MRF2zCPUlx8lahi-a-aDwDa2ba0wNxZ6gszpNZxORIpsedwhPp37aXdd1AaJSN_trEbCBxcLxIPK_fDJFjy3aT3-7PozWpUX0BefHqet7ghT-fxh_36E4glxS_IhFixKqxbg1IUtPh68pNIznNGpG44womHUT49imy_JInsFEcPQEx2QFWfw1LXP2Q",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVVJ4xtbKwIy74kFMWhzYVhPxj10HkoKw6l5ODmoDoDvtBBzAMDrTCOCViKIOt3HEPjwtGoVCDs_7foM6W1dlvz2OoTenySiMsn3Ri1npITC0FwAO4JIoLexbt1KOQ5w8Y5yBRodEYzR9YNpxGPvYIL-V7XkY12AHd0qZVYaOgSnNx-tqEkJ1jVLbk9xShZv6hjI8bfhzFvqYIr1AyIkGXFIwN08rK120QG6yYObiVoq-aS-4ujoHPi-MBQZ3mGvQTmZkcqh2viVS_",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABpVd8LUu6HRLOSsrS6gqo8pWKV_gjq2AJIVnGjhZncItF0E6l97Z1KVZu0KrZhGDvM0PIOmL_NoOgE4tXsO_k5p84Z3L9KLTv70a9QwJzVwaIiY7w8VbavPsR0X1Uaz6FrLRB0pLikuENBhEY9UNs2ChtZIsR-XDl2sh5tU84HHf5A1vRp4GRr-z2jVI6-ZL7CjJGHEadu_9XnG-yV25WRByp1mvdNPbYrtZAiSBiORhv6OwcRSrT5ERhGq5IlFa93k3rOVVQMssc",
    ],
    highlights: [
      "Explore the ancient Colosseum and Roman Forum in Rome",
      "Admire Renaissance masterpieces in Florence's Uffizi Gallery",
      "Romantic gondola ride through Venice's scenic canals",
      "Visit world-famous Vatican Museums and St. Peter's Basilica",
      "Indulge in authentic Italian cuisine and wines",
      "Expert-guided tours of historical landmarks",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Rome",
        description:
          "Arrive in Rome and settle into your hotel. Enjoy a welcome dinner at a traditional trattoria near the Spanish Steps.",
      },
      {
        day: 2,
        title: "Ancient Rome",
        description:
          "Full-day tour of the Colosseum, Roman Forum, and Palatine Hill. Evening stroll through historic neighborhoods.",
      },
      {
        day: 3,
        title: "Vatican City",
        description:
          "Explore Vatican Museums, Sistine Chapel, and St. Peter's Basilica with a professional art historian guide.",
      },
      {
        day: 4,
        title: "Rome to Florence",
        description:
          "Travel to Florence by high-speed train. Afternoon tour of the Duomo and city center.",
      },
      {
        day: 5,
        title: "Renaissance Florence",
        description:
          "Visit Uffizi Gallery, Accademia Gallery, and Ponte Vecchio. Wine tasting in the evening.",
      },
      {
        day: 6,
        title: "Tuscany Countryside",
        description:
          "Day trip to Tuscan villages. Visit a family-run vineyard and enjoy a wine and food pairing experience.",
      },
      {
        day: 7,
        title: "Florence to Venice",
        description:
          "Travel to Venice by train. Explore the city and get lost in its romantic streets and canals.",
      },
      {
        day: 8,
        title: "Venetian Experience",
        description:
          "Gondola ride through scenic canals. Visit St. Mark's Basilica and learn about Venetian history.",
      },
      {
        day: 9,
        title: "Island Exploration",
        description:
          "Day trip to Murano and Burano islands. Watch glassblowing demonstrations and see colorful fishing villages.",
      },
      {
        day: 10,
        title: "Departure",
        description:
          "Final morning in Venice. Depart for airport with unforgettable memories of Italy.",
      },
    ],
  },
};

const TourDetailPage = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTour = async () => {
      if (!tourId) {
        if (mounted) setError("Tour ID không hợp lệ");
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // If route uses numeric mock id, use local mock data instead of API
        if (/^\d+$/.test(tourId)) {
          const local = mockToursData.find(
            (t) => String(t.id) === String(tourId),
          );
          if (local) {
            const normalizedLocal = {
              id: local.id || local._id,
              title: local.title,
              description: local.description || local.highlight?.text || "",
              rating: local.rating || 0,
              reviewCount: local.reviews || 0,
              locations: [local.location || ""],
              duration: local.duration || 0,
              season: "",
              price: local.price || 0,
              bestTime: "",
              images: [local.image].filter(Boolean),
              highlights: local.highlight ? [local.highlight.text] : [],
              itinerary: [],
            };
            if (mounted) setTour(normalizedLocal);
            return;
          }
        }

        // Call API using tourService
        const data = await tourService.getTourById(tourId);

        // Normalize backend fields to UI expected keys
        const normalized = {
          id: data._id || data.id,
          title: data.title || "Untitled tour",
          description: data.description || "",
          rating: data.averageRating ?? data.rating ?? 0,
          reviewCount: data.totalReviews ?? data.reviewCount ?? 0,
          locations: data.destinationId
            ? [data.destinationId.name].filter(Boolean)
            : data.locations || [],
          duration: data.duration || data.days || 0,
          season: data.season || "",
          price: data.basePrice ?? data.price ?? 0,
          bestTime: data.bestTime || "",
          images:
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : data.imageUrl
                ? [data.imageUrl]
                : [],
          highlights: data.included || data.highlights || [],
          itinerary: (data.itinerary || []).map((it) => ({
            day: it.day,
            title: it.activity || it.title,
            description: it.description || "",
          })),
        };

        if (mounted) setTour(normalized);
      } catch (err) {
        console.error("Error fetching tour:", err);
        let errorMessage = "Lỗi khi tải tour. Vui lòng thử lại.";

        if (err.message) {
          if (err.message.includes("404")) {
            errorMessage = "Tour không được tìm thấy.";
          } else if (err.message.includes("500")) {
            errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
          } else {
            errorMessage = err.message;
          }
        }

        if (mounted) setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTour();
    return () => {
      mounted = false;
    };
  }, [tourId]);

  if (loading)
    return <div className="py-12 text-center">Đang tải thông tin tour...</div>;
  if (error)
    return <div className="py-12 text-center text-red-500">Lỗi: {error}</div>;
  if (!tour)
    return <div className="py-12 text-center">Không tìm thấy tour.</div>;

  return (
    <div className="w-full space-y-12 pb-12">
      {/* Header Section */}
      <section className="bg-white dark:bg-black">
        <TourHeader tour={tour} />
      </section>

      {/* Gallery Section */}
      <section className="bg-white dark:bg-black py-8">
        <TourGallery images={tour.images} />
      </section>

      {/* Info Section */}
      <section className="bg-white dark:bg-black">
        <TourInfo tour={tour} />
      </section>

      {/* You might also like Section */}
      <FavoriteChoices />

      {/* Reviews Section */}
      <ReviewsSection tour={tour} />
    </div>
  );
};

export default TourDetailPage;
