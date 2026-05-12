import React, { useState } from 'react';
import { Plane, Calendar, Users, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FlightHeroSection() {
  const [tripType, setTripType] = useState('round-trip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [classType, setClassType] = useState('economy');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to flight search page with search params
    const params = new URLSearchParams({
      origin,
      destination,
      departDate,
      returnDate: tripType === 'round-trip' ? returnDate : '',
      travelers,
      classType,
      tripType
    });
    navigate(`/flights/search?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[550px] rounded-3xl overflow-hidden group">
      {/* Background Image */}
      <img
        alt="Airplane flying above clouds"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
        referrerPolicy="no-referrer"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center z-10">
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-xl tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Find Your Flight
        </h1>
        
        {/* Flight Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl">
          {/* Trip Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tripType === 'one-way'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              One-way
            </button>
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tripType === 'round-trip'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Round-trip
            </button>
            <button
              type="button"
              onClick={() => setTripType('multi-city')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tripType === 'multi-city'
                  ? 'bg-white text-gray-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Multi-city
            </button>
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Origin */}
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="From"
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-primary focus:outline-none"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>

            {/* Destination */}
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70 rotate-90" />
              <input
                type="text"
                placeholder="To"
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-primary focus:outline-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            {/* Depart Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="date"
                placeholder="Depart"
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-primary focus:outline-none"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
              />
            </div>

            {/* Return Date (only for round-trip) */}
            {tripType === 'round-trip' && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                <input
                  type="date"
                  placeholder="Return"
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-primary focus:outline-none"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Travelers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Travelers */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="text-gray-900">
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
              >
                <option value="economy" className="text-gray-900">Economy</option>
                <option value="premium" className="text-gray-900">Premium Economy</option>
                <option value="business" className="text-gray-900">Business</option>
                <option value="first" className="text-gray-900">First Class</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Search className="w-5 h-5" />
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
}
