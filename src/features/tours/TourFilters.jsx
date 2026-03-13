import React, { useState } from "react";
import { ChevronUp, ChevronDown, Map, Calendar, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterHeader = ({ title, section, isOpen, onToggle }) => (
  <div
    className="flex items-center justify-between mb-6 cursor-pointer group"
    onClick={() => onToggle(section)}
  >
    <h3 className="font-black text-gray-900 uppercase tracking-widest text-[11px] group-hover:text-orange-500 transition-colors">
      {title}
    </h3>
    {isOpen ? (
      <ChevronUp size={16} className="text-orange-500" />
    ) : (
      <ChevronDown size={16} className="text-gray-400" />
    )}
  </div>
);

export default function TourFilters({ filters, onFilterChange }) {
  const [openSections, setOpenSections] = useState({
    price: true,
    availability: true,
    category: true,
    duration: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-4">
      {/* 1. Bản đồ giả lập */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] h-32 border-4 border-white shadow-xl shadow-orange-100/50"
      >
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop"
          alt="Map Preview"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
          <button className="bg-white px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 font-black text-[10px] text-gray-800 uppercase tracking-wider transition-transform hover:scale-105">
            <Map size={18} className="text-orange-500" />
            Show on Map
          </button>
        </div>
      </motion.div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl shadow-gray-200/40 space-y-8">
        {/* 2. Price Range */}
        <section>
          <FilterHeader
            title="Price Range"
            section="price"
            isOpen={openSections.price}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {openSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <input
                  type="range"
                  min="50"
                  max="1200"
                  value={filters.price}
                  onChange={(e) => onFilterChange("price", e.target.value)}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-6"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 border border-gray-50 bg-gray-50/50 rounded-2xl p-3 text-[11px] text-gray-400 font-bold">
                    $ 50
                  </div>
                  <span className="text-gray-200">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 font-black text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      value={filters.price}
                      onChange={(e) => onFilterChange("price", e.target.value)}
                      className="w-full pl-6 pr-3 py-3 border border-orange-100 bg-orange-50/20 rounded-2xl text-xs text-orange-600 font-black focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 3. Availability */}
        <section>
          <FilterHeader
            title="Availability"
            section="availability"
            isOpen={openSections.availability}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {openSections.availability && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {/* Start Date */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">
                    Start Date
                  </label>
                  <div className="relative group">
                    <Calendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");

                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        if (v.length > 5)
                          v = v.slice(0, 5) + "/" + v.slice(5, 9);

                        e.target.value = v;
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-2xl text-xs text-gray-600 outline-none focus:border-orange-200 focus:bg-orange-50/10 transition-all font-bold"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">
                    End Date
                  </label>
                  <div className="relative group">
                    <Calendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="MM/DD/YYYY"
                      maxLength={10}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        if (v.length > 5)
                          v = v.slice(0, 5) + "/" + v.slice(5, 9);
                        e.target.value = v;
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-2xl text-xs text-gray-600 outline-none focus:border-orange-200 focus:bg-orange-50/10 transition-all font-bold"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Category */}
        <section>
          <FilterHeader
            title="Category"
            section="category"
            isOpen={openSections.category}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {openSections.category && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2"
              >
                {["Day trips", "Boat tours", "Hiking", "Wild-life"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => onFilterChange("category", cat)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        filters.category === cat
                          ? "bg-orange-500 text-white shadow-lg"
                          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 5. Duration */}
        <section>
          <FilterHeader
            title="Duration"
            section="duration"
            isOpen={openSections.duration}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {openSections.duration && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {[
                  { label: "Less than 1 day", count: 450 },
                  { label: "1 day", count: 320 },
                  { label: "2-3 days", count: 150 },
                  { label: "4+ days", count: 80 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-400 transition-colors">
                      {item.count}
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 6. Guest Rating */}
        <section>
          <FilterHeader
            title="Guest Rating"
            section="rating"
            isOpen={openSections.rating}
            onToggle={toggleSection}
          />
          <AnimatePresence>
            {openSections.rating && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {[
                  { label: "5.0 Only", value: 5 },
                  { label: "4.0 & up", value: 4 },
                  { label: "3.0 & up", value: 3 },
                ].map((rate) => {
                  const isActive = filters.ratings === rate.value;

                  return (
                    <div
                      key={rate.value}
                      onClick={() => onFilterChange("ratings", rate.value)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                        isActive ? "bg-orange-50 shadow-sm" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isActive
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-200"
                        }`}
                      >
                        {isActive && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < rate.value ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-100"}`}
                          />
                        ))}
                        <span
                          className={`ml-2 text-[11px] font-black uppercase tracking-tight ${isActive ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {rate.label}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Nút reset rating */}
                {filters.ratings !== 0 && (
                  <button
                    onClick={() => onFilterChange("ratings", 0)}
                    className="text-[10px] font-bold text-orange-500 hover:underline mt-2 w-full text-center"
                  >
                    Clear Rating Filter
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </aside>
  );
}
