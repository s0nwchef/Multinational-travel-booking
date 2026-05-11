import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookings/bookingService.js";
import {
  Loader2,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const UpcomingTrip = () => {
  const navigate = useNavigate();
  const [upcomingList, setUpcomingList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await bookingService.getMyBookings();
        const sorted = data
          .filter((item) => item.tabGroup === "upcoming")
          .sort((a, b) => {
            const parseDate = (str) => {
              if (!str || str === "TBA") return Infinity;
              const [d, m, y] = str.split("/");
              return new Date(y, m - 1, d).getTime();
            };
            return parseDate(a.departureDate) - parseDate(b.departureDate);
          });
        setUpcomingList(sorted);
      } catch (error) {
        console.error("Failed to load upcoming trip:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const formatDate = (str) => {
    if (!str || str === "TBA") return "TBA";
    const [d, m, y] = str.split("/");
    return new Date(y, m - 1, d)
      .toLocaleDateString("en-US", { month: "short", day: "numeric" })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex-1 h-full flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (upcomingList.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex-1 h-full flex flex-col justify-center items-center text-center">
        <p className="text-gray-400 font-bold italic">
          You have no upcoming trips.
        </p>
        <button
          onClick={() => navigate("/tours")}
          className="mt-4 text-orange-500 font-black text-sm hover:underline"
        >
          Explore Tours Now →
        </button>
      </div>
    );
  }

  const trip = upcomingList[currentIndex];
  const totalPassengers = (trip.numAdults || 0) + (trip.numChildren || 0);
  const hasNext = currentIndex < upcomingList.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 flex-1 h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-lg text-gray-900">Upcoming Trip</h3>
        <button
          onClick={() => navigate("/my-bookings")}
          className="text-orange-500 text-xs font-bold hover:underline"
        >
          View all bookings
        </button>
      </div>

      {/* CARD */}
      <div
        className="relative flex gap-0 rounded-[2rem] overflow-hidden border border-gray-100 hover:border-orange-100 transition-all group shadow-sm cursor-pointer bg-white"
        onClick={() =>
          navigate("/my-bookings", { state: { scrollToId: trip.id } })
        }
      >
        {/* IMAGE */}
        <div className="p-1 shrink-0">
          <div className="w-60 h-full rounded-[1.5rem] overflow-hidden">
            <img
              src={trip.tourImage}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt={trip.tourTitle}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image";
              }}
            />
          </div>
        </div>
        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between p-5 bg-gray-50 rounded-r-[2rem] min-w-0">
          <div>
            {/* Title + status */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-black text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">
                {trip.tourTitle}
              </h4>
              <span
                className={`text-[9px] font-black px-2.5 py-1 rounded-lg shrink-0 uppercase ${
                  trip.status === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {trip.status}
              </span>
            </div>

            {/* Date pill */}
            <p className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-blue-100 w-fit mb-3">
              📅 {formatDate(trip.departureDate)}
              {trip.returnDate ? ` - ${formatDate(trip.returnDate)}` : ""}
            </p>

            {/* Info rows */}
            <div className="flex flex-row items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                <Users size={12} className="text-orange-500" />
                {totalPassengers}{" "}
                {totalPassengers > 1 ? "Travelers" : "Traveler"}
                {` (${trip.numAdults}A, ${trip.numChildren}C)`}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                <Calendar size={12} className="text-orange-500" />
                Booked {trip.bookingDate}
              </span>
            </div>
          </div>
        </div>

        {/* NAV ARROWS */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => i - 1);
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all z-10"
          >
            <ChevronLeft size={14} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => i + 1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all z-10"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UpcomingTrip;
