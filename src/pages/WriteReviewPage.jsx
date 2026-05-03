import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewHeader from '../features/write-review/ReviewHeader';
import ExperienceRating from '../features/write-review/ExperienceRating';
import DetailedRatings from '../features/write-review/DetailedRatings';
import ReviewForm from '../features/write-review/ReviewForm';
import PhotoUpload from '../features/write-review/PhotoUpload';
import tourService from '../services/tourService.js';
import reviewService from '../services/reviewService.js';
import authService from '../services/authService.js';

export default function WriteReviewPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (!tourId) {
      setLoadingTour(false);
      setError('Tour ID không hợp lệ');
    }
  }, [tourId]);

  useEffect(() => {
    let mounted = true;

    const fetchTour = async () => {
      try {
        setLoadingTour(true);
        const data = await tourService.getTourById(tourId);
        const normalizedTour = {
          id: data._id || data.id,
          image: Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
          title: data.title || 'Untitled tour',
          completionDate: data.duration ? `${data.duration} Days` : '',
          location: data.destinationId?.name || '',
          duration: data.duration ? `${data.duration} Days` : '',
        };

        if (mounted) {
          setTour(normalizedTour);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'Không thể tải thông tin tour');
        }
      } finally {
        if (mounted) {
          setLoadingTour(false);
        }
      }
    };

    fetchTour();
    return () => {
      mounted = false;
    };
  }, [tourId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError('Vui lòng chọn mức đánh giá');
      return;
    }

    if (!title || !content) {
      setError('Vui lòng nhập tiêu đề và nội dung đánh giá');
      return;
    }

    if (!authService.isAuthenticated()) {
      setError('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await reviewService.createReview({
        tourId,
        rating,
        title,
        content,
        photos: photos.map((photo) => photo.src),
        isAnonymous,
        detailedRatings,
      });

      navigate(`/tour/${tourId}`);
    } catch (submitError) {
      setError(submitError.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTour) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
          <p className="text-red-500 mb-4 font-semibold">{error || 'Không tìm thấy tour.'}</p>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
          >
            Quay lại danh sách tour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-black dark:via-gray-950 dark:to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <button onClick={() => navigate('/tours')} className="hover:text-gray-900 dark:hover:text-white">
            Tours
          </button>
          <span>/</span>
          <button onClick={() => navigate(`/tour/${tourId}`)} className="hover:text-gray-900 dark:hover:text-white">
            {tour.location || 'Tour'}
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Write Review</span>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-800">
            <ReviewHeader tour={tour} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <ExperienceRating rating={rating} setRating={setRating} />
            <DetailedRatings ratings={detailedRatings} setRatings={setDetailedRatings} />
            <ReviewForm title={title} setTitle={setTitle} content={content} setContent={setContent} />
            <PhotoUpload photos={photos} setPhotos={setPhotos} isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Sending...' : 'Submit Review →'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/tour/${tourId}`)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
