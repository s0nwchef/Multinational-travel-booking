import React, { useState } from "react";
import { Map, Bus, Search, ArrowRight, Plane, ArrowRightLeft, User, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("flights");
  const [tripType, setTripType] = useState("round-trip");
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleSearch = () => {
    // Navigate to flights or tours based on active tab
    if (activeTab === "tours") {
      navigate("/tours");
    } else if (activeTab === "flights") {
      navigate("/flights/search");
    } else {
      navigate("/tours");
    }
  };

  return (
      <motion.div
          initial="hidden"
          animate="visible"
          className="relative w-full min-h-[calc(100vh-120px)] rounded-3xl mb-12 overflow-hidden group"
      >
        <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Plane wing in the sky"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
            referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 z-10 pt-10">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-md">
              Book Flights <span className="text-primary">Easily.</span><br />
              Travel <span className="text-primary">Smarter.</span>
            </h1>
          </motion.div>

          {/* Search Widget */}
          <motion.div
              variants={itemVariants}
              className="w-full max-w-5xl bg-[#3A3F58]/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10"
          >
            {/* Trip Type */}
            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 text-white/90 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === 'one-way' ? 'border-primary' : 'border-white/50 group-hover:border-white'}`}>
                  {tripType === 'one-way' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <input type="radio" name="tripType" className="hidden" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} />
                <span className="text-sm font-medium">One Way <ArrowRight className="inline w-3 h-3 ml-1" /></span>
              </label>
              <label className="flex items-center gap-2 text-white cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === 'round-trip' ? 'border-primary' : 'border-white/50 group-hover:border-white'}`}>
                  {tripType === 'round-trip' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <input type="radio" name="tripType" className="hidden" checked={tripType === 'round-trip'} onChange={() => setTripType('round-trip')} />
                <span className="text-sm font-medium text-primary">Round Trip <ArrowRightLeft className="inline w-3 h-3 ml-1" /></span>
              </label>
              <label className="flex items-center gap-2 text-white/90 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${tripType === 'multi-city' ? 'border-primary' : 'border-white/50 group-hover:border-white'}`}>
                  {tripType === 'multi-city' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <input type="radio" name="tripType" className="hidden" checked={tripType === 'multi-city'} onChange={() => setTripType('multi-city')} />
                <span className="text-sm font-medium">Multi City <ArrowRightLeft className="inline w-3 h-3 ml-1" /></span>
              </label>
            </div>

            {/* Inputs */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* From / To */}
              <div className="flex-1 flex flex-col md:flex-row bg-white/10 rounded-2xl p-1 relative">
                <div className="flex-1 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                  <p className="text-white/60 text-xs font-medium mb-1">Flying From</p>
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    <p className="text-white font-bold truncate">Ho Chi Minh <span className="text-primary">(SGN)</span></p>
                  </div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#4A5073] rounded-full flex items-center justify-center z-10 border-2 border-[#3A3F58] cursor-pointer hover:bg-[#5A6083] transition-colors">
                  <ArrowRightLeft className="w-4 h-4 text-white" />
                </div>

                <div className="flex-1 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer pl-8 md:pl-6">
                  <p className="text-white/60 text-xs font-medium mb-1">Flying To</p>
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-white/50" style={{ transform: 'rotate(90deg)' }} />
                    <p className="text-white font-bold truncate">Hanoi <span className="text-primary">(HAN)</span></p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex-[0.8] flex bg-white/10 rounded-2xl p-1">
                <div className="flex-1 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border-r border-white/10">
                  <p className="text-white/60 text-xs font-medium mb-1">Journey Date</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-xl">7</span>
                    <span className="text-white/90 text-sm font-medium">Apr 26</span>
                  </div>
                </div>
                <div className="flex-1 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                  <p className="text-white/60 text-xs font-medium mb-1">Return Date</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-xl">9</span>
                    <span className="text-white/90 text-sm font-medium">Apr 26</span>
                  </div>
                </div>
              </div>

              {/* Traveler */}
              <div className="flex-[0.6] bg-white/10 rounded-2xl p-1">
                <div className="w-full h-full px-4 py-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer flex flex-col justify-center">
                  <p className="text-white/60 text-xs font-medium mb-1">Traveler, Class</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-white font-bold text-sm">1 Traveler(s)</p>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                  onClick={handleSearch}
                  className="w-full md:w-auto px-8 bg-primary hover:bg-primary-dark text-white rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-primary/30 min-h-[64px]"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
  );
}
