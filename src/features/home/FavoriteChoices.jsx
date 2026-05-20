import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Heart, Star, ArrowRight, Globe, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import tourService from '../../services/tourService.js';
import { formatUsd } from '../../utils/currency.js';

const FavoriteChoices = () => {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const fetchToursData = useCallback(async () => {
    try {
      setLoading(true);
      const tours = await tourService.getAllTours();
      const selectedTours = [...tours].sort(() => 0.5 - Math.random()).slice(0, 4);

      const detailedChoices = selectedTours.map((tour, index) => ({
        id: tour._id,
        image:
          tour.danh_sach_anh && tour.danh_sach_anh.length > 0
            ? tour.danh_sach_anh[0]
            : tour.anh_dai_dien ||
              'https://images.unsplash.com/photo-1469474968028-56623-f02e42e?q=80&w=800&auto=format&fit=crop',
        location: tour.id_diem_den?.quoc_gia || tour.id_diem_den?.thanh_pho || 'Vietnam',
        title: tour.ten_tour,
        description: tour.mo_ta,
        rating: tour.diem_trung_binh
          ? tour.diem_trung_binh.toFixed(1)
          : (4.2 + Math.random() * 0.7).toFixed(1),
        reviews: tour.so_luong_danh_gia
          ? `${tour.so_luong_danh_gia}+`
          : `${Math.floor(Math.random() * 10) + 1}k+`,
        price: formatUsd(tour.gia_nguoi_lon),
        badge: index === 0 ? 'RECOMMENDED' : index === 2 ? 'MUST SEE' : null,
        badgeColor: index === 0 ? 'bg-indigo-600' : 'bg-rose-600',
      }));

      setChoices(detailedChoices);
    } catch (err) {
      console.error('Fetching tours failed:', err.message);
      setChoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToursData();
  }, [fetchToursData, refreshKey]);

  const handleRefresh = (e) => {
    e.preventDefault();
    if (!loading) {
      setRefreshKey((prev) => prev + 1);
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
        ease: 'easeOut',
      },
    }),
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } },
  };

  const handleExploreAll = (e) => {
    e.preventDefault();
    navigate('/tours');
  };

  const handleViewChoice = (choiceId) => {
    if (choiceId) {
      navigate(`/tour/${choiceId}`);
      return;
    }

    navigate('/tours');
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    navigate('/wishlist');
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Global Travel Suggestions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discovering hidden gems and popular tours for you.
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              onClick={handleRefresh}
              disabled={loading}
              className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refresh tours"
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
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full col-span-full"
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-3xl h-[420px] animate-pulse flex flex-col shadow-sm"
              >
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
        ) : choices.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-full text-gray-500">
            Oops! No tours available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full col-span-full">
            {choices.map((choice, index) => (
              <motion.div
                key={choice.id}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardVariants}
                whileHover={{ y: -10 }}
                onClick={() => handleViewChoice(choice.id)}
                className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group border border-transparent hover:border-primary/10 cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={choice.image}
                    alt={choice.location}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {choice.badge && (
                    <div
                      className={`absolute top-4 left-4 ${choice.badgeColor} text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest z-10 shadow-lg backdrop-blur-sm bg-opacity-90`}
                    >
                      {choice.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <button
                    onClick={handleWishlistClick}
                    className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 p-2.5 rounded-xl text-gray-400 hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-xl"
                  >
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
                      <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                        {choice.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                      ({choice.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50 dark:border-gray-700/50">
                    <div>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 block uppercase font-black tracking-tighter mb-0.5">
                        Starting from
                      </span>
                      <div className="font-black text-xl text-gray-900 dark:text-white">{choice.price}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewChoice(choice.id);
                      }}
                      className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoriteChoices;
