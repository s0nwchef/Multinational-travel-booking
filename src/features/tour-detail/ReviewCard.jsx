import React, { useState } from 'react';
import { Star, Heart, MessageCircle, Share2, PencilLine, MoreVertical } from 'lucide-react';

const ReviewCard = ({ review, canEdit = false, onEdit, onDelete }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [showDropdown, setShowDropdown] = useState(false);

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
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
              {canEdit && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          onEdit?.();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 first:rounded-t-lg"
                      >
                        <PencilLine size={16} />
                        Edit Review
                      </button>
                      <button
                        onClick={() => {
                          onDelete?.();
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 last:rounded-b-lg"
                      >
                        <span>🗑️</span>
                        Delete Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
