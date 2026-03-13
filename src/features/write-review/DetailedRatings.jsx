import React, { useState } from 'react';

export default function DetailedRatings({ ratings, setRatings }) {
  const [expanded, setExpanded] = useState({});

  const ratingCategories = [
    { key: 'serviceQuality', label: 'Service Quality' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'valueForMoney', label: 'Value for Money' },
    { key: 'guideKnowledge', label: 'Guide Knowledge' }
  ];

  const handleStarClick = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
    setExpanded(prev => ({
      ...prev,
      [category]: false
    }));
  };

  const StarRating = ({ category, value }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleStarClick(category, star)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-6 h-6 ${
              star <= value
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Detailed Ratings</h2>
      
      <div className="space-y-4">
        {ratingCategories.map((category) => (
          <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{category.label}</p>
              <div className="mt-2">
                <StarRating category={category.key} value={ratings[category.key] || 0} />
              </div>
            </div>
            {ratings[category.key] ? (
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {ratings[category.key]}/5
              </span>
            ) : (
              <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                Select
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
