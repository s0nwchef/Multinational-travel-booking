import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const HelpHero = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative w-full h-96 rounded-3xl overflow-hidden mb-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f70a504f9?w=1200&h=500&fit=crop)',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
          How can we help you today?
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="flex gap-2 bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
            <input
              type="text"
              placeholder="Type your question here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/70 px-4 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white rounded-full p-3 transition-colors flex-shrink-0"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpHero;
