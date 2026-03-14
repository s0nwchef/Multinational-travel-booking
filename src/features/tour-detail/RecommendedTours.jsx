import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';

const recommendedToursData = [
  {
    id: 1,
    title: 'Tokyo Skytree Ticket with Temaki Soba & Coliseum',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a4?w=400&h=300&fit=crop',
    rating: 4.7,
    reviews: 234,
    price: 15.50,
    badge: 'BESTSELLER',
    badgeColor: 'bg-red-500',
  },
  {
    id: 2,
    title: 'Eiffel Tower Direct Access with Summit',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 512,
    price: 45.00,
    badge: null,
    badgeColor: null,
  },
  {
    id: 3,
    title: 'Universal Studios Singapore One-Day Ticket',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1516484590998-ab12eba54f17?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 180,
    price: 62.00,
    badge: 'INSTANT CONFIRMATION',
    badgeColor: 'bg-emerald-500',
  },
  {
    id: 4,
    title: 'Taj Mahal Skip-the-Line Ticket with Guide',
    location: 'Agra, India',
    image: 'https://images.unsplash.com/photo-1570189214388-ca5a6da57e2b?w=400&h=300&fit=crop',
    rating: 4.8,
    reviews: 96,
    price: 15.00,
    badge: null,
    badgeColor: null,
  },
  {
    id: 5,
    title: 'Big Ben & Westminster Abbey Tour',
    location: 'London, England',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=400&h=300&fit=crop',
    rating: 4.6,
    reviews: 324,
    price: 28.00,
    badge: null,
    badgeColor: null,
  },
];

const RecommendedTours = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [savedTours, setSavedTours] = useState(new Set());

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleSave = (tourId) => {
    const newSaved = new Set(savedTours);
    if (newSaved.has(tourId)) {
      newSaved.delete(tourId);
    } else {
      newSaved.add(tourId);
    }
    setSavedTours(newSaved);
  };

  return (
    <section className="px-4 py-12 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">You might also like</h2>
          <a href="#" className="text-primary font-semibold hover:underline flex items-center gap-1">
            See more →
          </a>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          )}

          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
          >
            {recommendedToursData.map((tour) => (
              <div
                key={tour.id}
                className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Badge */}
                  {tour.badge && (
                    <div
                      className={`absolute top-3 left-3 ${tour.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}
                    >
                      {tour.badge}
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(tour.id);
                    }}
                    className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Save tour"
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        savedTours.has(tour.id)
                          ? 'fill-primary text-primary'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    />
                  </button>
                </div>

                {/* Content Container */}
                <div className="p-4 space-y-3">
                  {/* Location */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    📍 {tour.location}
                  </p>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                    {tour.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {tour.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({tour.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="font-bold text-xl text-gray-900 dark:text-white">
                    US$ {tour.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendedTours;
