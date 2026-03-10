import React from 'react';
import { ArrowRight, Heart, ChevronRight } from 'lucide-react';

export default function FeaturedGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[320px]">
      {/* Large Card */}
      <div className="lg:col-span-6 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full">
        <img alt="Cherry blossom scene" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnKw6ZaDdbakvTBsEA6OxVwPPIqIaxpaXdyt8f2lucxJZFXPZTlSSKiPrrhlx3Jy0JKhD5S0ioMQB4kdgdM1MRF2zCPUlx8lahi-a-aDwDa2ba0wNxZ6gszpNZxORIpsedwhPp37aXdd1AaJSN_trEbCBxcLxIPK_fDJFjy3aT3-7PozWpUX0BefHqet7ghT-fxh_36E4glxS_IhFixKqxbg1IUtPh68pNIznNGpG44womHUT49imy_JInsFEcPQEx2QFWfw1LXP2Q" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">LIMITED OFFER</span>
          <h3 className="text-3xl font-bold text-white mb-2">Top Deals in Japan</h3>
          <p className="text-white/80 mb-6 max-w-md">Save up to 40% on cherry blossom tours and cultural experiences this season.</p>
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
            View Offers <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medium Card 1 */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="h-1/2 relative overflow-hidden">
          <img alt="Luxury hotel pool" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABpVd8LUu6HRLOSsrS6gqo8pWKV_gjq2AJIVnGjhZncItF0E6l97Z1KVZu0KrZhGDvM0PIOmL_NoOgE4tXsO_k5p84Z3L9KLTv70a9QwJzVwaIiY7w8VbavPsR0X1Uaz6FrLRB0pLikuENBhEY9UNs2ChtZIsR-XDl2sh5tU84HHf5A1vRp4GRr-z2jVI6-ZL7CjJGHEadu_9XnG-yV25WRByp1mvdNPbYrtZAiSBiORhv6OwcRSrT5ERhGq5IlFa93k3rOVVQMssc" referrerPolicy="no-referrer" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-sm">
            <Heart className="text-primary w-4 h-4 fill-primary" />
          </div>
        </div>
        <div className="h-1/2 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Recommended for You</h4>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Luxury Stays & Spas</h3>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">From $129/night</span>
            <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Medium Card 2 */}
      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden group cursor-pointer h-80 lg:h-full">
        <img alt="Paris Eiffel Tower" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVVJ4xtbKwIy74kFMWhzYVhPxj10HkoKw6l5ODmoDoDvtBBzAMDrTCOCViKIOt3HEPjwtGoVCDs_7foM6W1dlvz2OoTenySiMsn3Ri1npITC0FwAO4JIoLexbt1KOQ5w8Y5yBRodEYzR9YNpxGPvYIL-V7XkY12AHd0qZVYaOgSnNx-tqEkJ1jVLbk9xShZv6hjI8bfhzFvqYIr1AyIkGXFIwN08rK120QG6yYObiVoq-aS-4ujoHPi-MBQZ3mGvQTmZkcqh2viVS_" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <h3 className="text-2xl font-bold text-white mb-1">Popular Now</h3>
          <p className="text-white/80 text-sm mb-4">Trending destinations this week</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">Paris</span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">London</span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/10">+5 more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
