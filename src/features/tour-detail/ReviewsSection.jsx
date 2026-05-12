import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingDistribution from './RatingDistribution';
import TravelerPhotos from './TravelerPhotos';
import ReviewCard from './ReviewCard';
import { MessageSquare, Trash2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import authService from '../../services/authService';

const formatReviewDate = (value) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ReviewsSection = ({ tour }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('highest');
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [reviewsState, setReviewsState] = useState({
    reviews: [],
    distribution: [],
    photos: [],
    loading: true,
    error: null,
  });

  const handleWriteReview = () => {
    if (!tour?.id) return;
    navigate(`/review/${tour.id}`);
  };

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?._id || currentUser?.id || currentUser?.userId || null;
  const ownReview = reviewsState.reviews.find((review) => String(review.ownerId) === String(currentUserId));

  const handleEditOwnReview = () => {
    if (!tour?.id || !ownReview?.id) return;
    navigate(`/review/${tour.id}?reviewId=${ownReview.id}`);
  };

  const handleDeleteOwnReview = async () => {
    if (!ownReview?.id) return;
    
    if (!confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
      return;
    }

    try {
      await reviewService.deleteReview(ownReview.id);
      setReviewsState((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r.id !== ownReview.id),
      }));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      if (!tour?.id) {
        if (mounted) {
          setReviewsState((prev) => ({ ...prev, loading: false, error: 'Thiếu tour ID' }));
        }
        return;
      }

      try {
        if (mounted) {
          setReviewsState((prev) => ({ ...prev, loading: true, error: null }));
        }

        const sortMap = {
          highest: 'highest',
          lowest: 'lowest',
          recent: 'newest',
          helpful: 'newest',
        };

        const data = await reviewService.getTourReviews(tour.id, {
          sort: sortMap[sortBy] || 'newest',
          limit: 100,
        });

        const reviews = (data.reviews || []).map((review) => ({
          id: review._id,
          ownerId: review.id_nguoi_dung?._id || review.id_nguoi_dung?.id || review.id_nguoi_dung,
          author: review.da_an_danh ? 'Anonymous traveler' : (review.id_nguoi_dung?.ho_ten || 'Anonymous traveler'),
          avatar: review.id_nguoi_dung?.anh_dai_dien || 'https://i.pravatar.cc/150?img=12',
          verification: `Verified Traveler • ${tour.duration ? `${tour.duration} Days` : 'Tour'}`,
          date: formatReviewDate(review.ngay_tao || review.createdAt),
          rating: review.diem || 0,
          title: review.tieu_de || (review.diem >= 5 ? 'Excellent experience' : 'Great trip'),
          text: review.noi_dung || '',
          images: review.danh_sach_media || review.photos || [],
          helpfulCount: review.so_luong_thich || 0,
        }));

        const photos = reviews.flatMap((review) => review.images || []);
        const distribution = [5, 4, 3, 2, 1].map((stars) => {
          const count = data.distribution?.[stars] || 0;
          const total = data.pagination?.total || reviews.length || 1;
          return {
            stars,
            percentage: Math.round((count / total) * 100),
          };
        });

        if (mounted) {
          setReviewsState({
            reviews,
            distribution,
            photos,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setReviewsState({
            reviews: [],
            distribution: [],
            photos: [],
            loading: false,
            error: error.message || 'Không thể tải đánh giá',
          });
        }
      }
    };

    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [tour?.id, sortBy, showMoreReviews]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'with photos') {
      return reviewsState.reviews.filter((review) => (review.images || []).length > 0);
    }

    if (activeFilter === '5 stars only') {
      return reviewsState.reviews.filter((review) => review.rating === 5);
    }

    return reviewsState.reviews;
  }, [activeFilter, reviewsState.reviews]);
  const displayedReviews = showMoreReviews ? filteredReviews : filteredReviews.slice(0, 3);

  if (reviewsState.loading) {
    return (
      <section className="px-4 py-12 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto text-center text-gray-500 dark:text-gray-400">
          Đang tải đánh giá tour...
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Traveler Reviews & Community Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              See what our global community has to say about their adventures on the {tour.title}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ownReview && (
              <>
                <button
                  type="button"
                  onClick={handleEditOwnReview}
                  className="flex items-center gap-2 rounded-full border border-[#FF5B00] px-6 py-3 font-semibold text-[#FF5B00] transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                >
                  <MessageSquare size={20} />
                  Edit My Review
                </button>
                <button
                  type="button"
                  onClick={handleDeleteOwnReview}
                  className="flex items-center gap-2 rounded-full border border-red-500 px-6 py-3 font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={20} />
                  Delete Review
                </button>
              </>
            )}
            {!ownReview && (
              <button 
                onClick={handleWriteReview}
                className="flex items-center gap-2 bg-[#FF5B00] hover:bg-[#D64D00] text-white px-6 py-3 rounded-full font-semibold transition whitespace-nowrap">
                <MessageSquare size={20} />
                Write a Review
              </button>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <RatingDistribution
          averageRating={tour.rating || 0}
          totalReviews={tour.reviewCount || 0}
          distribution={reviewsState.distribution.length > 0 ? reviewsState.distribution : [
            { stars: 5, percentage: 0 },
            { stars: 4, percentage: 0 },
            { stars: 3, percentage: 0 },
            { stars: 2, percentage: 0 },
            { stars: 1, percentage: 0 },
          ]}
        />

        {/* Traveler Photos */}
        <TravelerPhotos photos={reviewsState.photos.length > 0 ? reviewsState.photos : []} />

        {/* Filter and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['All Reviews', 'With Photos', 'Verified Travelers', '5 Stars Only'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === filter.toLowerCase()
                    ? 'bg-[#FF5B00] text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-700"
            >
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {reviewsState.error && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300">
            {reviewsState.error}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              canEdit={String(review.ownerId) === String(currentUserId)}
              onEdit={String(review.ownerId) === String(currentUserId) ? handleEditOwnReview : undefined}
              onDelete={String(review.ownerId) === String(currentUserId) ? handleDeleteOwnReview : undefined}
            />
          ))}
        </div>

        {displayedReviews.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
            Chưa có đánh giá cho tour này.
          </div>
        )}

        {/* Show More Button */}
        {!showMoreReviews && filteredReviews.length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowMoreReviews(true)}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
            >
              Show More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
