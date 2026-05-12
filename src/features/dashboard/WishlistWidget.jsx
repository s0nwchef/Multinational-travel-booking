import React, { useState, useEffect } from "react";
import { MapPin, Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wishlistService from "../../services/wishlists/wishlistService.js";

const WishlistWidget = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await wishlistService.getWishlist();
        setItems(data.items.slice(0, 2));
        setCount(data.count);
      } catch (err) {
        console.error("WishlistWidget error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 w-full md:w-[350px] flex items-center justify-center min-h-[160px]">
        <Loader2 size={24} className="text-orange-400 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 w-full md:w-[350px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900">Your Wishlist</h3>
        </div>
        <div className="flex flex-col items-center py-6 text-center">
          <Heart size={28} className="text-orange-200 mb-2" />
          <p className="text-sm text-gray-400 font-medium">
            No saved tours yet
          </p>
          <button
            onClick={() => navigate("/tours")}
            className="mt-3 text-orange-500 text-xs font-bold hover:underline"
          >
            Explore Tours →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 w-full md:w-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">Your Wishlist</h3>
        <button
          onClick={() => navigate("/wishlist")}
          className="text-orange-500 text-xs font-bold hover:underline"
        >
          See all ({count})
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/tour/${item.id}`)}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
              <img
                src={item.image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={item.title}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-gray-900 line-clamp-1 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-orange-500 shrink-0" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                  {item.location}
                </p>
              </div>

              <div className="mt-2">
                <span className="text-sm font-black text-gray-900">
                  ${item.basePrice?.toLocaleString() || "0"}
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
