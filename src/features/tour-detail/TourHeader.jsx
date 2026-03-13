import React from 'react';
import { ChevronRight, Star, Share2, Heart } from 'lucide-react';

export default function TourHeader({ tour }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text: tour.description,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 px-4">
        <span className="text-primary font-semibold">Destination</span>
        <ChevronRight className="w-4 h-4" />
        <span>Europe</span>
        <ChevronRight className="w-4 h-4" />
        <span>Italy</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-semibold">{tour.title}</span>
      </div>

      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {tour.title}
          </h1>

          {/* Rating and Info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(tour.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {tour.rating}/5
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({tour.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              <span className="flex items-center gap-1">📍 {tour.locations.join(', ')}</span>
              <span className="flex items-center gap-1">📅 {tour.duration} Days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
