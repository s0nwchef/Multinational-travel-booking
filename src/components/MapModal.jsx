import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X, Search, MapPin } from "lucide-react"; // ĐÃ THÊM MAPPIN

// Fix icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapController({ tours }) {
  const map = useMap();
  useEffect(() => {
    if (tours && tours.length > 0) {
      // Sửa cách lấy tọa độ từ mảng [lat, lng]
      const points = tours
        .filter(
          (t) => Array.isArray(t.coordinates) && t.coordinates.length === 2,
        )
        .map((t) => [t.coordinates[0], t.coordinates[1]]);

      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50], maxZoom: 12 });
      }
    }
  }, [tours, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function MapModal({ isOpen, onClose, tours }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  if (!isOpen) return null;

  const locations = Array.from(
    new Set(tours?.map((t) => t.location).filter(Boolean)),
  );
  const suggestions = locations.filter((loc) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTours = tours?.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-[2rem] overflow-hidden z-10 flex flex-col">
        {/* Search Bar */}
        <div className="absolute top-6 left-6 z-[1001] w-full max-w-sm px-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl shadow-lg border-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tìm địa điểm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
              size={18}
            />
            {showSuggestions && searchQuery && suggestions.length > 0 && (
              <div className="absolute w-full bg-white mt-1 rounded-lg shadow-xl border overflow-hidden">
                {suggestions.map((loc, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-orange-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSearchQuery(loc);
                      setShowSuggestions(false);
                    }}
                  >
                    <MapPin size={14} className="text-gray-400" /> {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[1001] p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <MapContainer
          center={[16.047, 108.206]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController tours={filteredTours} />
          {filteredTours?.map(
            (tour) =>
              // Kiểm tra tour.coordinates có tồn tại và đúng định dạng mảng
              tour.coordinates &&
              Array.isArray(tour.coordinates) && (
                <Marker
                  key={tour.id || tour._id}
                  position={[tour.coordinates[0], tour.coordinates[1]]}
                >
                  <Popup>
                    <div className="font-bold">{tour.title}</div>
                  </Popup>
                </Marker>
              ),
          )}
        </MapContainer>
      </div>
    </div>
  );
}
