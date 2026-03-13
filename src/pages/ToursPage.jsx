import React, { useState } from "react";
import { List, LayoutGrid, Map as MapIcon, ChevronDown, X } from "lucide-react";
import TourList from "../features/tours/TourList";

export default function ToursPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      {/* 1. HEADER - Sử dụng max-w-350 */}
      <header className="max-w-350 mx-auto px-6 pt-10 pb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-3">
          <span>Tours</span> <span className="text-[10px]">/</span>
          <span>Europe</span> <span className="text-[10px]">/</span>
          <span className="text-gray-900 font-semibold">Italy</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1A202C] tracking-tight">
              Discover Italy
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Experience La Dolce Vita with our curated selection of{" "}
              <span className="font-bold text-gray-900">1,245 tours.</span>
            </p>
          </div>

          {/* Toolbar bên phải */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm flex items-center gap-8 cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">
                  Sort by:
                </span>
                <span className="text-[13px] font-bold text-gray-700">
                  Recommended
                </span>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
              <button className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <List size={18} />
              </button>
              <button className="p-2 text-gray-300 hover:text-gray-400 transition-colors">
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Map View Button */}
            <button
              onClick={() => setShowMap(true)}
              className="bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-sm flex items-center gap-2 text-[13px] font-black text-gray-800 hover:bg-gray-50 transition-all active:scale-95 shadow-orange-100"
            >
              <MapIcon
                size={18}
                className="text-orange-500"
                strokeWidth={2.5}
              />
              Map View
            </button>
          </div>
        </div>
      </header>

      {/* 2. BODY CONTENT - Sử dụng max-w-350 */}
      <main className="max-w-350 mx-auto px-6">
        <TourList />
      </main>

      {/* 3. MODAL BẢN ĐỒ (Hiển thị khi click Map View) */}
      {showMap && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col border border-white">
            {/* Nút đóng Map */}
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/90 hover:bg-red-500 hover:text-white rounded-2xl shadow-xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>

            {/* Bản đồ Ý */}
            <div className="w-full h-full">
              <iframe
                title="Italy Tour Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026315.2238392173!2d10.334085429184547!3d41.833621430985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d4fe8244d1edb9%3A0x446300f89c679621!2sItaly!5e0!3m2!1sen!2s!4v1700000000000"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
