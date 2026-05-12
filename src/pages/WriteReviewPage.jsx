import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ReviewHeader from '../features/write-review/ReviewHeader';
import ExperienceRating from '../features/write-review/ExperienceRating';
import DetailedRatings from '../features/write-review/DetailedRatings';
import ReviewForm from '../features/write-review/ReviewForm';
import PhotoUpload from '../features/write-review/PhotoUpload';
import tourService from '../services/tourService.js';
import reviewService from '../services/reviewService.js';
import authService from '../services/authService.js';

const normalizeTourForReview = (data) => {
  const source = data?.tour ?? data ?? {};
  const destination = source.id_diem_den || source.destinationId || null;
  const images = [source.anh_dai_dien, ...(source.danh_sach_anh || [])].filter(Boolean);

  return {
    id: source._id || source.id,
    title: source.ten_tour || source.title || 'Untitled tour',
    image: images[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
    location: destination
      ? (destination.thanh_pho || destination.quoc_gia || destination.name || '')
      : '',
    duration: source.so_ngay || source.duration || 0,
    rating: source.diem_trung_binh ?? source.averageRating ?? source.rating ?? 0,
    reviewCount: source.so_luong_danh_gia ?? source.totalReviews ?? source.reviewCount ?? 0,
    price: source.gia_nguoi_lon ?? source.basePrice ?? source.price ?? 0,
    images,
  };
};

export default function WriteReviewPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('reviewId');
  const isEditMode = !!reviewId;

  const [tour, setTour] = useState(null);
  const [actualTourId, setActualTourId] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);

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
        const normalizedTour = normalizeTourForReview(data);
        
        // Extract the actual tour ID from the raw data (handle both wrapped and unwrapped responses)
        const tourObject = data?.tour ?? data ?? {};
        const tourIdValue = tourObject._id || tourObject.id || data._id || data.id;
        
        console.log('Tour data received:', { tourId, tourIdValue, data });

        if (mounted) {
          setTour(normalizedTour);
          setActualTourId(tourIdValue);
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

  useEffect(() => {
    let mounted = true;

    const fetchReviewForEdit = async () => {
      if (!reviewId) return;

      try {
        setLoadingReview(true);
        const data = await reviewService.getReviewById(reviewId);
        const review = data.review || data;

        if (!mounted || !review) return;

        setRating(review.diem || 0);
        setTitle(review.tieu_de || '');
        setContent(review.noi_dung || '');
        setPhotos((review.danh_sach_media || []).map((src, index) => ({
          id: `${index}-${src}`,
          src,
          fileName: `review-image-${index + 1}`,
        })));
        setDetailedRatings({
          serviceQuality: review.chi_tiet_diem?.chat_luong || 0,
          valueForMoney: review.chi_tiet_diem?.gia_tri || 0,
          guideKnowledge: review.chi_tiet_diem?.huong_dan_vien || 0,
          transportQuality: review.chi_tiet_diem?.phuong_tien || 0,
        });
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'Không thể tải review để chỉnh sửa');
        }
      } finally {
        if (mounted) {
          setLoadingReview(false);
        }
      }
    };

    fetchReviewForEdit();
    return () => {
      mounted = false;
    };
  }, [reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation aligned with DanhGia schema
    if (!rating || rating < 1 || rating > 5) {
      setError('Vui lòng chọn mức đánh giá (1-5)');
      return;
    }

    if (!content || content.trim().length < 10) {
      setError('Nội dung phải có ít nhất 10 ký tự');
      return;
    }

    if (!actualTourId) {
      setError('Không thể xác định tour ID. Vui lòng tải lại trang');
      return;
    }

    if (!authService.isAuthenticated()) {
      setError('Vui lòng đăng nhập để gửi đánh giá');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        tourId: actualTourId,
        rating,
        title,
        content,
        photos: photos.map((photo) => photo.src),
        detailedRatings: {
          chat_luong: detailedRatings.serviceQuality || 0,
          gia_tri: detailedRatings.valueForMoney || 0,
          huong_dan_vien: detailedRatings.guideKnowledge || 0,
          phuong_tien: detailedRatings.transportQuality || 0,
        },
      };

      console.log('Submitting review payload:', payload);

      if (isEditMode) {
        await reviewService.updateReview(reviewId, payload);
      } else {
        await reviewService.createReview(payload);
      }

      navigate(`/tour/${tourId}`);
    } catch (submitError) {
      console.error('Review submission error:', submitError);

      // Prefer structured field errors from server when available
      if (submitError && submitError.errors) {
        const errs = submitError.errors;
        // Pick the most relevant field message
        const fieldPriority = ['noi_dung', 'diem', 'tourId', 'id_dat_tour', 'tieu_de'];
        let foundMsg = '';
        for (const f of fieldPriority) {
          if (errs[f]) {
            foundMsg = errs[f];
            break;
          }
        }
        if (!foundMsg) {
          // fallback to concatenating all messages
          foundMsg = Object.values(errs).join('. ');
        }
        setError(foundMsg || 'Không thể gửi đánh giá');
      } else {
        // Map backend messages to friendly DanhGia schema messages
        let message = submitError?.message || 'Không thể gửi đánh giá';
        const m = message || '';

        if (m.includes('Thiếu thông tin')) {
          message = 'Vui lòng điền đầy đủ thông tin bắt buộc';
        } else if (m.includes('Rating') || m.includes('Điểm')) {
          message = 'Điểm phải từ 1 đến 5';
        } else if (m.includes('Bạn đã đánh giá')) {
          message = 'Bạn đã đánh giá tour này rồi';
        } else if (m.includes('Tour ID không hợp lệ') || m.includes('Tour không hợp lệ')) {
          message = 'Tour không hợp lệ';
        } else if (m.toLowerCase().includes('noi_dung') || m.includes('Nội dung') || m.includes('ít nhất')) {
          message = 'Nội dung phải có ít nhất 10 ký tự';
        }

        setError(message);
      }
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

  if (loadingReview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải review để chỉnh sửa...</p>
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
            {isEditMode && (
              <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-300">
                Bạn đang chỉnh sửa review của mình.
              </div>
            )}
            <ReviewHeader tour={tour} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <ExperienceRating rating={rating} setRating={setRating} />
            <DetailedRatings ratings={detailedRatings} setRatings={setDetailedRatings} />
            <ReviewForm title={title} setTitle={setTitle} content={content} setContent={setContent} />
            <PhotoUpload photos={photos} setPhotos={setPhotos} />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Saving...' : (isEditMode ? 'Update Review →' : 'Submit Review →')}
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
