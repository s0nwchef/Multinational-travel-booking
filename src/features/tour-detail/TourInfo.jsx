import React from 'react';
import { MapPin, Calendar, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function TourInfo({ tour }) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 py-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tour Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-6">
            {tour.description}
          </p>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Destinations</p>
              <p className="font-bold text-gray-900 dark:text-white">{tour.locations.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-bold text-gray-900 dark:text-white">{tour.duration} Days</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Group Size</p>
              <p className="font-bold text-gray-900 dark:text-white">Max 25</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Season</p>
              <p className="font-bold text-gray-900 dark:text-white">{tour.season}</p>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tour Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tour.highlights?.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary Preview */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sample Itinerary</h2>
          <div className="space-y-4">
            {tour.itinerary?.slice(0, 3).map((item, index) => (
              <div key={index} className="border-l-4 border-primary pl-6 py-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Day {item.day}: {item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
            {tour.itinerary?.length > 3 && (
              <button className="text-primary font-bold hover:underline">
                View Full Itinerary ({tour.itinerary.length} days)
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Sidebar - Booking Card */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 sticky top-24">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Starting from</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">${tour.price}</span>
              <span className="text-gray-600 dark:text-gray-400">per person</span>
            </div>
          </div>

          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Best time to visit</span>
              <span className="font-semibold text-gray-900 dark:text-white">{tour.bestTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Departures</span>
              <span className="font-semibold text-gray-900 dark:text-white">Mon - Fri</span>
            </div>
          </div>

          <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary-dark transition-colors mb-3">
            Book Now
          </button>
          <button className="w-full border-2 border-primary text-primary font-bold py-4 rounded-2xl hover:bg-primary/5 transition-colors">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
}
