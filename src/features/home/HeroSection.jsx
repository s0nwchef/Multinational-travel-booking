import React, { useState, useEffect, useCallback } from 'react';
import { Map, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDestinations } from '../../services/destinationService.js';

export default function HeroSection() {
  const [destinations, setDestinations] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fallbackImages = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
  ];

  // Fetch popular destinations with cover images
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const allDestinations = await getDestinations();
        // Filter popular destinations with cover image
        const popularDestinations = allDestinations.filter(
          dest => dest.pho_bien === true && dest.anh_bia && dest.anh_bia.trim() !== ''
        );
        setDestinations(popularDestinations);
      } catch (error) {
        console.error('Failed to load destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  // Get current image
  const getCurrentImage = useCallback(() => {
    if (destinations.length > 0 && destinations[currentImageIndex]?.anh_bia) {
      return destinations[currentImageIndex].anh_bia;
    }
    return fallbackImages[currentImageIndex % fallbackImages.length];
  }, [destinations, currentImageIndex]);

  // Auto-transition between images with fade effect every 3 seconds
  useEffect(() => {
    if (destinations.length <= 1 && fallbackImages.length <= 1) return;

    const totalImages = destinations.length > 0 ? destinations.length : fallbackImages.length;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // After fade out completes, change the image
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
        setIsTransitioning(false);
      }, 1000); // Fade duration
    }, 3000); // Auto-change every 3 seconds

    return () => clearInterval(interval);
  }, [destinations.length]);

  const handleToursClick = () => {
    navigate('/tours');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/tours');
    }
  };

  const currentImage = getCurrentImage();

  return (
    <div className="relative w-full h-[550px] rounded-3xl overflow-hidden group">
      {/* Background Image with Fade Transition */}
      <div className="absolute inset-0">
        <img
          key={currentImageIndex}
          alt={destinations[currentImageIndex]?.thanh_pho || destinations[currentImageIndex]?.quoc_gia || "Beautiful destination"}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 8s ease-out' }}
          src={currentImage}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.src = fallbackImages[0];
          }}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
      
      {/* Image Indicator Dots */}
      {((destinations.length > 1) || fallbackImages.length > 1) && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {(destinations.length > 0 ? destinations : fallbackImages).slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex % (destinations.length || fallbackImages.length)
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Tours Button - Top Right */}
      <div className="absolute top-6 right-6 flex gap-2 overflow-x-auto max-w-full pb-2 hide-scrollbar z-20">
        <button
          onClick={handleToursClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-colors bg-white/90 backdrop-blur-md text-gray-900 hover:bg-white"
        >
          <Map className="w-4 h-4" /> Tours
        </button>
      </div>
      
      {/* Hero Content - Center */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center z-10">
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Yours To Explore
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full flex items-center gap-2 shadow-2xl">
          <div className="flex-1 flex items-center px-4">
            <Search className="text-white/70 mr-3 w-5 h-5" />
            <input
              type="text"
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-white/70 text-lg"
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
