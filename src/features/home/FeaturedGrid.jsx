import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tourService from '../../services/tourService.js';

export default function FeaturedGrid() {
  const [featuredDeals, setFeaturedDeals] = useState(null);
  const [recommendedStay, setRecommendedStay] = useState(null);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setLoading(true);
        const tours = await tourService.getAllTours();
        
        if (tours && tours.length > 0) {
          // Get tours with images for featured deals (first large card)
          const toursWithImages = tours.filter(tour => 
            tour.anh_dai_dien || (tour.danh_sach_anh && tour.danh_sach_anh.length > 0)
          );
          
          // Select one tour for "Top Deals" (large card)
          if (toursWithImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(3, toursWithImages.length));
            const selectedTour = toursWithImages[randomIndex];
            setFeaturedDeals({
              id: selectedTour._id,
              image: selectedTour.anh_dai_dien || selectedTour.danh_sach_anh?.[0],
              title: selectedTour.ten_tour,
              location: selectedTour.id_diem_den?.quoc_gia || 'Vietnam',
              discount: Math.floor(Math.random() * 30) + 10 // Random discount 10-40%
            });
          }
          
          // Select one tour for "Luxury Stays" (medium card 1)
          const stayTours = toursWithImages.filter(tour => 
            tour.ten_tour?.toLowerCase().includes('resort') || 
            tour.ten_tour?.toLowerCase().includes('hotel') ||
            tour.ten_tour?.toLowerCase().includes('spa') ||
            tour.ten_tour?.toLowerCase().includes('villas') ||
            tour.so_dem >= 2
          );
          
          if (stayTours.length > 0) {
            const randomStay = stayTours[Math.floor(Math.random() * stayTours.length)];
            setRecommendedStay({
              id: randomStay._id,
              image: randomStay.anh_dai_dien || randomStay.danh_sach_anh?.[0],
              title: randomStay.ten_tour,
              price: randomStay.gia_nguoi_lon
            });
          } else if (toursWithImages.length > 1) {
            // Fallback to any tour
            const fallbackTour = toursWithImages[Math.floor(Math.random() * toursWithImages.length)];
            setRecommendedStay({
              id: fallbackTour._id,
              image: fallbackTour.anh_dai_dien || fallbackTour.danh_sach_anh?.[0],
              title: fallbackTour.ten_tour,
              price: fallbackTour.gia_nguoi_lon
            });
          }
          
          // Get unique destinations for "Popular Now" (medium card 2)
          const destinations = [...new Set(tours.map(tour => 
            tour.id_diem_den?.quoc_gia || tour.id_diem_den?.thanh_pho
          ).filter(Boolean))];
          
          setPopularDestinations(destinations.slice(0, 7));
        }
      } catch (error) {
        console.error('Failed to fetch featured data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  const handleViewOffers = () => {
    if (featuredDeals?.id) {
      navigate(`/tour/${featuredDeals.id}`);
    } else {
      navigate('/tours');
    }
  };

  const handleViewStay = () => {
    if (recommendedStay?.id) {
      navigate(`/tour/${recommendedStay.id}`);
    } else {
      navigate('/tours');
    }
  };

  const handleViewPopular = () => {
    navigate('/tours');
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop';

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[320px]">
        <div className="lg:col-span-6 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse h-80 lg:h-full"></div>
        <div className="lg:col-span-3 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse h-80 lg:h-full"></div>
        <div className="lg:col-span-3 rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse h-80 lg:h-full"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[320px]">
      {/* Large Card - Featured Deals */}
      <div className="lg:col-span-6 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full">
        <img
          alt={featuredDeals?.title || "Featured travel destination"}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={featuredDeals?.image || fallbackImage}
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            {featuredDeals?.discount ? `SAVE UP TO ${featuredDeals.discount}%` : 'LIMITED OFFER'}
          </span>
          <h3 className="text-3xl font-bold text-white mb-2">
            {featuredDeals?.title || 'Top Travel Deals'}
          </h3>
          <p className="text-white/80 mb-6 max-w-md">
            {featuredDeals?.location ? `Explore amazing tours in ${featuredDeals.location}` : 'Discover amazing destinations at unbeatable prices'}
          </p>
          <button
            onClick={handleViewOffers}
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            View Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medium Card 1 - Recommended Stay */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="h-1/2 relative overflow-hidden">
          <img
            alt={recommendedStay?.title || "Luxury accommodation"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={recommendedStay?.image || fallbackImage}
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
          <button 
            onClick={handleViewStay}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm hover:bg-white transition-colors"
          >
            <Heart className="text-primary w-4 h-4" />
          </button>
        </div>
        <div className="h-1/2 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
              Recommended for You
            </h4>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {recommendedStay?.title || 'Luxury Stays & Spas'}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {recommendedStay?.price 
                ? `$${Math.round(recommendedStay.price / 24000).toLocaleString('en-US')}`
                : 'View Details'}
            </span>
            <button
              onClick={handleViewStay}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Medium Card 2 - Popular Destinations */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full">
        <img
          alt="Popular destinations"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h3 className="text-2xl font-bold text-white mb-1">Popular Now</h3>
          <p className="text-white/80 text-sm mb-4">Trending destinations this week</p>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.length > 0 ? (
              <>
                {popularDestinations.slice(0, 2).map((dest, index) => (
                  <span
                    key={index}
                    className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10"
                  >
                    {dest}
                  </span>
                ))}
                {popularDestinations.length > 2 && (
                  <span
                    onClick={handleViewPopular}
                    className="bg-primary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10 cursor-pointer hover:bg-primary transition-colors"
                  >
                    +{popularDestinations.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">
                  Paris
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">
                  Tokyo
                </span>
                <span
                  onClick={handleViewPopular}
                  className="bg-primary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10 cursor-pointer hover:bg-primary transition-colors"
                >
                  +5 more
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
