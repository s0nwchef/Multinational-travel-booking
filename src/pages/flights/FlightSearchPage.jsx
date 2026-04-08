import React, { useState } from 'react';
import { motion } from 'motion/react';
import FlightFilters from './components/FlightFilters';
import FlightCard from './components/FlightCard';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';

const MOCK_FLIGHTS = [
  {
    id: 'FL-001',
    airline: 'Vietnam Airlines',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png',
    departureTime: '08:00',
    arrivalTime: '10:15',
    duration: '2h 15m',
    origin: 'SGN',
    destination: 'HAN',
    price: 125.00,
    stops: 0,
    type: 'Economy',
    baggage: '23kg Checked'
  },
  {
    id: 'FL-002',
    airline: 'Bamboo Airways',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/vi/thumb/e/e0/Bamboo_Airways_logo.svg/1200px-Bamboo_Airways_logo.svg.png',
    departureTime: '09:30',
    arrivalTime: '11:40',
    duration: '2h 10m',
    origin: 'SGN',
    destination: 'HAN',
    price: 110.00,
    stops: 0,
    type: 'Economy',
    baggage: '20kg Checked'
  },
  {
    id: 'FL-003',
    airline: 'VietJet Air',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/VietJet_Air_logo.svg/1200px-VietJet_Air_logo.svg.png',
    departureTime: '14:00',
    arrivalTime: '16:05',
    duration: '2h 05m',
    origin: 'SGN',
    destination: 'HAN',
    price: 85.00,
    stops: 0,
    type: 'Eco',
    baggage: '7kg Cabin'
  },
  {
    id: 'FL-004',
    airline: 'Vietnam Airlines',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png',
    departureTime: '18:00',
    arrivalTime: '20:15',
    duration: '2h 15m',
    origin: 'SGN',
    destination: 'HAN',
    price: 150.00,
    stops: 0,
    type: 'Business',
    baggage: '32kg Checked'
  }
];

export default function FlightSearchPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Search Header Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <span>Ho Chi Minh (SGN)</span>
              <ArrowRight className="w-5 h-5 text-primary" />
              <span>Hanoi (HAN)</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Date</span>
              <span>07 Apr 2026</span>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Travelers</span>
              <span>1 Adult, Economy</span>
            </div>
            <button className="px-6 py-2 bg-orange-50 text-primary rounded-full font-bold hover:bg-orange-100 transition-colors">
              Modify
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white rounded-2xl shadow-sm font-bold text-gray-700"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <FlightFilters />
          </div>

          {/* Flight Results */}
          <div className="lg:w-3/4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {MOCK_FLIGHTS.length} flights found
              </h2>
              <select className="bg-white border-none shadow-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer">
                <option>Cheapest first</option>
                <option>Fastest first</option>
                <option>Earliest departure</option>
                <option>Latest departure</option>
              </select>
            </div>

            <div className="space-y-4">
              {MOCK_FLIGHTS.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FlightCard flight={flight} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
