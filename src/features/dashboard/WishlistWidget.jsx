import React from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WISHLIST_DATA } from "../../data/wishlistData.js";

const WishlistWidget = () => {
  const navigate = useNavigate();
  const displayItems = WISHLIST_DATA.slice(0, 2);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 w-full md:w-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">Your Wishlist</h3>
        <button
          onClick={() => navigate("/wishlist")}
          className="text-orange-500 text-xs font-bold hover:underline"
        >
          See all ({WISHLIST_DATA.length})
        </button>
      </div>

      <div className="space-y-6">
        {displayItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate("/wishlist")}
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
                <MapPin size={12} className="text-orange-500" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {item.location}
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
