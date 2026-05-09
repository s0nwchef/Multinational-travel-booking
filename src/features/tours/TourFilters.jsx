import React, { useState, useRef } from "react";
import { ChevronUp, ChevronDown, Map, Calendar, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MapModal from "../../components/MapModal";

const FilterHeader = ({ title, section, isOpen, onToggle, tours }) => (
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

export default function TourFilters({
  filters,
  onFilterChange,
  durationCounts,
  categories,
  tours,
}) {
  const startRef = useRef();
  const endRef = useRef();

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

  const today = new Date().toISOString().split("T")[0];

  return (
    <aside className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6 sticky top-4">
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
                  min="20"
                  max="10000"
                  value={filters.price}
                  onChange={(e) =>
                    onFilterChange("price", Number(e.target.value))
                  }
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-6"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 border border-gray-50 bg-gray-50/50 rounded-2xl p-3 text-[11px] text-gray-400 font-bold">
                    $ 20
                  </div>
                  <span className="text-gray-200">-</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 font-black text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      value={filters.price}
                      onChange={(e) =>
                        onFilterChange("price", Number(e.target.value))
                      }
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
                      onClick={() => startRef.current?.showPicker()}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-orange-500 cursor-pointer"
                    />

                    <input
                      ref={startRef}
                      type="date"
                      value={filters.startDate}
                      min={today}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          onFilterChange("startDate", value);
                          if (filters.endDate && value > filters.endDate) {
                            onFilterChange("endDate", "");
                          }
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-orange-100 bg-orange-50/20 rounded-2xl text-xs text-gray-600 focus:border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-bold appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
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
                      onClick={() => endRef.current?.showPicker()}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-orange-500 cursor-pointer"
                    />

                    <input
                      ref={endRef}
                      type="date"
                      value={filters.endDate}
                      min={filters.startDate || today}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          if (filters.startDate && value < filters.startDate) {
                            alert("End date must be after start date");
                            return;
                          }
                          onFilterChange("endDate", value);
                        }
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-orange-100 bg-orange-50/20 rounded-2xl text-xs text-gray-600 focus:border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-bold appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
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
                {categories.map((cat) => (
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
                ))}
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
                  {
                    label: "Less than 1 day",
                    count: durationCounts["Less than 1 day"] || 0,
                  },
                  { label: "1 day", count: durationCounts["1 day"] || 0 },
                  { label: "2-3 days", count: durationCounts["2-3 days"] || 0 },
                  { label: "4+ days", count: durationCounts["4+ days"] || 0 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.duration.includes(item.label)}
                        onChange={(e) => {
                          let newDuration;

                          if (e.target.checked) {
                            newDuration = [...filters.duration, item.label];
                          } else {
                            newDuration = filters.duration.filter(
                              (d) => d !== item.label,
                            );
                          }

                          onFilterChange("duration", newDuration);
                        }}
                        className="w-5 h-5 accent-orange-500 rounded-lg border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />

                      <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-gray-300 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-400 transition-colors">
                      {durationCounts?.[item.label] || 0}
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
