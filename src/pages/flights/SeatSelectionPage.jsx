import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const SEAT_ROWS = 15;
const SEAT_COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  const { flightId } = useParams();
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Mock occupied seats
  const occupiedSeats = ['2A', '2B', '3C', '5E', '5F', '10A', '12D'];

  const handleSeatClick = (seatId) => {
    if (!occupiedSeats.includes(seatId)) {
      setSelectedSeat(seatId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Select Your Seat</h1>
            <p className="text-sm font-medium text-gray-500">Flight {flightId || 'FL-001'} • SGN to HAN</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Seat Map Area */}
          <div className="lg:w-2/3 bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center">
            
            {/* Legend */}
            <div className="flex items-center gap-6 mb-12 bg-gray-50 px-6 py-3 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
                <span className="text-xs font-bold text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-xs font-bold text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-300"></div>
                <span className="text-xs font-bold text-gray-600">Occupied</span>
              </div>
            </div>

            {/* Plane Body */}
            <div className="relative bg-gray-50 rounded-[4rem] p-8 border-4 border-gray-200 w-full max-w-md">
              {/* Cockpit curve */}
              <div className="absolute -top-16 left-0 right-0 h-32 bg-gray-50 border-t-4 border-l-4 border-r-4 border-gray-200 rounded-t-[50%] -z-10"></div>

              <div className="flex justify-between mb-6 px-4">
                <div className="flex gap-4">
                  <span className="w-10 text-center font-bold text-gray-400">A</span>
                  <span className="w-10 text-center font-bold text-gray-400">B</span>
                  <span className="w-10 text-center font-bold text-gray-400">C</span>
                </div>
                <div className="flex gap-4">
                  <span className="w-10 text-center font-bold text-gray-400">D</span>
                  <span className="w-10 text-center font-bold text-gray-400">E</span>
                  <span className="w-10 text-center font-bold text-gray-400">F</span>
                </div>
              </div>

              <div className="space-y-4">
                {Array.from({ length: SEAT_ROWS }).map((_, rowIndex) => {
                  const rowNum = rowIndex + 1;
                  return (
                    <div key={rowNum} className="flex justify-between items-center">
                      <div className="flex gap-4">
                        {SEAT_COLS.slice(0, 3).map(col => {
                          const seatId = `${rowNum}${col}`;
                          const isOccupied = occupiedSeats.includes(seatId);
                          const isSelected = selectedSeat === seatId;
                          return (
                            <button
                              key={seatId}
                              onClick={() => handleSeatClick(seatId)}
                              disabled={isOccupied}
                              className={`w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-bold transition-all
                                ${isOccupied ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 
                                  isSelected ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110' : 
                                  'bg-white border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}
                              `}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="w-8 text-center text-xs font-black text-gray-300">
                        {rowNum}
                      </div>

                      <div className="flex gap-4">
                        {SEAT_COLS.slice(3, 6).map(col => {
                          const seatId = `${rowNum}${col}`;
                          const isOccupied = occupiedSeats.includes(seatId);
                          const isSelected = selectedSeat === seatId;
                          return (
                            <button
                              key={seatId}
                              onClick={() => handleSeatClick(seatId)}
                              disabled={isOccupied}
                              className={`w-10 h-10 rounded-t-xl rounded-b-md flex items-center justify-center text-xs font-bold transition-all
                                ${isOccupied ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 
                                  isSelected ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110' : 
                                  'bg-white border-2 border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}
                              `}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Checkout Summary */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Passenger Details</h3>
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Adult 1</p>
                  <p className="text-xs font-medium text-gray-500">
                    Seat: {selectedSeat ? <span className="text-primary font-bold">{selectedSeat}</span> : 'Not selected'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Add-ons</h4>
                <label className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Extra Baggage (20kg)</p>
                      <p className="text-xs text-gray-500">Checked baggage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">+$25</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Total Price</span>
                <span className="text-3xl font-black text-gray-900">$125.00</span>
              </div>
              <button 
                disabled={!selectedSeat}
                onClick={() => navigate('/checkout')}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
                  ${selectedSeat 
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                {selectedSeat ? (
                  <>Continue to Payment <CheckCircle2 className="w-5 h-5" /></>
                ) : (
                  'Select a seat to continue'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
