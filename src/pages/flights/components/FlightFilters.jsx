import React, { useState } from 'react';

export default function FlightFilters() {
  const [priceRange, setPriceRange] = useState(500);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-8">
      
      {/* Stops */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Stops</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Direct</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">From $85</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">1 Stop</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">From $110</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">2+ Stops</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">From $150</span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full"></div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Price</h3>
          <span className="text-sm font-bold text-primary">Up to ${priceRange}</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="1000" 
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="h-px bg-gray-100 w-full"></div>

      {/* Airlines */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Airlines</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Vietnam Airlines</span>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Bamboo Airways</span>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">VietJet Air</span>
            </div>
          </label>
        </div>
      </div>

    </div>
  );
}
