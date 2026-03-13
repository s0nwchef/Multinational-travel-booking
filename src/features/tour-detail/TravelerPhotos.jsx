import React, { useState } from 'react';

const TravelerPhotos = ({ photos }) => {
  const [showMore, setShowMore] = useState(false);
  const displayPhotos = showMore ? photos : photos.slice(0, 5);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Traveler Photos</h3>
        <button className="text-[#FF5B00] text-sm font-semibold hover:underline">
          View all {photos.length} →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {displayPhotos.slice(0, 4).map((photo, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg h-40 cursor-pointer group"
          >
            <img
              src={photo}
              alt={`Traveler photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />
          </div>
        ))}

        {/* Show More Button */}
        {photos.length > 4 && (
          <div className="relative overflow-hidden rounded-lg h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition flex items-center justify-center">
              <span className="text-white font-semibold text-lg">+{photos.length - 4}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelerPhotos;
