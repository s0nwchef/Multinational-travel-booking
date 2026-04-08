import React from 'react';
import { Plane, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FlightCard({ flight }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Airline Info */}
        <div className="w-full md:w-1/4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center p-2 border border-gray-100">
            <img src={flight.airlineLogo} alt={flight.airline} className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{flight.airline}</h3>
            <p className="text-xs text-gray-500">{flight.id}</p>
          </div>
        </div>

        {/* Flight Timeline */}
        <div className="w-full md:w-2/4 flex items-center justify-between px-4">
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{flight.departureTime}</p>
            <p className="text-sm font-medium text-gray-500">{flight.origin}</p>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <p className="text-xs font-medium text-gray-400 mb-1">{flight.duration}</p>
            <div className="w-full flex items-center">
              <div className="h-[2px] flex-1 bg-gray-200 rounded-l-full"></div>
              <Plane className="w-4 h-4 text-primary mx-2" />
              <div className="h-[2px] flex-1 bg-gray-200 rounded-r-full"></div>
            </div>
            <p className="text-xs font-medium text-primary mt-1">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop(s)`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{flight.arrivalTime}</p>
            <p className="text-sm font-medium text-gray-500">{flight.destination}</p>
          </div>
        </div>

        {/* Price & Action */}
        <div className="w-full md:w-1/4 flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <p className="text-xs font-medium text-gray-500 mb-1">Price per adult</p>
          <p className="text-3xl font-black text-gray-900 mb-3">${flight.price.toFixed(2)}</p>
          <button 
            onClick={() => navigate(`/flights/${flight.id}/seats`)}
            className="w-full py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            Select <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-6 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-gray-400" />
          {flight.baggage}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {flight.type}
        </div>
      </div>
    </div>
  );
}
