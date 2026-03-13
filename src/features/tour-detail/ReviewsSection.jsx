import React, { useState } from 'react';
import RatingDistribution from './RatingDistribution';
import TravelerPhotos from './TravelerPhotos';
import ReviewCard from './ReviewCard';
import { MessageSquare } from 'lucide-react';

const ReviewsSection = ({ tour }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('highest');
  const [showMoreReviews, setShowMoreReviews] = useState(false);

  // Mock review data
  const mockReviews = [
    {
      id: 1,
      author: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verification: 'Verified Traveler • 5-Day Tour',
      date: '5 days ago',
      rating: 5,
      title: 'Incredible experience of a lifetime!',
      text: 'The 4-day trek to Machu Picchu was absolutely worth every step. Our guide, Carlin, was knowledgeable about the trek history and landscape. The food prepared by the camp team was better than expected! The view from Machu Picchu was even more breathtaking than all the photos we\'d seen. Highly recommended this trip to anyone who enjoys adventure!',
      images: [
        'https://images.unsplash.com/photo-1587595431973-160763ca02f8?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop',
      ],
      helpfulCount: 184,
    },
    {
      id: 2,
      author: 'Marcus Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verification: 'Verified Traveler • 10-Day Tour',
      date: '1 week ago',
      rating: 5,
      title: 'Great trek, but prepare for rain',
      text: 'The scenery is breathtaking. Be prepared that the second day is quite steep and the altitude can get to you. Make sure to acclimatize for at least 2-3 days. Our guide was super prepared for rain. We had some rainy weather, but he was equipped with rain ponchos for everyone. The team work was excellent and they could carry my luggage though.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
      ],
      helpfulCount: 142,
    },
    {
      id: 3,
      author: 'Elena Dragan',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verification: 'Verified Traveler • 8-Day Tour',
      date: '2 weeks ago',
      rating: 4,
      title: 'Solo traveler friendly',
      text: 'I was worried about doing this alone, but the group dynamics were fantastic. I made friends for life. The porters are incredible - they really ensure your success and wellness. Beautiful views, good food, and great company. This was truly unforgettable!',
      images: [],
      helpfulCount: 98,
    },
    {
      id: 4,
      author: 'Response from Machu Picchu Trek team',
      avatar: 'https://i.pravatar.cc/150?img=99',
      verification: 'Tour Operator Response',
      date: '2 weeks ago',
      rating: 5,
      title: 'Thank you for this wonderful review!',
      text: 'Thanks you Elena! We are so happy you felt so supported on your trek. Our Quechua porters are indeed the heart of our operations. Your positive feedback motivates us to keep delivering excellent service.',
      images: [],
      helpfulCount: 0,
    },
  ];

  const mockPhotos = [
    'https://images.unsplash.com/photo-1587595431973-160763ca02f8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1533105079780-92b9be3c3bed?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=300&fit=crop',
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  const filteredReviews = mockReviews;
  const displayedReviews = showMoreReviews ? filteredReviews : filteredReviews.slice(0, 3);

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
          <button className="flex items-center gap-2 bg-[#FF5B00] hover:bg-[#D64D00] text-white px-6 py-3 rounded-full font-semibold transition whitespace-nowrap">
            <MessageSquare size={20} />
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        <RatingDistribution
          averageRating={tour.rating}
          totalReviews={tour.reviewCount}
          distribution={ratingDistribution}
        />

        {/* Traveler Photos */}
        <TravelerPhotos photos={mockPhotos} />

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

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

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
