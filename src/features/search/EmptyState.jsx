import React from "react";
import { SearchX, RotateCcw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState({ searchTerm = "your location", onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-72 h-72 mb-8 bg-orange-50 rounded-[3.5rem] flex items-center justify-center"
      >
        <img
          src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg"
          alt="Not found"
          className="w-48 h-48 object-contain opacity-90"
        />
      </motion.div>

      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
        No results found for "{searchTerm}"
      </h2>
      <p className="text-gray-500 max-w-md text-center mb-10 font-medium leading-relaxed">
        We couldn't find any tours in this location. Try adjusting your filters
        or search for a different destination.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-black transition-all"
        >
          <RotateCcw size={20} />
          Clear Filters
        </button>
        <button className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 transition-all">
          Explore Popular
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
