import React from "react";
import { Calendar } from "lucide-react";

export const WishlistData = [
  {
    id: 1,
    title: "Tokyo Tower Main Observatory Ticket",
    startDate: "Oct 24, 2024",
    endDate: "Oct 24, 2024",
    price: 28.0,
    image: "https://picsum.photos/seed/tokyo/200/200",
    status: "CONFIRMED",
    adults: 2,
  },
  {
    id: 2,
    title: "teamLab Planets TOKYO: Digital Art Museum Entrance Ticket",
    startDate: "Oct 25, 2024",
    endDate: "Oct 25, 2024",
    price: 35.5,
    image: "https://picsum.photos/seed/teamlab/200/200",
    status: "PENDING",
    adults: 1,
  },
  {
    id: 3,
    title: "Tokyo Subway Ticket (24/48/72 Hours) - Unlimited Rides",
    startDate: "Oct 24, 2024",
    endDate: "Oct 27, 2024",
    price: 18.0,
    image: "https://picsum.photos/seed/subway/200/200",
    status: "CONFIRMED",
    adults: 2,
  },
];

const WishlistWidget = () => {
  const displayItems = WishlistData.slice(0, 2);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 w-full md:w-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">Your Wishlist</h3>
        <button className="text-orange-500 text-xs font-bold hover:underline">
          See all ({WishlistData.length})
        </button>
      </div>

      <div className="space-y-6">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
              <img
                src={item.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={item.title}
              />
            </div>

            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center gap-1.5 mt-1">
                <Calendar size={12} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 font-medium">
                  {item.startDate} - {item.endDate}
                </p>
              </div>

              <div className="mt-2">
                <span className="text-sm font-black text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistWidget;
