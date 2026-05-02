import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TourHeader from '../features/tour-detail/TourHeader';
import TourGallery from '../features/tour-detail/TourGallery';
import TourInfo from '../features/tour-detail/TourInfo';
import FavoriteChoices from '../features/home/FavoriteChoices';
import ReviewsSection from '../features/tour-detail/ReviewsSection';
import tourService from '../services/tourService.js';

const TourDetailPage = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTour = async () => {
      if (!tourId) {
        if (mounted) setError('Tour ID không hợp lệ');
        if (mounted) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Call API using tourService
        const data = await tourService.getTourById(tourId);

        // Normalize backend fields to UI expected keys
        const normalized = {
          id: data._id || data.id,
          title: data.title || 'Untitled tour',
          description: data.description || '',
          rating: data.averageRating ?? data.rating ?? 0,
          reviewCount: data.totalReviews ?? data.reviewCount ?? 0,
          locations: data.destinationId ? [data.destinationId.name].filter(Boolean) : (data.locations || []),
          duration: data.duration || data.days || 0,
          season: data.season || '',
          price: data.basePrice ?? data.price ?? 0,
          bestTime: data.bestTime || '',
          images: Array.isArray(data.images) && data.images.length > 0 ? data.images : (data.imageUrl ? [data.imageUrl] : []),
          highlights: data.included || data.highlights || [],
          itinerary: (data.itinerary || []).map(it => ({ day: it.day, title: it.activity || it.title, description: it.description || '' })),
        };

        if (mounted) setTour(normalized);
      } catch (err) {
        console.error('Error fetching tour:', err);
        let errorMessage = 'Lỗi khi tải tour. Vui lòng thử lại.';
        
        if (err.message) {
          if (err.message.includes('404')) {
            errorMessage = 'Tour không được tìm thấy.';
          } else if (err.message.includes('500')) {
            errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          } else {
            errorMessage = err.message;
          }
        }
        
        if (mounted) setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTour();
    return () => { mounted = false; };
  }, [tourId]);

  if (loading) return <div className="py-12 text-center">Đang tải thông tin tour...</div>;
  if (error) return <div className="py-12 text-center text-red-500">Lỗi: {error}</div>;
  if (!tour) return <div className="py-12 text-center">Không tìm thấy tour.</div>;

  return (
    <div className="w-full space-y-12 pb-12">
      {/* Header Section */}
      <section className="bg-white dark:bg-black">
        <TourHeader tour={tour} />
      </section>

      {/* Gallery Section */}
      <section className="bg-white dark:bg-black py-8">
        <TourGallery images={tour.images} />
      </section>

      {/* Info Section */}
      <section className="bg-white dark:bg-black">
        <TourInfo tour={tour} />
      </section>

      {/* You might also like Section */}
      <FavoriteChoices />

      {/* Reviews Section */}
      <ReviewsSection tour={tour} />
    </div>
  );
};

export default TourDetailPage;
