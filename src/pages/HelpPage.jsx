import React, { useState } from 'react';
import HelpHero from '../features/help/HelpHero';
import HelpCategories from '../features/help/HelpCategories';
import PopularFAQs from '../features/help/PopularFAQs';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search functionality to filter FAQs and categories
    console.log('Searching for:', query);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Help Hero */}
        <HelpHero onSearch={handleSearch} />

        {/* Quick Help Categories */}
        <HelpCategories />

        {/* Popular FAQs */}
        <PopularFAQs />

        {/* Additional Help Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Still need help?</h3>
          <p className="mb-6 text-white/90">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row justify-center">
            <button className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="bg-white/20 backdrop-blur-sm border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 transition-colors">
              Chat with Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
