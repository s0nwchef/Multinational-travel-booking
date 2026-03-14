import React from 'react';

export default function ReviewHeader({ tour }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rate & review your trip</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Share your experience to help fellow travelers.</p>
      
      <div className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-24 h-24 rounded object-cover"
        />
        <div className="flex-1 flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tour.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed on {tour.completionDate}
            </p>
          </div>
          <button className="text-orange-500 text-sm font-semibold hover:text-orange-600">
            View details
          </button>
        </div>
      </div>
    </div>
  );
}
