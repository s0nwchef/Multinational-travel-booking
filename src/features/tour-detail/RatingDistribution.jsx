import React from 'react';
import { Star } from 'lucide-react';

const RatingDistribution = ({ averageRating, totalReviews, distribution }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Rating Summary */}
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 md:w-40">
        <div className="text-5xl font-bold text-[#FF5B00] mb-2">{averageRating}</div>
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={i < Math.round(averageRating) ? 'fill-[#FF5B00] text-[#FF5B00]' : 'text-gray-300'}
            />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
          Based on {totalReviews.toLocaleString()} reviews
        </p>
      </div>

      {/* Distribution Chart */}
      <div className="flex-1">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-3 mb-3">
            <div className="w-8 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.stars}
              <span className="text-gray-500">★</span>
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#FF5B00] h-full rounded-full transition-all"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="w-8 text-sm text-gray-500 text-right">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingDistribution;
