import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewHeader from '../features/write-review/ReviewHeader';
import ExperienceRating from '../features/write-review/ExperienceRating';
import DetailedRatings from '../features/write-review/DetailedRatings';
import ReviewForm from '../features/write-review/ReviewForm';
import PhotoUpload from '../features/write-review/PhotoUpload';

export default function WriteReviewPage() {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock tour data
  const tour = {
    id: tourId,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jfuK3EtSgYIzy4L9fSnklnps7dXnU0.png',
    title: 'Eiffel Tower Summit Tour: Skip the Line Tickets',
    completionDate: 'Oct 2, 2023',
    location: 'Paris, France',
    duration: '4 hours'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert('Please rate your experience');
      return;
    }

    if (!title || !content) {
      alert('Please fill in the title and review content');
      return;
    }

    // Mock submit - in a real app, this would send to an API
    const reviewData = {
      tourId,
      overallRating: rating,
      detailedRatings,
      title,
      content,
      photos: photos.map(p => ({ fileName: p.fileName })),
      isAnonymous,
      submittedAt: new Date().toISOString()
    };

    console.log('Review submitted:', reviewData);
    alert('Thank you for your review!');
    navigate(`/tour/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <button onClick={() => navigate(`/tour/${tourId}`)} className="hover:text-gray-900 dark:hover:text-white">
            Tours
          </button>
          <span>/</span>
          <button onClick={() => navigate(`/tour/${tourId}`)} className="hover:text-gray-900 dark:hover:text-white">
            Paris
          </button>
          <span>/</span>
          <span>Write Review</span>
        </div>

        <form onSubmit={handleSubmit}>
          <ReviewHeader tour={tour} />
          <ExperienceRating rating={rating} setRating={setRating} />
          <DetailedRatings ratings={detailedRatings} setRatings={setDetailedRatings} />
          <ReviewForm title={title} setTitle={setTitle} content={content} setContent={setContent} />
          <PhotoUpload photos={photos} setPhotos={setPhotos} />

          {/* Form Actions */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Submit Review →
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
  );
}
