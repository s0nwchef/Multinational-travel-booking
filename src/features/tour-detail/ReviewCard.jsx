import React, { useState } from 'react';
import { Star, Heart, MessageCircle, Share2 } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true);
      setHelpfulCount(helpfulCount + 1);
    } else {
      setIsHelpful(false);
      setHelpfulCount(helpfulCount - 1);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-6">
      {/* Review Header */}
      <div className="flex gap-4 mb-4">
        <img
          src={review.avatar}
          alt={review.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{review.author}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{review.verification}</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
          </div>
          
          {/* Star Rating */}
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < review.rating ? 'fill-[#FF5B00] text-[#FF5B00]' : 'text-gray-300'}
              />
            ))}
          </div>

          {/* Review Title and Text */}
          <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h5>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
            {review.text}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-4">
              {review.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Review ${idx + 1}`}
                  className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          )}

          {/* Review Footer */}
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={handleHelpful}
              className={`flex items-center gap-2 transition ${
                isHelpful ? 'text-[#FF5B00]' : 'hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Heart size={16} className={isHelpful ? 'fill-[#FF5B00]' : ''} />
              <span>{helpfulCount}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition">
              <MessageCircle size={16} />
              <span>Comment</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
