import React, { useState } from 'react';
import { Star, MessageCircle, Share2, PencilLine, MoreVertical } from 'lucide-react';

const ReviewCard = ({ review, canEdit = false, canReply = false, onEdit, onDelete, onReply }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !onReply) return;
    setReplyLoading(true);

    try {
      await onReply(review.id, replyText.trim());
      setReplyText('');
      setShowReplyForm(false);
    } finally {
      setReplyLoading(false);
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
          <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (canReply) {
                    setShowReplyForm((prev) => !prev);
                  }
                }}
                className={`flex items-center gap-2 transition ${
                  canReply
                    ? 'hover:text-gray-900 dark:hover:text-white'
                    : 'cursor-not-allowed opacity-70'
                }`}
              >
                <MessageCircle size={16} />
                <span>{canReply ? 'Reply to Review' : 'Login to reply'}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>

            {showReplyForm && canReply && (
              <div className="mt-3 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply to this review"
                  className="w-full min-h-[100px] resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF5B00] focus:ring-2 focus:ring-orange-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-[#FF5B00] dark:focus:ring-orange-500/20"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!replyText.trim() || replyLoading}
                    onClick={handleReplySubmit}
                    className="rounded-full bg-[#FF5B00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#D64D00] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {replyLoading ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {review.replies?.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              {review.replies.map((reply, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <img
                      src={reply.avatar || 'https://i.pravatar.cc/150?img=47'}
                      alt={reply.author || 'Member'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{reply.author || 'Member'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{reply.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
