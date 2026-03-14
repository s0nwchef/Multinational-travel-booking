import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Heart, Star, ArrowRight, Loader2, Globe, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STATIC_CHOICES = [
  {
    id: 'static-1',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800&auto=format&fit=crop',
    location: 'Tokyo, Japan',
    title: 'Tokyo Skytree Ticket with Tembo Deck & Galleria',
    rating: '4.7',
    reviews: '25k+',
    price: 'US$ 18.50',
    badge: 'BESTSELLER',
    badgeColor: 'bg-primary'
  },
  {
    id: 'static-2',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop',
    location: 'Paris, France',
    title: 'Eiffel Tower Direct Access Tour with Summit',
    rating: '4.5',
    reviews: '12k+',
    price: 'US$ 45.00'
  },
  {
    id: 'static-3',
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?q=80&w=800&auto=format&fit=crop',
    location: 'Singapore',
    title: 'Universal Studios Singapore One-Day Ticket',
    rating: '4.8',
    reviews: '30k+',
    price: 'US$ 62.00',
    badge: 'INSTANT CONFIRMATION',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'static-4',
    image: 'https://images.unsplash.com/photo-1564507592208-027004dc37bf?q=80&w=800&auto=format&fit=crop',
    location: 'Agra, India',
    title: 'Taj Mahal Skip-the-Line Ticket with Guide',
    rating: '4.6',
    reviews: '8k+',
    price: 'US$ 15.00'
  }
];
const GLOBAL_DESTINATIONS = [
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { name: 'Rome, Italy', lat: 41.9028, lon: 12.4964 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lon: -43.1729 },
  { name: 'Cairo, Egypt', lat: 30.0444, lon: 31.2357 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018 },
  { name: 'Cape Town, South Africa', lat: -33.9249, lon: 18.4241 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Barcelona, Spain', lat: 41.3851, lon: 2.1734 },
  { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lon: 28.9784 }
];

const FavoriteChoices = () => {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [currentCity, setCurrentCity] = useState('Global');

  const API_KEY = "5ae2e3f221c38a28845f05b6f041fe371aa04c2e20cf1df520955b17";

  const fetchOpenTripMapData = useCallback(async () => {
    if (!API_KEY) {
      console.warn('OpenTripMap API Key is missing. Using fallback data.');
      setApiKeyMissing(true);
      setChoices(STATIC_CHOICES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setApiKeyMissing(false);
      const city = GLOBAL_DESTINATIONS[Math.floor(Math.random() * GLOBAL_DESTINATIONS.length)];
      setCurrentCity(city.name);

      const radiusUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${city.lon}&lat=${city.lat}&kinds=cultural,historic,natural,tourist_facilities&format=json&limit=15&apikey=${API_KEY}`;
      const listResponse = await fetch(radiusUrl);

      if (!listResponse.ok) {
        let errorMsg = `Failed to fetch places list: ${listResponse.status}`;
        try {
          const errorData = await listResponse.json();
          if (errorData.error) errorMsg += ` - ${errorData.error}`;
        } catch (e) {
          // Not JSON
        }
        throw new Error(errorMsg);
      }

      const places = await listResponse.json();

      if (!Array.isArray(places) || places.length === 0) {
        console.warn(`No places found for ${city.name}, using fallback.`);
        setChoices(STATIC_CHOICES);
        setLoading(false);
        return;
      }

      const selectedPlaces = [...places].sort(() => 0.5 - Math.random()).slice(0, 4);

      const detailedChoices = await Promise.all(
          selectedPlaces.map(async (place, index) => {
            try {
              const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${API_KEY}`;
              const detailResponse = await fetch(detailUrl);
              const details = await detailResponse.json();

              // Fallback images if API doesn't provide one
              const fallbackImg = `https://images.unsplash.com/photo-${[
                '1507525428034-b723cf961d3e',
                '1469474968028-56623f02e42e',
                '1476514525535-07fb3b4ae5f1',
                '1500835595367-9917d4c50dd1'
              ][index % 4]}?q=80&w=800&auto=format&fit=crop`;

              return {
                id: place.xid,
                image: details.preview?.source || details.image || fallbackImg,
                location: details.address?.city || details.address?.state || city.name,
                title: details.name || 'Historic Landmark',
                description: details.wikipedia_extracts?.text || `Discover the amazing history of ${details.name || 'this location'}.`,
                rating: (4.2 + Math.random() * 0.7).toFixed(1),
                reviews: (Math.floor(Math.random() * 10) + 1) + 'k+',
                price: `US$ ${(Math.floor(Math.random() * 50) + 10).toFixed(2)}`,
                badge: index === 0 ? 'RECOMMENDED' : index === 2 ? 'MUST SEE' : null,
                badgeColor: index === 0 ? 'bg-indigo-600' : 'bg-rose-600'
              };
            } catch (err) {
              return STATIC_CHOICES[index % STATIC_CHOICES.length];
            }
          })
      );

      setChoices(detailedChoices);
    } catch (err) {
      console.error('OpenTripMap integration failed:', err.message);
      setChoices(STATIC_CHOICES);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    fetchOpenTripMapData();
  }, [fetchOpenTripMapData, refreshKey]);

  const handleRefresh = (e) => {
    e.preventDefault();
    if (!loading) {
      setRefreshKey(prev => prev + 1);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }
  };

  const handleExploreAll = (e) => {
    e.preventDefault();
    const target = document.getElementById('why-choose-us');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <section className="bg-[#F3F4F6] dark:bg-surface-dark rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
          >
            <div className="bg-primary/10 p-2 rounded-xl">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Global Travel Suggestions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discovering hidden gems in <span className="text-primary font-bold">{currentCity}</span> and beyond</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {apiKeyMissing && (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-100 dark:border-amber-800/50">
                  <Info className="w-4 h-4" />
                  <span>API Key required for live data</span>
                </div>
            )}
            <div className="flex items-center gap-2">
              <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Refresh destinations"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <a
                  href="#why-choose-us"
                  onClick={handleExploreAll}
                  className="text-primary text-sm font-bold hover:text-primary-dark flex items-center gap-1 group"
              >
                Explore all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[420px]">
          <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="skeleton-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full col-span-full"
                >
                  {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl h-[420px] animate-pulse flex flex-col shadow-sm">
                        <div className="h-52 bg-gray-200 dark:bg-gray-700 rounded-t-3xl"></div>
                        <div className="p-6 space-y-4">
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                          <div className="pt-6 flex justify-between items-center">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                  ))}
                </motion.div>
            ) : (
                choices.map((choice, index) => (
                    <motion.div
                        key={choice.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={cardVariants}
                        whileHover={{ y: -10 }}
                        className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group border border-transparent hover:border-primary/10"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                            src={choice.image}
                            alt={choice.location}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop';
                            }}
                        />
                        {choice.badge && (
                            <div className={`absolute top-4 left-4 ${choice.badgeColor} text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest z-10 shadow-lg backdrop-blur-sm bg-opacity-90`}>
                              {choice.badge}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 p-2.5 rounded-xl text-gray-400 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-xl">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate">{choice.location}</span>
                        </div>

                        <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-3 line-clamp-2 flex-grow group-hover:text-primary transition-colors duration-300 leading-snug">
                          {choice.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-black text-amber-700 dark:text-amber-400">{choice.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">({choice.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50 dark:border-gray-700/50">
                          <div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-black tracking-tighter mb-0.5">Starting from</span>
                            <div className="font-black text-xl text-gray-900 dark:text-white">{choice.price}</div>
                          </div>
                          <button className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </section>
  );
};

export default FavoriteChoices;
